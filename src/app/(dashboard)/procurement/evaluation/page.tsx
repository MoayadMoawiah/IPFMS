"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useRfqs } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapRfqRow } from "@/lib/mappers/api-list-mappers";
import { formatDate } from "@/lib/formatters";

interface EvaluationRow {
  id: string;
  number: string;
  title: string;
  grantName: string;
  deadline: string;
  status: string;
  pafCount?: number;
}

const columns: ColumnDef<EvaluationRow>[] = [
  { accessorKey: "number", header: "RFQ Number" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "grantName", header: "Grant" },
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
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/procurement/rfq/${row.original.id}/compare`}>
          <FileText className="h-4 w-4" />
          Complete PAF
        </Link>
      </Button>
    ),
  },
];

export default function EvaluationPage() {
  const { data, isLoading, isError } = useRfqs({ status: "AWARDED", limit: 50 });

  const rows = getPaginatedItems(data)
    .map((rfq) => mapRfqRow(rfq as Record<string, unknown>))
    .filter((row) => row.pafCount === 0);

  return (
    <div>
      <PageHeader
        title="Evaluation Committee / PAF"
        description="Awarded RFQs awaiting Purchase Analysis Form completion"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Evaluation" },
        ]}
      />

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load evaluation queue.
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No awarded RFQs pending PAF.{" "}
          <Link href="/procurement/rfq" className="text-primary hover:underline">
            View all RFQs
          </Link>
        </p>
      ) : (
        <DataTable columns={columns} data={rows} searchKey="title" />
      )}
    </div>
  );
}
