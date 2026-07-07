"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import { purchaseRequisitions } from "@/lib/mock-data/procurement";
import type { PurchaseRequisition } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<PurchaseRequisition>[] = [
  {
    accessorKey: "number",
    header: "PR Number",
    cell: ({ row }) => (
      <Link
        href={`/procurement/requisitions/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "grantName", header: "Grant" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "requestedBy", header: "Requested By" },
  {
    accessorKey: "requestDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.requestDate),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.totalAmount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function RequisitionsPage() {
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

      <DataTable
        columns={columns}
        data={purchaseRequisitions}
        searchKey="title"
        searchPlaceholder="Search requisitions..."
        filters={
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
