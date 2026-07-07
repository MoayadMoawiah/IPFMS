"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PackageCheck, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { goodsReceipts } from "@/lib/mock-data/procurement";
import type { GoodsReceiptItem } from "@/types";
import { formatDate } from "@/lib/formatters";

const columns: ColumnDef<GoodsReceiptItem>[] = [
  { accessorKey: "poNumber", header: "PO Number" },
  { accessorKey: "itemName", header: "Item" },
  { accessorKey: "orderedQty", header: "Ordered" },
  { accessorKey: "deliveredQty", header: "Delivered" },
  {
    accessorKey: "acceptedQty",
    header: "Accepted",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-success">
        <CheckCircle className="h-4 w-4" />
        {row.original.acceptedQty}
      </span>
    ),
  },
  {
    accessorKey: "rejectedQty",
    header: "Rejected",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-destructive">
        <XCircle className="h-4 w-4" />
        {row.original.rejectedQty}
      </span>
    ),
  },
  {
    accessorKey: "damagedQty",
    header: "Damaged",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-warning">
        <AlertTriangle className="h-4 w-4" />
        {row.original.damagedQty}
      </span>
    ),
  },
  {
    accessorKey: "receiptDate",
    header: "Receipt Date",
    cell: ({ row }) => formatDate(row.original.receiptDate),
  },
  { accessorKey: "receivedBy", header: "Received By" },
];

export default function GoodsReceiptPage() {
  const totals = goodsReceipts.reduce(
    (acc, item) => ({
      delivered: acc.delivered + item.deliveredQty,
      accepted: acc.accepted + item.acceptedQty,
      rejected: acc.rejected + item.rejectedQty,
      damaged: acc.damaged + item.damagedQty,
    }),
    { delivered: 0, accepted: 0, rejected: 0, damaged: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Goods Receipt"
        description="Warehouse-style goods receiving and quality inspection"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Goods Receipt" },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Delivered", value: totals.delivered, icon: PackageCheck, color: "text-primary bg-primary/10" },
          { label: "Accepted", value: totals.accepted, icon: CheckCircle, color: "text-success bg-success/10" },
          { label: "Rejected", value: totals.rejected, icon: XCircle, color: "text-destructive bg-destructive/10" },
          { label: "Damaged", value: totals.damaged, icon: AlertTriangle, color: "text-warning bg-warning/10" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={goodsReceipts} searchKey="itemName" />
    </div>
  );
}
