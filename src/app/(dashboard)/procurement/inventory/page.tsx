"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Package, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useInventoryItems, useLowStockItems } from "@/hooks/use-inventory";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapInventoryItemRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency } from "@/lib/formatters";

type InventoryItem = ReturnType<typeof mapInventoryItemRow>;

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: "sku", header: "SKU", cell: ({ row }) => row.original.sku ?? '—' },
  { accessorKey: "name", header: "Item Name" },
  { accessorKey: "category", header: "Category", cell: ({ row }) => row.original.category?.name ?? '—' },
  { accessorKey: "currentStock", header: "Stock", cell: ({ row }) => `${row.original.currentStock} ${row.original.unit}` },
  { accessorKey: "unitCost", header: "Unit Cost", cell: ({ row }) => formatCurrency(row.original.unitCost, row.original.currency) },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
    cell: ({ row }) => row.original.reorderPoint ?? '—',
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const reorder = row.original.reorderPoint ?? 0;
      const status = stock === 0 ? 'out-of-stock' : stock <= reorder ? 'low-stock' : 'in-stock';
      return <StatusBadge status={status} />;
    },
  },
];

export default function InventoryPage() {
  const { data, isLoading, isError } = useInventoryItems({ limit: 50 });
  const { data: lowStockData } = useLowStockItems();
  const items = getPaginatedItems(data).map((item) =>
    mapInventoryItemRow(item as Record<string, unknown>)
  );
  const lowStockItems = getPaginatedItems(lowStockData);

  return (
    <div>
      <PageHeader
        title="Inventory Management"
        description="Track stock levels, movements, and warehouse operations"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Inventory" },
        ]}
        actions={
          <Button asChild>
            <Link href="/procurement/inventory/new">
              <Plus className="h-4 w-4" />
              Add Item
            </Link>
          </Button>
        }
      />

      {Array.isArray(lowStockItems) && lowStockItems.length > 0 && (
        <Card className="mb-6 border-warning bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Package className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockItems.length} item(s) are below reorder point and need restocking.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load inventory</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={items}
          searchKey="name"
          searchPlaceholder="Search inventory items..."
        />
      )}
    </div>
  );
}
