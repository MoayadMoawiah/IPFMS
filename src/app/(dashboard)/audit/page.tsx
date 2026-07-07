"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { auditLogs } from "@/lib/mock-data/audit";

const columns: ColumnDef<(typeof auditLogs)[0]>[] = [
  { accessorKey: "timestamp", header: "Timestamp" },
  { accessorKey: "user", header: "User" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "module", header: "Module" },
  { accessorKey: "details", header: "Details" },
  { accessorKey: "ipAddress", header: "IP Address" },
];

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="System activity and compliance audit trail"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Audit" },
        ]}
      />
      <DataTable columns={columns} data={auditLogs} searchKey="user" searchPlaceholder="Search by user..." />
    </div>
  );
}
