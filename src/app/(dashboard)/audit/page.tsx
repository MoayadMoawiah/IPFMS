"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { AlertCircle } from "lucide-react";
import { useAuditLogs } from "@/hooks/use-search";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapAuditLogRow } from "@/lib/mappers/api-list-mappers";
import { formatDate } from "@/lib/formatters";

interface AuditLog {
  id: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
  action: string;
  module: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => row.original.user
      ? `${row.original.user.firstName} ${row.original.user.lastName}`
      : '—',
  },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "module", header: "Module" },
  {
    accessorKey: "description",
    header: "Details",
    cell: ({ row }) => row.original.description ?? row.original.entityId ?? '—',
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => row.original.ipAddress ?? '—',
  },
];

export default function AuditPage() {
  const { data, isLoading, isError } = useAuditLogs({ limit: 50 });
  const logs = getPaginatedItems(data).map((log) =>
    mapAuditLogRow(log as Record<string, unknown>)
  );

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        description="Full system audit log — every action, every change, timestamped and user-attributed"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Audit Trail" },
        ]}
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load audit logs</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={logs}
          searchKey="action"
          searchPlaceholder="Search audit logs..."
        />
      )}
    </div>
  );
}
