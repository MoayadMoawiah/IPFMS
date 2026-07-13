import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  arabicName?: string;
  avatar?: string;
  departmentId?: string;
  roles: string[];
  permissions?: string[];
  isActive?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<{ data: LoginResponse }>('/auth/login', payload);
  return data.data;
}

export async function apiRefresh(refreshToken: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<{ data: AuthTokens }>('/auth/refresh', { refreshToken });
  return data.data;
}

export async function apiLogout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}

interface AuthRoleRef {
  id?: string;
  name: string;
  displayName?: string;
}

interface MeResponse extends Omit<AuthUser, 'roles'> {
  roles?: Array<string | AuthRoleRef>;
}

export async function apiGetMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ data: MeResponse }>('/auth/me');
  const raw = data.data;
  return {
    ...raw,
    roles: (raw.roles ?? []).map((r) => (typeof r === 'string' ? r : r.name)),
    permissions: raw.permissions ?? [],
  };
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/auth/change-password', { currentPassword, newPassword });
}
