import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/inventory';

const ITEMS_KEY = 'inventory-items';
const WAREHOUSES_KEY = 'warehouses';
const ASSETS_KEY = 'fixed-assets';
const ASSET_CATEGORIES_KEY = 'asset-categories';

// ── Inventory Items ───────────────────────────────────────────────────────────

export function useInventoryItems(query = {}) {
  return useQuery({ queryKey: [ITEMS_KEY, query], queryFn: () => api.getInventoryItems(query) });
}

export function useInventoryItem(id: string) {
  return useQuery({ queryKey: [ITEMS_KEY, id], queryFn: () => api.getInventoryItem(id), enabled: !!id });
}

export function useCreateInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createInventoryItem(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ITEMS_KEY] }),
  });
}

export function useUpdateInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) => api.updateInventoryItem(id, dto),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: [ITEMS_KEY, id] }),
  });
}

export function useRecordStockMovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.recordStockMovement(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ITEMS_KEY] }),
  });
}

export function useLowStockItems() {
  return useQuery({ queryKey: [ITEMS_KEY, 'low-stock'], queryFn: api.getLowStockItems });
}

export function useWarehouses(query = {}) {
  return useQuery({ queryKey: [WAREHOUSES_KEY, query], queryFn: () => api.getWarehouses(query) });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createWarehouse(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [WAREHOUSES_KEY] }),
  });
}

// ── Fixed Assets ──────────────────────────────────────────────────────────────

export function useFixedAssets(query = {}) {
  return useQuery({ queryKey: [ASSETS_KEY, query], queryFn: () => api.getFixedAssets(query) });
}

export function useFixedAsset(id: string) {
  return useQuery({ queryKey: [ASSETS_KEY, id], queryFn: () => api.getFixedAsset(id), enabled: !!id });
}

export function useCreateFixedAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createFixedAsset(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ASSETS_KEY] }),
  });
}

export function useUpdateFixedAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) => api.updateFixedAsset(id, dto),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: [ASSETS_KEY, id] }),
  });
}

export function useAssignFixedAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { assignedToId: string; location?: string; notes?: string } }) =>
      api.assignFixedAsset(id, dto),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: [ASSETS_KEY, id] }),
  });
}

export function useDisposeFixedAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) => api.disposeFixedAsset(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ASSETS_KEY] }),
  });
}

export function useRunDepreciation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.runDepreciation(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: [ASSETS_KEY, id] }),
  });
}

export function useAssetCategories() {
  return useQuery({ queryKey: [ASSET_CATEGORIES_KEY], queryFn: api.getAssetCategories });
}

export function useCreateAssetCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => api.createAssetCategory(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ASSET_CATEGORIES_KEY] }),
  });
}
