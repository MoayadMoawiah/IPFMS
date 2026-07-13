import { apiClient } from './client';

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

// ── Goods Receipts ───────────────────────────────────────────────────────────

export async function getGoodsReceipts(query = {}) {
  const { data } = await apiClient.get('/procurement/goods-receipts', { params: query });
  return data.data;
}

export async function createGoodsReceipt(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/procurement/goods-receipts', dto);
  return data.data;
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
