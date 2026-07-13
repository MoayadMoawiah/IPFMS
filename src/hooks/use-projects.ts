import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/projects';

const PROJECTS_KEY = 'projects';
const ACTIVITIES_KEY = 'activities';
const GRANTS_KEY = 'grants';

// ── Projects ──────────────────────────────────────────────────────────────────

export function useProjects(query = {}) {
  return useQuery({ queryKey: [PROJECTS_KEY, query], queryFn: () => api.getProjects(query) });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: [PROJECTS_KEY, id],
    queryFn: () => api.getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: api.CreateProjectDto) => api.createProject(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<api.CreateProjectDto> }) =>
      api.updateProject(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY, id] });
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PROJECTS_KEY] }),
  });
}

// ── Milestones ────────────────────────────────────────────────────────────────

export function useCreateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, dto }: { projectId: string; dto: { title: string; dueDate: string; description?: string } }) =>
      api.createMilestone(projectId, dto),
    onSuccess: (_, { projectId }) => qc.invalidateQueries({ queryKey: [PROJECTS_KEY, projectId] }),
  });
}

export function useCompleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      api.completeMilestone(projectId, milestoneId),
    onSuccess: (_, { projectId }) => qc.invalidateQueries({ queryKey: [PROJECTS_KEY, projectId] }),
  });
}

// ── Activities ────────────────────────────────────────────────────────────────

export function useActivities(query = {}) {
  return useQuery({ queryKey: [ACTIVITIES_KEY, query], queryFn: () => api.getActivities(query) });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: api.CreateActivityDto) => api.createActivity(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
      qc.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
    },
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: Partial<api.CreateActivityDto>;
      grantId?: string;
    }) => api.updateActivity(id, dto),
    onSuccess: (_, { grantId }) => {
      qc.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
      if (grantId) {
        qc.invalidateQueries({ queryKey: [GRANTS_KEY, grantId] });
      } else {
        qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
      }
    },
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; grantId?: string }) => api.deleteActivity(id),
    onSuccess: (_, { grantId }) => {
      qc.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
      if (grantId) {
        qc.invalidateQueries({ queryKey: [GRANTS_KEY, grantId] });
      } else {
        qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
      }
    },
  });
}

export function useBudgetAvailability(grantId: string, budgetLineId?: string) {
  return useQuery({
    queryKey: ['budget-availability', grantId, budgetLineId],
    queryFn: () => api.getBudgetAvailability(grantId, budgetLineId),
    enabled: !!grantId,
    staleTime: 30 * 1000, // 30 seconds — frequently revalidated for budget control
  });
}
