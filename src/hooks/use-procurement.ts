import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/procurement';

const PR_KEY = 'purchase-requisitions';
const PO_KEY = 'purchase-orders';
const VENDORS_KEY = 'vendors';
const RFQ_KEY = 'rfqs';
const GRN_KEY = 'goods-receipts';
const CONTRACTS_KEY = 'contracts';

// ── Purchase Requisitions ─────────────────────────────────────────────────────

export function usePurchaseRequisitions(query = {}) {
  return useQuery({ queryKey: [PR_KEY, query], queryFn: () => api.getPurchaseRequisitions(query) });
}

export function usePurchaseRequisition(id: string) {
  return useQuery({ queryKey: [PR_KEY, id], queryFn: () => api.getPurchaseRequisition(id), enabled: !!id });
}

export function useCreatePurchaseRequisition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createPurchaseRequisition(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PR_KEY] }),
  });
}

export function useSubmitPurchaseRequisition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.submitPurchaseRequisition(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PR_KEY] }),
  });
}

export function useDeletePurchaseRequisition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePurchaseRequisition(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PR_KEY] }),
  });
}

// ── Purchase Orders ───────────────────────────────────────────────────────────

export function usePurchaseOrders(query = {}) {
  return useQuery({ queryKey: [PO_KEY, query], queryFn: () => api.getPurchaseOrders(query) });
}

export function usePurchaseOrder(id: string) {
  return useQuery({ queryKey: [PO_KEY, id], queryFn: () => api.getPurchaseOrder(id), enabled: !!id });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createPurchaseOrder(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PO_KEY] }),
  });
}

export function useIssuePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.issuePurchaseOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PO_KEY] }),
  });
}

// ── Vendors ──────────────────────────────────────────────────────────────────

export function useVendors(query = {}) {
  return useQuery({ queryKey: [VENDORS_KEY, query], queryFn: () => api.getVendors(query) });
}

export function useVendor(id: string) {
  return useQuery({ queryKey: [VENDORS_KEY, id], queryFn: () => api.getVendor(id), enabled: !!id });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createVendor(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [VENDORS_KEY] }),
  });
}

// ── RFQ ──────────────────────────────────────────────────────────────────────

export function useRfqs(query = {}) {
  return useQuery({ queryKey: [RFQ_KEY, query], queryFn: () => api.getRfqs(query) });
}

export function useRfq(id: string) {
  return useQuery({ queryKey: [RFQ_KEY, id], queryFn: () => api.getRfq(id), enabled: !!id });
}

export function useCreateRfq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createRfq(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RFQ_KEY] }),
  });
}

// ── Goods Receipts ───────────────────────────────────────────────────────────

export function useGoodsReceipts(query = {}) {
  return useQuery({ queryKey: [GRN_KEY, query], queryFn: () => api.getGoodsReceipts(query) });
}

export function useCreateGoodsReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createGoodsReceipt(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [GRN_KEY] }),
  });
}

// ── Contracts ─────────────────────────────────────────────────────────────────

export function useContracts(query = {}) {
  return useQuery({ queryKey: [CONTRACTS_KEY, query], queryFn: () => api.getContracts(query) });
}

export function useContract(id: string) {
  return useQuery({ queryKey: [CONTRACTS_KEY, id], queryFn: () => api.getContract(id), enabled: !!id });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createContract(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CONTRACTS_KEY] }),
  });
}
