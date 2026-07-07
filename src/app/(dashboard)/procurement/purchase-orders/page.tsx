"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { purchaseOrders } from "@/lib/mock-data/procurement";
import type { PurchaseOrder } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "number",
    header: "PO Number",
    cell: ({ row }) => (
      <Link href={`/procurement/purchase-orders/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.number}
      </Link>
    ),
  },
  { accessorKey: "vendor", header: "Vendor" },
  { accessorKey: "grantName", header: "Grant" },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
    cell: ({ row }) => formatDate(row.original.issueDate),
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/procurement/purchase-orders/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];

export default function PurchaseOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Manage issued purchase orders and track deliveries"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Purchase Orders" },
        ]}
      />
      <DataTable columns={columns} data={purchaseOrders} searchKey="vendor" />
    </div>
  );
}
