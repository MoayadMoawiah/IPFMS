export function extractApiError(err: unknown, fallback = "An error occurred"): string {
  const e = err as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const msg = e?.response?.data?.message ?? e?.message ?? fallback;
  return Array.isArray(msg) ? msg.join(", ") : msg;
}
