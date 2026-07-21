"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useVendorInvoices } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface InvoiceRow {
  id: string;
  serialNumber: string;
  invoiceNumber: string;
  status: string;
  invoiceDate: string;
  totalAmount: number | string;
  currency: string;
  po?: { serialNumber?: string } | null;
  vendor?: { name?: string } | null;
  grant?: { code?: string } | null;
}

const columns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "serialNumber",
    header: "Invoice Ref",
    cell: ({ row }) => (
      <Link
        href={`/procurement/vendor-invoices/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.serialNumber}
      </Link>
    ),
  },
  {
    accessorKey: "invoiceNumber",
    header: "Vendor Invoice No",
  },
  {
    accessorKey: "po",
    header: "PO",
    cell: ({ row }) => row.original.po?.serialNumber ?? "—",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => row.original.vendor?.name ?? "—",
  },
  {
    accessorKey: "invoiceDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.invoiceDate),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) =>
      formatCurrency(Number(row.original.totalAmount), row.original.currency),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status.toLowerCase()} />
    ),
  },
];

export default function VendorInvoicesPage() {
  const { data, isLoading, isError } = useVendorInvoices({ limit: 50 });
  const rows = getPaginatedItems(data) as InvoiceRow[];

  return (
    <div>
      <PageHeader
        title="Vendor Invoices"
        description="Enter, match, and approve supplier invoices against issued POs"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Vendor Invoices" },
        ]}
        actions={
          <PermissionGate permission="INVOICES:CREATE">
            <Button asChild>
              <Link href="/procurement/vendor-invoices/new">
                <Plus className="h-4 w-4" />
                New Invoice
              </Link>
            </Button>
          </PermissionGate>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load vendor invoices</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={rows}
          searchKey="serialNumber"
          searchPlaceholder="Search invoices..."
          emptyTitle="No vendor invoices yet"
          emptyDescription="Create an invoice against an approved or issued purchase order."
        />
      )}
    </div>
  );
}
