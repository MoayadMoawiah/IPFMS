"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { usePurchaseOrders } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapPurchaseOrderRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface PO {
  id: string;
  poNumber: string;
  vendorName?: string;
  grantCode?: string;
  totalAmount: number;
  currency: string;
  status: string;
  deliveryDate?: string;
  createdAt: string;
}

const columns: ColumnDef<PO>[] = [
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => (
      <Link href={`/procurement/purchase-orders/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.poNumber}
      </Link>
    ),
  },
  { accessorKey: "vendorName", header: "Vendor", cell: ({ row }) => row.original.vendorName ?? '—' },
  { accessorKey: "grantCode", header: "Grant", cell: ({ row }) => row.original.grantCode ?? '—' },
  { accessorKey: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
  { accessorKey: "deliveryDate", header: "Delivery", cell: ({ row }) => row.original.deliveryDate ? formatDate(row.original.deliveryDate) : '—' },
  { accessorKey: "totalAmount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.totalAmount, row.original.currency) },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} /> },
];

export default function PurchaseOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = usePurchaseOrders({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const pos = getPaginatedItems(data).map((po) =>
    mapPurchaseOrderRow(po as Record<string, unknown>)
  );

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Manage purchase orders, vendor deliveries, and payment status"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Purchase Orders" },
        ]}
        actions={
          <Button asChild>
            <Link href="/procurement/purchase-orders/new">
              <Plus className="h-4 w-4" />
              New PO
            </Link>
          </Button>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load purchase orders</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={pos}
          searchKey="poNumber"
          searchPlaceholder="Search purchase orders..."
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
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
