"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useRfqs } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapRfqRow } from "@/lib/mappers/api-list-mappers";
import { formatDate } from "@/lib/formatters";

interface RfqRow {
  id: string;
  number: string;
  title: string;
  grantName: string;
  prNumber?: string;
  deadline: string;
  status: string;
  vendorCount: number;
}

const columns: ColumnDef<RfqRow>[] = [
  {
    accessorKey: "number",
    header: "RFQ Number",
    cell: ({ row }) => (
      <Link
        href={`/procurement/rfq/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "grantName", header: "Grant" },
  {
    accessorKey: "prNumber",
    header: "PR",
    cell: ({ row }) => row.original.prNumber ?? "—",
  },
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
    accessorKey: "vendorCount",
    header: "Vendors",
    cell: ({ row }) => row.original.vendorCount,
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
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = useRfqs({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const rfqs = getPaginatedItems(data).map((rfq) =>
    mapRfqRow(rfq as Record<string, unknown>),
  );

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

      <div className="mb-4 flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load RFQs.
        </div>
      ) : (
        <DataTable columns={columns} data={rfqs} searchKey="title" />
      )}
    </div>
  );
}
