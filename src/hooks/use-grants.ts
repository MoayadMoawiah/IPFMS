import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGrants,
  getGrant,
  getGrantBudgetSummary,
  createGrant,
  updateGrant,
  submitGrant,
  activateGrant,
  closeGrant,
  deleteGrant,
  GrantsQuery,
  CreateGrantDto,
} from '@/lib/api/grants';
import { getDonors } from '@/lib/api/donors';

// Query keys
export const GRANTS_KEY = 'grants';
export const DONORS_KEY = 'donors';

// ── List ─────────────────────────────────────────────────────────────────────

export function useGrants(query: GrantsQuery = {}) {
  return useQuery({
    queryKey: [GRANTS_KEY, query],
    queryFn: () => getGrants(query),
  });
}

export function useGrant(id: string) {
  return useQuery({
    queryKey: [GRANTS_KEY, id],
    queryFn: () => getGrant(id),
    enabled: !!id,
  });
}

export function useGrantBudgetSummary(id: string) {
  return useQuery({
    queryKey: [GRANTS_KEY, id, 'budget'],
    queryFn: () => getGrantBudgetSummary(id),
    enabled: !!id,
  });
}

export function useDonors(query = {}) {
  return useQuery({
    queryKey: [DONORS_KEY, query],
    queryFn: () => getDonors(query),
  });
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useCreateGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGrantDto) => createGrant(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [GRANTS_KEY] }),
  });
}

export function useUpdateGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateGrantDto> }) =>
      updateGrant(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [GRANTS_KEY, id] });
      qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
    },
  });
}

export function useSubmitGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitGrant(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [GRANTS_KEY, id] });
      qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
    },
  });
}

export function useActivateGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateGrant(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [GRANTS_KEY, id] });
      qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
    },
  });
}

export function useCloseGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, closureNotes }: { id: string; closureNotes: string }) =>
      closeGrant(id, closureNotes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [GRANTS_KEY, id] });
      qc.invalidateQueries({ queryKey: [GRANTS_KEY] });
    },
  });
}

export function useDeleteGrant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGrant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [GRANTS_KEY] }),
  });
}
