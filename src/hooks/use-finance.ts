import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/finance';

const COA_KEY = 'chart-of-accounts';
const JE_KEY = 'journal-entries';
const PREQ_KEY = 'payment-requests';
const PV_KEY = 'payment-vouchers';
const BANK_KEY = 'bank-accounts';
const DASHBOARD_KEY = 'dashboard';

// ── Chart of Accounts ────────────────────────────────────────────────────────

export function useChartOfAccounts(query = {}) {
  return useQuery({ queryKey: [COA_KEY, query], queryFn: () => api.getChartOfAccounts(query) });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createAccount(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [COA_KEY] }),
  });
}

// ── Journal Entries ──────────────────────────────────────────────────────────

export function useJournalEntries(query = {}) {
  return useQuery({ queryKey: [JE_KEY, query], queryFn: () => api.getJournalEntries(query) });
}

export function useJournalEntry(id: string) {
  return useQuery({ queryKey: [JE_KEY, id], queryFn: () => api.getJournalEntry(id), enabled: !!id });
}

export function useCreateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createJournalEntry(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [JE_KEY] }),
  });
}

export function usePostJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.postJournalEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [JE_KEY] }),
  });
}

export function useTrialBalance(params: { fromDate: string; toDate: string; fiscalYearId?: string }) {
  return useQuery({
    queryKey: ['trial-balance', params],
    queryFn: () => api.getTrialBalance(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
}

// ── Payment Requests ─────────────────────────────────────────────────────────

export function usePaymentRequests(query = {}) {
  return useQuery({ queryKey: [PREQ_KEY, query], queryFn: () => api.getPaymentRequests(query) });
}

export function usePaymentRequest(id: string) {
  return useQuery({
    queryKey: [PREQ_KEY, id],
    queryFn: () => api.getPaymentRequest(id),
    enabled: !!id,
  });
}

export function useCreatePaymentRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createPaymentRequest(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PREQ_KEY] }),
  });
}

export function useUpdatePaymentRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      api.updatePaymentRequest(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PREQ_KEY] });
      qc.invalidateQueries({ queryKey: [PREQ_KEY, id] });
    },
  });
}

export function useSubmitPaymentRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.submitPaymentRequest(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [PREQ_KEY] });
      qc.invalidateQueries({ queryKey: [PREQ_KEY, id] });
      qc.invalidateQueries({ queryKey: ['workflow-pending'] });
    },
  });
}

export function useApprovePaymentRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      api.approvePaymentRequest(id, comment),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PREQ_KEY] });
      qc.invalidateQueries({ queryKey: [PREQ_KEY, id] });
      qc.invalidateQueries({ queryKey: ['workflow-pending'] });
    },
  });
}

// ── Payment Vouchers ─────────────────────────────────────────────────────────

export function usePaymentVouchers(query = {}) {
  return useQuery({ queryKey: [PV_KEY, query], queryFn: () => api.getPaymentVouchers(query) });
}

export function usePaymentVoucher(id: string) {
  return useQuery({ queryKey: [PV_KEY, id], queryFn: () => api.getPaymentVoucher(id), enabled: !!id });
}

export function useCreatePaymentVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createPaymentVoucher(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PV_KEY] });
      qc.invalidateQueries({ queryKey: [PREQ_KEY] });
    },
  });
}

export function useSubmitPaymentVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.submitPaymentVoucher(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PV_KEY] }),
  });
}

export function useApprovePaymentVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => api.approvePaymentVoucher(id, comment),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PV_KEY] });
      qc.invalidateQueries({ queryKey: [PV_KEY, id] });
      qc.invalidateQueries({ queryKey: ['workflow-pending'] });
    },
  });
}

export function useMarkPaymentVoucherPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      paymentDetails,
    }: {
      id: string;
      paymentDetails: Record<string, unknown>;
    }) => api.markPaymentVoucherPaid(id, paymentDetails),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [PV_KEY] });
      qc.invalidateQueries({ queryKey: [PV_KEY, id] });
      qc.invalidateQueries({ queryKey: [PREQ_KEY] });
      qc.invalidateQueries({ queryKey: ['vendor-invoices'] });
    },
  });
}

// ── Bank Accounts ────────────────────────────────────────────────────────────

export function useBankAccounts(query = {}) {
  return useQuery({ queryKey: [BANK_KEY, query], queryFn: () => api.getBankAccounts(query) });
}

// ── Dashboards ───────────────────────────────────────────────────────────────

export function useExecutiveDashboard() {
  return useQuery({ queryKey: [DASHBOARD_KEY, 'executive'], queryFn: api.getExecutiveDashboard });
}

export function useFinanceDashboard() {
  return useQuery({ queryKey: [DASHBOARD_KEY, 'finance'], queryFn: api.getFinanceDashboard });
}

export function useProcurementDashboard() {
  return useQuery({ queryKey: [DASHBOARD_KEY, 'procurement'], queryFn: api.getProcurementDashboard });
}

export function useBudgetVsActual(grantId?: string) {
  return useQuery({
    queryKey: ['budget-vs-actual', grantId],
    queryFn: () => api.getBudgetVsActual(grantId),
  });
}

export function useGrantStatement(grantId: string) {
  return useQuery({
    queryKey: ['grant-statement', grantId],
    queryFn: () => api.getGrantStatement(grantId),
    enabled: !!grantId,
  });
}
