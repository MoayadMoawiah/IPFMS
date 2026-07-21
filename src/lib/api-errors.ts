export function extractApiError(err: unknown, fallback = "An error occurred"): string {
  const e = err as {
    response?: {
      data?: {
        message?: string | string[];
        errors?: Array<{ message?: string } | string>;
      };
    };
    message?: string;
  };
  const data = e?.response?.data;
  const detailErrors = data?.errors
    ?.map((item) => (typeof item === "string" ? item : item?.message))
    .filter(Boolean);
  if (detailErrors?.length) {
    return detailErrors.join(", ");
  }
  const msg = data?.message ?? e?.message ?? fallback;
  return Array.isArray(msg) ? msg.join(", ") : msg;
}
