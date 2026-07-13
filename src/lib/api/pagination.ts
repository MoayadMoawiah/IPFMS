export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

/** Unwrap items from API list responses (handles both paginated object and plain array). */
export function getPaginatedItems<T>(
  response: PaginatedResponse<T> | T[] | null | undefined
): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

export function getPaginatedMeta<T>(
  response: PaginatedResponse<T> | T[] | null | undefined
): PaginatedMeta | undefined {
  if (!response || Array.isArray(response)) return undefined;
  return response.meta;
}
