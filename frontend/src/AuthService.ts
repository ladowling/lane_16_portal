import { AuthUser } from "./Authontext";


type LoginResponse = {
  token: string;
  user: AuthUser;
};

// ---------------------------------------------------------------------------
// MOCK CREDENTIALS — replace this function body with a real fetch() call
// when the backend is ready. The shape of LoginResponse must stay the same.
// ---------------------------------------------------------------------------
const MOCK_USERS: Record<string, { password: string; role: AuthUser['role'] }> = {
  'dealer@lane16.com':  { password: 'dealer123', role: 'dealer' },
  'admin@lane16.com':   { password: 'admin123',  role: 'admin'  },
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const entry = MOCK_USERS[email.toLowerCase()];

  if (!entry || entry.password !== password) {
    throw new Error('Invalid email or password.');
  }

  return {
    token: `mock-jwt-token-${Date.now()}`,
    user: { email: email.toLowerCase(), role: entry.role },
  };
}