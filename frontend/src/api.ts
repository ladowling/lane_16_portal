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
  role: 'STAFF' | 'BUYER';
  isAdmin: boolean;
};

export const mapApiUser = (user: ApiAuthUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role === 'BUYER' ? 'dealer' : user.isAdmin ? 'admin' : 'staff',
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

export const approveVehicle = (
  token: string,
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED' | 'SOLD' | 'AVAILABLE'; auctionStartTime?: string; auctionEndTime?: string }
) =>
  apiRequest<Record<string, unknown>>(`/sellers/vehicles/${id}/approve`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

// PATCH /sellers/vehicles/{id}/valuation — Admin only
export const updateVehicleValuation = (
  token: string,
  id: string,
  payload: {
    kbbTradeInValue?: number;
    kbbPrivatePartyValue?: number;
    mmrValue?: number;
    carMaxOffer?: number;
    carvanaOffer?: number;
    acvWholesaleEstimate?: number;
    finalTransactionPrice?: number | null;
    reasonNotSold?: string | null;
    adminValuationNotes?: string | null;
  }
) =>
  apiRequest<Record<string, unknown>>(`/sellers/vehicles/${id}/valuation`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

export const fetchContacts = (token: string) =>
  apiRequest<unknown[]>('/contact', { method: 'GET', token });

export const submitContact = (payload: { name: string; phoneNo: string; email: string; message: string }) =>
  apiRequest<{ message: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchStaff = (token: string) =>
  apiRequest<unknown[]>('/admin/staff', { method: 'GET', token });

export const createStaff = (token: string, payload: { name: string; email: string }) =>
  apiRequest<Record<string, unknown>>('/admin/staff', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const updateStaff = (token: string, id: string, payload: { name?: string; email?: string; phoneNumber?: string }) =>
  apiRequest<Record<string, unknown>>(`/admin/staff/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

export const createAdmin = (token: string, payload: { name: string; email: string; password: string }) =>
  apiRequest<Record<string, unknown>>('/admin/register', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

// ── Buyers (replaces /dealers) ───────────────────────────────────────────────

export type BuyerDealership = {
  name: string;
  address: string;
};

// GET /buyers — fetch all buyers
export const fetchBuyers = (token: string) =>
  apiRequest<unknown[]>('/buyers', { method: 'GET', token });

// POST /buyers — onboard a new buyer with one or more dealerships
export const createBuyer = (
  token: string,
  payload: { name: string; email: string; phoneNumber: string; dealerships: BuyerDealership[] }
) =>
  apiRequest<Record<string, unknown>>('/buyers', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

// PATCH /buyers/{id} — update buyer name, email, phone, or dealership associations
export const updateBuyer = (
  token: string,
  id: string,
  payload: { name?: string; email?: string; phoneNumber?: string; dealerships?: BuyerDealership[] }
) =>
  apiRequest<Record<string, unknown>>(`/buyers/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

export const getUploadUrl = (id: string) => `${API_BASE_URL}/upload/${id}`;

// ── Bids ────────────────────────────────────────────────────────────────────

// POST /buyers/bids — { vehicleId, amount }
export const placeBid = (token: string, vehicleId: string, amount: number, dealershipName?: string, dealershipAddress?: string) =>
  apiRequest<Record<string, unknown>>('/buyers/bids', {
    method: 'POST',
    token,
    body: JSON.stringify({ vehicleId, amount, dealershipName, dealershipAddress }),
  });

// GET /buyers/bids/vehicle/{id} — all bids for a vehicle
export const fetchVehicleBids = (token: string, vehicleId: string) =>
  apiRequest<unknown[]>(`/buyers/bids/vehicle/${vehicleId}`, { method: 'GET', token });

// GET /buyers/bids/{id} — single bid by bid ID
export const fetchBidById = (token: string, bidId: string) =>
  apiRequest<unknown>(`/buyers/bids/${bidId}`, { method: 'GET', token });

// Kept for backward compat — resolves to fetchBidById since no dealer-specific bid list endpoint exists in current spec
export const fetchDealerBids = (token: string, dealerId: string) =>
  apiRequest<unknown[]>(`/buyers/bids/${dealerId}`, { method: 'GET', token });

// Legacy aliases — kept so existing callers don't break during transition
/** @deprecated Use fetchBuyers instead */
export const fetchDealers = fetchBuyers;
/** @deprecated Use createBuyer instead */
export const createDealer = (token: string, payload: { name: string; email: string; phoneNumber: string }) =>
  createBuyer(token, { ...payload, dealerships: [] });
/** @deprecated Use updateBuyer instead */
export const updateDealer = (token: string, id: string, payload: { name?: string; email?: string; phoneNumber?: string }) =>
  updateBuyer(token, id, payload);
