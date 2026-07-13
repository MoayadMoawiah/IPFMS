/**
 * Backward-compatibility shim.
 * New code should use:
 *   - useAuthStore from @/store/auth.store
 *   - useAuth from @/hooks/use-auth
 *   - getAccessToken / setAccessToken from @/lib/api/client
 */

export { getAccessToken as getAuthToken, setAccessToken as setAuthToken, clearTokens as clearAuthToken } from './api/client';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = sessionStorage.getItem('gpfms_at') || localStorage.getItem('gpfms_at');
  return !!token;
}

export const AUTH_TOKEN_KEY = 'gpfms_at';
