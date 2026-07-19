"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { usePurchaseRequisitions } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapPurchaseRequisitionRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface PR {
  id: string;
  prNumber: string;
  title: string;
  grantCode?: string;
  departmentName?: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  waitingForRoleName?: string | null;
  requester?: { firstName: string; lastName: string };
}

const columns: ColumnDef<PR>[] = [
  {
    accessorKey: "prNumber",
    header: "PR Number",
    cell: ({ row }) => (
      <Link
        href={`/procurement/requisitions/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.prNumber}
      </Link>
    ),
  },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "grantCode",
    header: "Grant",
    cell: ({ row }) => row.original.grantCode ?? '—',
  },
  {
    accessorKey: "requester",
    header: "Requested By",
    cell: ({ row }) => row.original.requester
      ? `${row.original.requester.firstName} ${row.original.requester.lastName}`
      : '—',
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.totalAmount, row.original.currency),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} />,
  },
  {
    accessorKey: "waitingForRoleName",
    header: "Waiting For",
    cell: ({ row }) => row.original.waitingForRoleName ?? "—",
  },
];

export default function RequisitionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = usePurchaseRequisitions({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const prs = getPaginatedItems(data).map((pr) =>
    mapPurchaseRequisitionRow(pr as Record<string, unknown>)
  );

  return (
    <div>
      <PageHeader
        title="Purchase Requisitions"
        description="Create and manage purchase requisitions across all grants"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement", href: "/procurement/requisitions" },
          { label: "Requisitions" },
        ]}
        actions={
          <Button asChild>
            <Link href="/procurement/requisitions/new">
              <Plus className="h-4 w-4" />
              New PR
            </Link>
          </Button>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load purchase requisitions</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={prs}
          searchKey="title"
          searchPlaceholder="Search requisitions..."
          filters={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
