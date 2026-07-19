import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/approvals';

export function useProcessDocumentApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.processDocumentApproval,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflow-pending'] });
      qc.invalidateQueries({ queryKey: ['purchase-requisitions'] });
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      qc.invalidateQueries({ queryKey: ['goods-receipts'] });
      qc.invalidateQueries({ queryKey: ['payment-vouchers'] });
      qc.invalidateQueries({ queryKey: ['rfqs'] });
    },
  });
}
