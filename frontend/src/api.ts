import type { AuthUser } from './Authontext';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lane-16-api.fly.dev';

type ApiOptions = RequestInit & {
  token?: string | null;
};

const getErrorMessage = async (response: Response) => {
  try {
    const body = await response.json();
    return body.message || body.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, body, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export type ApiAuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'STAFF' | 'DEALER';
  isAdmin: boolean;
};

export const mapApiUser = (user: ApiAuthUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role === 'DEALER' ? 'dealer' : user.isAdmin ? 'admin' : 'staff',
});

export const loginUser = (email: string, password: string) =>
  apiRequest<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getAuthUser = (token: string) =>
  apiRequest<ApiAuthUser>('/auth/me', { method: 'GET', token });

export const changePassword = (token: string, payload: { currentPassword: string; newPassword: string }) =>
  apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const forgotPassword = (email: string) =>
  apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (payload: { email: string; otp: string; newPassword: string }) =>
  apiRequest<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const submitVehicleListing = (payload: Record<string, unknown>) =>
  apiRequest<unknown>('/sellers/vehicle', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const uploadVehicleFile = (id: string, file: File, order: number) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<unknown>(`/upload/${id}?order=${order}`, {
    method: 'POST',
    body: formData,
  });
};

export const fetchVehicles = (token: string) =>
  apiRequest<unknown[]>('/sellers/vehicles', { method: 'GET', token });

export const fetchContacts = (token: string) =>
  apiRequest<unknown[]>('/contact', { method: 'GET', token });

export const fetchStaff = (token: string) =>
  apiRequest<unknown[]>('/admin/staff', { method: 'GET', token });

export const createStaff = (token: string, payload: { name: string; email: string }) =>
  apiRequest<Record<string, unknown>>('/admin/staff', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const createAdmin = (token: string, payload: { name: string; email: string; password: string }) =>
  apiRequest<Record<string, unknown>>('/admin/register', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const fetchDealers = (token: string) =>
  apiRequest<unknown[]>('/dealers', { method: 'GET', token });

export const createDealer = (token: string, payload: { name: string; email: string; phoneNumber: string }) =>
  apiRequest<Record<string, unknown>>('/dealers', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const getUploadUrl = (id: string) => `${API_BASE_URL}/upload/${id}`;
