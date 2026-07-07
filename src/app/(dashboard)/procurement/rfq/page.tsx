"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { rfqs } from "@/lib/mock-data/procurement";
import type { RFQ } from "@/types";
import { formatDate } from "@/lib/formatters";

const columns: ColumnDef<RFQ>[] = [
  { accessorKey: "number", header: "RFQ Number" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "grantName", header: "Grant" },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => formatDate(row.original.deadline),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/procurement/rfq/${row.original.id}/compare`}>
          <Eye className="h-4 w-4" />
          Compare
        </Link>
      </Button>
    ),
  },
];

export default function RFQPage() {
  return (
    <div>
      <PageHeader
        title="Request for Quotation"
        description="Manage RFQ processes and vendor evaluations"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "RFQ" },
        ]}
      />
      <DataTable columns={columns} data={rfqs} searchKey="title" />
    </div>
  );
}
