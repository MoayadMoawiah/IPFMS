import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Request interceptor: attach access token ──────────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: refresh token on 401 ───────────────────────────────
let isRefreshing = false;
let failedQueue: { resolve: (value: string) => void; reject: (reason?: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string = data.data.refreshToken;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── Token storage helpers (memory + sessionStorage) ───────────────────────────
const ACCESS_TOKEN_KEY = 'gpfms_at';
const REFRESH_TOKEN_KEY = 'gpfms_rt';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
  // Guard against stale "undefined" string stored by previous bad code
  return token && token !== 'undefined' ? token : null;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string, remember = true): void {
  if (typeof window === 'undefined' || !token) return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  if (remember) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Set session cookie so the SSR middleware can detect authentication
  const maxAge = remember ? '; max-age=604800' : '';
  document.cookie = `gpfms_session=1; path=/${maxAge}`;
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear the session cookie
  document.cookie = 'gpfms_session=; path=/; max-age=0';
}
