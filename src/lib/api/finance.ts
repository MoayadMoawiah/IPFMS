import { apiClient } from './client';

// ── Chart of Accounts ────────────────────────────────────────────────────────

export async function getChartOfAccounts(query = {}) {
  const { data } = await apiClient.get('/finance/chart-of-accounts', { params: query });
  return data.data;
}

export async function createAccount(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/finance/chart-of-accounts', dto);
  return data.data;
}

// ── Journal Entries ──────────────────────────────────────────────────────────

export async function getJournalEntries(query = {}) {
  const { data } = await apiClient.get('/finance/journal-entries', { params: query });
  return data.data;
}

export async function getJournalEntry(id: string) {
  const { data } = await apiClient.get(`/finance/journal-entries/${id}`);
  return data.data;
}

export async function createJournalEntry(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/finance/journal-entries', dto);
  return data.data;
}

export async function postJournalEntry(id: string) {
  const { data } = await apiClient.post(`/finance/journal-entries/${id}/post`);
  return data.data;
}

export async function getTrialBalance(params: { fromDate: string; toDate: string; fiscalYearId?: string }) {
  const { data } = await apiClient.get('/finance/journal-entries/trial-balance', { params });
  return data.data;
}

// ── Payment Vouchers ─────────────────────────────────────────────────────────

export async function getPaymentVouchers(query = {}) {
  const { data } = await apiClient.get('/finance/payment-vouchers', { params: query });
  return data.data;
}

export async function getPaymentVoucher(id: string) {
  const { data } = await apiClient.get(`/finance/payment-vouchers/${id}`);
  return data.data;
}

export async function createPaymentVoucher(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/finance/payment-vouchers', dto);
  return data.data;
}

export async function submitPaymentVoucher(id: string) {
  const { data } = await apiClient.post(`/finance/payment-vouchers/${id}/submit`);
  return data.data;
}

export async function markPaymentVoucherPaid(id: string, paymentDetails: Record<string, unknown>) {
  const { data } = await apiClient.post(`/finance/payment-vouchers/${id}/pay`, paymentDetails);
  return data.data;
}

// ── Bank Accounts ────────────────────────────────────────────────────────────

export async function getBankAccounts(query = {}) {
  const { data } = await apiClient.get('/finance/bank-accounts', { params: query });
  return data.data;
}

export async function getBankStatements(bankAccountId: string, query = {}) {
  const { data } = await apiClient.get(`/finance/bank-accounts/${bankAccountId}/statements`, { params: query });
  return data.data;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getExecutiveDashboard() {
  const { data } = await apiClient.get('/dashboard/executive');
  return data.data;
}

export async function getFinanceDashboard() {
  const { data } = await apiClient.get('/dashboard/finance');
  return data.data;
}

export async function getProcurementDashboard() {
  const { data } = await apiClient.get('/dashboard/procurement');
  return data.data;
}

// ── Reports ──────────────────────────────────────────────────────────────────

export async function getBudgetVsActual(grantId?: string) {
  const { data } = await apiClient.get('/finance/reports/budget-vs-actual', { params: { grantId } });
  return data.data;
}

export async function getGrantStatement(grantId: string) {
  const { data } = await apiClient.get('/finance/reports/grant-statement', { params: { grantId } });
  return data.data;
}
