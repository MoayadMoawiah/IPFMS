"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { inventoryItems } from "@/lib/mock-data/procurement";
import type { InventoryItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "name", header: "Item Name" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
  },
  {
    accessorKey: "unitCost",
    header: "Unit Cost",
    cell: ({ row }) => formatCurrency(row.original.unitCost),
  },
  {
    accessorKey: "totalValue",
    header: "Total Value",
    cell: ({ row }) => formatCurrency(row.original.totalValue),
  },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => formatDate(row.original.lastUpdated),
  },
];

export default function InventoryPage() {
  const totalValue = inventoryItems.reduce((s, i) => s + i.totalValue, 0);

  return (
    <div>
      <PageHeader
        title="Inventory Management"
        description="Track stock levels and inventory valuation"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Inventory" },
        ]}
      />

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-muted-foreground">
              {inventoryItems.length} items across all locations
            </p>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={inventoryItems} searchKey="name" />
    </div>
  );
}
