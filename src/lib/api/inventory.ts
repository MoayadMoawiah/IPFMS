import { apiClient } from './client';

// ── Inventory ─────────────────────────────────────────────────────────────────

export async function getInventoryItems(query = {}) {
  const { data } = await apiClient.get('/inventory/items', { params: query });
  return data.data;
}

export async function getInventoryItem(id: string) {
  const { data } = await apiClient.get(`/inventory/items/${id}`);
  return data.data;
}

export async function createInventoryItem(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/inventory/items', dto);
  return data.data;
}

export async function updateInventoryItem(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/inventory/items/${id}`, dto);
  return data.data;
}

export async function getStockMovements(itemId: string, query = {}) {
  const { data } = await apiClient.get(`/inventory/items/${itemId}/movements`, { params: query });
  return data.data;
}

export async function recordStockMovement(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/inventory/movements', dto);
  return data.data;
}

export async function getLowStockItems() {
  const { data } = await apiClient.get('/inventory/items/low-stock');
  return data.data;
}

export async function getWarehouses(query = {}) {
  const { data } = await apiClient.get('/inventory/warehouses', { params: query });
  return data.data;
}

export async function createWarehouse(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/inventory/warehouses', dto);
  return data.data;
}

// ── Fixed Assets ──────────────────────────────────────────────────────────────

export async function getFixedAssets(query = {}) {
  const { data } = await apiClient.get('/assets', { params: query });
  return data.data;
}

export async function getFixedAsset(id: string) {
  const { data } = await apiClient.get(`/assets/${id}`);
  return data.data;
}

export async function createFixedAsset(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/assets', dto);
  return data.data;
}

export async function updateFixedAsset(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/assets/${id}`, dto);
  return data.data;
}

export async function assignFixedAsset(id: string, dto: { assignedToId: string; location?: string; notes?: string }) {
  const { data } = await apiClient.post(`/assets/${id}/assign`, dto);
  return data.data;
}

export async function disposeFixedAsset(id: string, dto: Record<string, unknown>) {
  const { data } = await apiClient.post(`/assets/${id}/dispose`, dto);
  return data.data;
}

export async function runDepreciation(id: string) {
  const { data } = await apiClient.post(`/assets/${id}/depreciate`);
  return data.data;
}

export async function getAssetCategories() {
  const { data } = await apiClient.get('/assets/categories');
  return data.data;
}

export async function createAssetCategory(dto: Record<string, unknown>) {
  const { data } = await apiClient.post('/assets/categories', dto);
  return data.data;
}
