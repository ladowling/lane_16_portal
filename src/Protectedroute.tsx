import { useEffect, type ReactNode } from 'react';
import { useAuth, UserRole } from './Authontext';


type ProtectedRouteProps = {
  allowedRole: UserRole | UserRole[];
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
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  const isAllowed = Boolean(token && user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!isAllowed) {
      onRedirectToLogin();
    }
  }, [isAllowed, onRedirectToLogin]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
