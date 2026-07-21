"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheques, useUpdateChequeStatus } from "@/hooks/use-finance";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapChequeRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractApiError } from "@/lib/api-errors";

type ChequeRow = ReturnType<typeof mapChequeRow>;

const CHEQUE_STATUSES = [
  "DRAFT",
  "ISSUED",
  "PRESENTED",
  "CLEARED",
  "BOUNCED",
  "CANCELLED",
  "VOIDED",
] as const;

function ChequeStatusCell({
  cheque,
  onError,
}: {
  cheque: ChequeRow;
  onError: (message: string) => void;
}) {
  const updateStatus = useUpdateChequeStatus();
  const current = cheque.status.toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={cheque.status} />
      <PermissionGate permission="CHEQUES:UPDATE">
        <Select
          value={current}
          onValueChange={(status) => {
            if (status === current) return;
            onError("");
            updateStatus.mutate(
              { id: cheque.id, status },
              {
                onError: (err) =>
                  onError(extractApiError(err, "Failed to update cheque status")),
              },
            );
          }}
          disabled={updateStatus.isPending}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHEQUE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PermissionGate>
    </div>
  );
}

export default function ChequesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError } = useCheques({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 100,
  });

  const rows = useMemo(
    () => getPaginatedItems(data).map((c) => mapChequeRow(c as Record<string, unknown>)),
    [data],
  );

  const columns: ColumnDef<ChequeRow>[] = useMemo(
    () => [
      {
        accessorKey: "serialNumber",
        header: "System No",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.serialNumber}</span>
        ),
      },
      { accessorKey: "number", header: "Cheque Number" },
      {
        accessorKey: "paymentVoucherNumber",
        header: "Payment Voucher",
        cell: ({ row }) =>
          row.original.paymentVoucherId ? (
            <Link
              href={`/finance/payment-vouchers/${row.original.paymentVoucherId}`}
              className="text-primary hover:underline"
            >
              {row.original.paymentVoucherNumber ?? "PV"}
            </Link>
          ) : (
            "—"
          ),
      },
      { accessorKey: "payee", header: "Payee" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) =>
          formatCurrency(row.original.amount, row.original.currency),
      },
      {
        accessorKey: "issueDate",
        header: "Issue Date",
        cell: ({ row }) => formatDate(row.original.issueDate),
      },
      { accessorKey: "bankAccount", header: "Bank Account" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <ChequeStatusCell
            cheque={row.original}
            onError={(msg) => setActionError(msg || null)}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Cheque Management"
        description="Track cheques issued from payment vouchers and clearance status"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Cheques" },
        ]}
      />

      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load cheques</p>
          <p className="text-xs text-muted-foreground">
            Ensure you have CHEQUES:READ permission and the API is running.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={rows}
          searchKey="payee"
          searchPlaceholder="Search by payee…"
          filters={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {CHEQUE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
