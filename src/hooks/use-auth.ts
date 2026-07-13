import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { apiLogin, apiLogout, LoginPayload } from '@/lib/api/auth';
import { getRefreshToken } from '@/lib/api/client';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, hasPermission, hasRole, hasAnyPermission, setUser, setTokens, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload, remember = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiLogin(payload);
      setTokens(result.accessToken, result.refreshToken, remember);
      setUser(result.user);
      router.push('/dashboard');
      return result;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) await apiLogout(refreshToken);
    } catch {
      // silently fail — still clear local state
    } finally {
      logout();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    hasPermission,
    hasRole,
    hasAnyPermission,
  };
}
