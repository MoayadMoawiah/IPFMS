import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/workflow-admin';

const BOARD_KEY = 'workflow-admin-board';

export function useWorkflowAdminBoard(documentType: string) {
  return useQuery({
    queryKey: [BOARD_KEY, documentType],
    queryFn: () => api.getWorkflowAdminBoard(documentType),
    enabled: !!documentType,
  });
}

export function useAdminMoveWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      instanceId,
      direction,
      comment,
    }: {
      instanceId: string;
      direction: 'FORWARD' | 'BACK';
      comment: string;
    }) => api.adminMoveWorkflow(instanceId, direction, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOARD_KEY] }),
  });
}

export function useAdminSetWorkflowStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      instanceId,
      stepNumber,
      comment,
    }: {
      instanceId: string;
      stepNumber: number;
      comment: string;
    }) => api.adminSetWorkflowStep(instanceId, stepNumber, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOARD_KEY] }),
  });
}

export function useAdminReturnWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      instanceId,
      comment,
    }: {
      instanceId: string;
      comment: string;
    }) => api.adminReturnWorkflowToRequester(instanceId, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOARD_KEY] }),
  });
}

export function useAdminReopenWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: {
      documentType: string;
      documentId: string;
      stepNumber?: number;
      comment: string;
    }) => api.adminReopenWorkflow(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [BOARD_KEY] }),
  });
}
