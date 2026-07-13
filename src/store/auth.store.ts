import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '@/lib/api/auth';
import { clearTokens, setAccessToken, setRefreshToken } from '@/lib/api/client';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string, remember?: boolean) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  // Permission helpers
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken, remember = true) => {
        setAccessToken(accessToken, remember);
        setRefreshToken(refreshToken);
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.roles.includes('Super Admin')) return true;
        const perms = user.permissions ?? [];
        if (perms.includes('*:*')) return true;
        const [module] = permission.split(':');
        return perms.includes(permission) || perms.includes(`${module}:*`);
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.roles.includes(role);
      },

      hasAnyPermission: (permissions) => {
        const { hasPermission } = get();
        return permissions.some((p) => hasPermission(p));
      },
    }),
    {
      name: 'gpfms-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
