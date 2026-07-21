import { apiClient } from './client';

// ── Chart of Accounts ────────────────────────────────────────────────────────

export interface TrialBalanceAccount {
  id: string;
  code: string;
  name: string;
  accountType: string;
  normalBalance: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface TrialBalanceResult {
  accounts: TrialBalanceAccount[];
  totals: {
    totalDebit: number;
    totalCredit: number;
    isBalanced: boolean;
  };
}

export interface CoaTreeNode {
  id: string;
  code: string;
  name: string;
  accountType: string;
  isLeaf: boolean;
  children?: CoaTreeNode[];
}

export async function getChartOfAccounts(query = {}) {
  const { data } = await apiClient.get('/finance/accounts', { params: query });
  return data;
}

export async function getChartOfAccountsTree() {
  const { data } = await apiClient.get('/finance/accounts/tree');
  return (data.data ?? []) as CoaTreeNode[];
}

export async function createAccount(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/finance/accounts', dto);
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

export async function getTrialBalance(params: { periodId?: string; grantId?: string } = {}) {
  const { data } = await apiClient.get('/finance/journal-entries/trial-balance', { params });
  return data.data as TrialBalanceResult;
}

// ── Payment Requests ─────────────────────────────────────────────────────────

export async function getPaymentRequests(query = {}) {
  const { data } = await apiClient.get('/finance/payment-requests', { params: query });
  return data.data;
}

export async function getPaymentRequest(id: string) {
  const { data } = await apiClient.get(`/finance/payment-requests/${id}`);
  return data.data;
}

export async function createPaymentRequest(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/finance/payment-requests', dto);
  return data.data;
}

export async function updatePaymentRequest(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/finance/payment-requests/${id}`, dto);
  return data.data;
}

export async function submitPaymentRequest(id: string) {
  const { data } = await apiClient.post(`/finance/payment-requests/${id}/submit`);
  return data.data;
}

export async function approvePaymentRequest(id: string, comment?: string) {
  const { data } = await apiClient.post(`/finance/payment-requests/${id}/approve`, { comment });
  return data.data;
}

export async function getPaymentRequestCashReceipt(id: string) {
  const { data } = await apiClient.get(`/finance/payment-requests/${id}/cash-receipt`);
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

export async function approvePaymentVoucher(id: string, comment?: string) {
  const { data } = await apiClient.post(`/finance/payment-vouchers/${id}/approve`, { comment });
  return data.data;
}

export async function markPaymentVoucherPaid(id: string, paymentDetails: Record<string, unknown>) {
  const { data } = await apiClient.post(`/finance/payment-vouchers/${id}/mark-paid`, paymentDetails);
  return data.data;
}

// ── Cheques ──────────────────────────────────────────────────────────────────

export async function getCheques(query = {}) {
  const { data } = await apiClient.get('/finance/cheques', { params: query });
  return data.data;
}

export async function updateChequeStatus(id: string, status: string) {
  const { data } = await apiClient.patch(`/finance/cheques/${id}/status`, { status });
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
