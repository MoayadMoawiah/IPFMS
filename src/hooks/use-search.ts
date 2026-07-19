import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/search';

// ── Global Search ─────────────────────────────────────────────────────────────

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => api.globalSearch(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useNotifications(query = {}) {
  return useQuery({ queryKey: ['notifications', query], queryFn: () => api.getNotifications(query) });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: api.getUnreadNotificationCount,
    refetchInterval: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ── Workflow ──────────────────────────────────────────────────────────────────

export function useWorkflowPendingTasks(query = {}) {
  return useQuery({ queryKey: ['workflow-pending', query], queryFn: () => api.getWorkflowPendingTasks(query) });
}

export function useProcessWorkflowAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, action, dto }: {
      instanceId: string;
      action: string;
      dto?: Record<string, unknown>;
    }) => api.processWorkflowAction(instanceId, action, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflow-pending'] });
    },
  });
}

// ── Audit ─────────────────────────────────────────────────────────────────────

export function useAuditLogs(query = {}) {
  return useQuery({ queryKey: ['audit-logs', query], queryFn: () => api.getAuditLogs(query) });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function useUsers(query = {}) {
  return useQuery({ queryKey: ['users', query], queryFn: () => api.getUsers(query) });
}

export function useSystemUser(id: string) {
  return useQuery({ queryKey: ['users', id], queryFn: () => api.getUser(id), enabled: !!id });
}
