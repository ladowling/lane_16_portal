import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'dealer' | 'admin';

export type AuthUser = {
  email: string;
  role: UserRole;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

type AuthContextValue = AuthState & {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = 'lane16_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as AuthState;
    } catch {
      // ignore malformed storage
    }
    return { user: null, token: null };
  });

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  const login = (token: string, user: AuthUser) => {
    setAuthState({ token, user });
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}