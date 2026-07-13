"use client";

import { useAuthStore } from "@/store/auth.store";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders children only when the current user has the given permission. */
export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission(permission));
  if (!hasPermission) return <>{fallback}</>;
  return <>{children}</>;
}

export function usePermission(permission: string): boolean {
  return useAuthStore((s) => s.hasPermission(permission));
}
