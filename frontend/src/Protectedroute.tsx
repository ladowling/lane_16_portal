import type { ReactNode } from 'react';
import { useAuth, UserRole } from './Authontext';


type ProtectedRouteProps = {
  allowedRole: UserRole;
  onRedirectToLogin: () => void;
  children: ReactNode;
};

/**
 * Renders children only when the authenticated user has the required role.
 * Otherwise calls onRedirectToLogin so App.tsx can handle the redirect.
 *
 * This is a render-time guard — it does not use React Router, keeping it
 * consistent with the existing manual routing pattern in App.tsx.
 */
export function ProtectedRoute({ allowedRole, onRedirectToLogin, children }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user || user.role !== allowedRole) {
    // Schedule the redirect after render to avoid setState-during-render
    setTimeout(onRedirectToLogin, 0);
    return null;
  }

  return <>{children}</>;
}