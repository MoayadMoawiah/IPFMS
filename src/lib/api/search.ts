import { apiClient } from './client';

export interface SearchResult {
  id: string;
  type: 'grant' | 'project' | 'vendor' | 'purchase_requisition' | 'purchase_order' | 'payment_voucher' | 'fixed_asset' | 'user';
  title: string;
  subtitle?: string;
  status?: string;
  href: string;
  meta?: Record<string, unknown>;
}

export interface GlobalSearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export async function globalSearch(query: string, limit = 20): Promise<GlobalSearchResponse> {
  const { data } = await apiClient.get<{ data: GlobalSearchResponse }>('/search', {
    params: { q: query, limit },
  });
  return data.data;
}

export async function getNotifications(query = {}) {
  const { data } = await apiClient.get('/notifications', { params: query });
  return data.data;
}

export async function getUnreadNotificationCount() {
  const { data } = await apiClient.get('/notifications/unread-count');
  return data.data;
}

export async function markNotificationRead(id: string) {
  const { data } = await apiClient.post(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.post('/notifications/read-all');
  return data.data;
}

export async function getWorkflowPendingTasks(query = {}) {
  const { data } = await apiClient.get('/workflow/pending', { params: query });
  return data.data;
}

export async function processWorkflowAction(instanceId: string, action: string, dto: Record<string, unknown> = {}) {
  const { data } = await apiClient.post(`/workflow/instances/${instanceId}/action`, {
    action,
    ...dto,
  });
  return data.data;
}

export async function getAuditLogs(query = {}) {
  const { data } = await apiClient.get('/audit', { params: query });
  return data.data;
}

export async function getUsers(query = {}) {
  const { data } = await apiClient.get('/users', { params: query });
  return data.data;
}

export async function getUser(id: string) {
  const { data } = await apiClient.get(`/users/${id}`);
  return data.data;
}
