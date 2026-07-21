import { apiClient } from './client';
import type { PrApprovalResult } from '@/lib/procurement/post-approval-redirect';

// ── Purchase Requisitions ─────────────────────────────────────────────────────

export async function getPurchaseRequisitions(query = {}) {
  const { data } = await apiClient.get('/procurement/requisitions', { params: query });
  return data.data;
}

export async function getPurchaseRequisition(id: string) {
  const { data } = await apiClient.get(`/procurement/requisitions/${id}`);
  return data.data;
}

export async function createPurchaseRequisition(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/requisitions', dto);
  return data.data;
}

export async function updatePurchaseRequisition(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/procurement/requisitions/${id}`, dto);
  return data.data;
}

export async function submitPurchaseRequisition(id: string) {
  const { data } = await apiClient.post(`/procurement/requisitions/${id}/submit`);
  return data.data;
}

export async function approvePurchaseRequisition(id: string, comment?: string): Promise<PrApprovalResult> {
  const { data } = await apiClient.post(`/procurement/requisitions/${id}/approve`, { comment });
  return data.data;
}

export async function rejectPurchaseRequisition(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/requisitions/${id}/reject`, { comment });
  return data.data;
}

export async function returnPurchaseRequisition(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/requisitions/${id}/return`, { comment });
  return data.data;
}

export async function deletePurchaseRequisition(id: string) {
  await apiClient.delete(`/procurement/requisitions/${id}`);
}

// ── Purchase Orders ───────────────────────────────────────────────────────────

export async function getPurchaseOrders(query = {}) {
  const { data } = await apiClient.get('/procurement/purchase-orders', { params: query });
  return data.data;
}

export async function getPurchaseOrder(id: string) {
  const { data } = await apiClient.get(`/procurement/purchase-orders/${id}`);
  return data.data;
}

export async function createPurchaseOrder(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/purchase-orders', dto);
  return data.data;
}

export async function submitPurchaseOrder(id: string) {
  const { data } = await apiClient.post(`/procurement/purchase-orders/${id}/submit`);
  return data.data;
}

export async function approvePurchaseOrder(id: string, comment?: string) {
  const { data } = await apiClient.post(`/procurement/purchase-orders/${id}/approve`, { comment });
  return data.data;
}

export async function rejectPurchaseOrder(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/purchase-orders/${id}/reject`, { comment });
  return data.data;
}

export async function returnPurchaseOrder(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/purchase-orders/${id}/return`, { comment });
  return data.data;
}

export async function issuePurchaseOrder(id: string) {
  const { data } = await apiClient.post(`/procurement/purchase-orders/${id}/issue`);
  return data.data;
}

// ── Vendors ──────────────────────────────────────────────────────────────────

export async function getVendors(query = {}) {
  const { data } = await apiClient.get('/procurement/vendors', { params: query });
  return data.data;
}

export async function getVendor(id: string) {
  const { data } = await apiClient.get(`/procurement/vendors/${id}`);
  return data.data;
}

export async function createVendor(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/vendors', dto);
  return data.data;
}

export async function updateVendor(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/procurement/vendors/${id}`, dto);
  return data.data;
}

// ── RFQ ──────────────────────────────────────────────────────────────────────

export async function getRfqs(query = {}) {
  const { data } = await apiClient.get('/procurement/rfq', { params: query });
  return data.data;
}

export async function getRfq(id: string) {
  const { data } = await apiClient.get(`/procurement/rfq/${id}`);
  return data.data;
}

export async function createRfq(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/rfq', dto);
  return data.data;
}

export async function issueRfq(id: string) {
  const { data } = await apiClient.post(`/procurement/rfq/${id}/issue`);
  return data.data;
}

export async function inviteRfqVendor(id: string, vendorId: string) {
  const { data } = await apiClient.post(`/procurement/rfq/${id}/vendors`, { vendorId });
  return data.data;
}

export async function updateRfqQuotation(
  id: string,
  rfqVendorId: string,
  dto: Record<string, unknown>,
) {
  const { data } = await apiClient.patch(`/procurement/rfq/${id}/vendors/${rfqVendorId}`, dto);
  return data.data;
}

export async function awardRfqVendor(id: string, rfqVendorId: string) {
  const { data } = await apiClient.post(`/procurement/rfq/${id}/vendors/${rfqVendorId}/award`);
  return data.data;
}

export async function getRfqComparison(id: string) {
  const { data } = await apiClient.get(`/procurement/rfq/${id}/comparison`);
  return data.data;
}

// ── PAF ──────────────────────────────────────────────────────────────────────

export async function getPafs(query: { rfqId?: string; prId?: string } = {}) {
  const { data } = await apiClient.get('/procurement/paf', { params: query });
  return data.data;
}

export async function getPaf(id: string) {
  const { data } = await apiClient.get(`/procurement/paf/${id}`);
  return data.data;
}

export async function createPaf(dto: {
  rfqId: string;
  rfqVendorId: string;
  justification: string;
  committeeMembers?: { name: string; role: string }[];
}) {
  const { data } = await apiClient.post('/procurement/paf', dto);
  return data.data;
}

// ── Goods Receipts ───────────────────────────────────────────────────────────

export async function getGoodsReceipts(query = {}) {
  const { data } = await apiClient.get('/procurement/goods-receipts', { params: query });
  return data.data;
}

export async function getGoodsReceipt(id: string) {
  const { data } = await apiClient.get(`/procurement/goods-receipts/${id}`);
  return data.data;
}

export async function createGoodsReceipt(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/goods-receipts', dto);
  return data.data;
}

export async function updateGoodsReceipt(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/procurement/goods-receipts/${id}`, dto);
  return data.data;
}

export async function submitGoodsReceipt(id: string) {
  const { data } = await apiClient.post(`/procurement/goods-receipts/${id}/submit`);
  return data.data;
}

export async function approveGoodsReceipt(id: string, comment?: string) {
  const { data } = await apiClient.post(`/procurement/goods-receipts/${id}/approve`, { comment });
  return data.data;
}

export async function rejectGoodsReceipt(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/goods-receipts/${id}/reject`, { comment });
  return data.data;
}

export async function returnGoodsReceipt(id: string, comment: string) {
  const { data } = await apiClient.post(`/procurement/goods-receipts/${id}/return`, { comment });
  return data.data;
}

// ── Vendor Invoices ───────────────────────────────────────────────────────────

export async function getVendorInvoices(query = {}) {
  const { data } = await apiClient.get('/procurement/vendor-invoices', { params: query });
  return data.data;
}

export async function getVendorInvoice(id: string) {
  const { data } = await apiClient.get(`/procurement/vendor-invoices/${id}`);
  return data.data;
}

export async function createVendorInvoice(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/vendor-invoices', dto);
  return data.data;
}

export async function submitVendorInvoice(id: string) {
  const { data } = await apiClient.post(`/procurement/vendor-invoices/${id}/submit`);
  return data.data;
}

export async function approveVendorInvoice(id: string, comment?: string) {
  const { data } = await apiClient.post(`/procurement/vendor-invoices/${id}/approve`, {
    comment,
  });
  return data.data;
}

export async function deleteVendorInvoice(id: string) {
  await apiClient.delete(`/procurement/vendor-invoices/${id}`);
}

// ── Contracts ─────────────────────────────────────────────────────────────────

export async function getContracts(query = {}) {
  const { data } = await apiClient.get('/procurement/contracts', { params: query });
  return data.data;
}

export async function getContract(id: string) {
  const { data } = await apiClient.get(`/procurement/contracts/${id}`);
  return data.data;
}

export async function createContract(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/contracts', dto);
  return data.data;
}

// ── Procurement Methods ───────────────────────────────────────────────────────

export async function getProcurementMethods() {
  const { data } = await apiClient.get('/procurement/methods');
  return data.data;
}
