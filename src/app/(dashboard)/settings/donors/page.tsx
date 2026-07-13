"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, AlertCircle, Building2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useDonors, useDeleteDonor } from "@/hooks/use-donors";
import type { Donor } from "@/lib/api/donors";
import { getPaginatedItems, getPaginatedMeta } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";
import { formatDate } from "@/lib/formatters";

const DONOR_TYPE_LABELS: Record<string, string> = {
  BILATERAL: "Bilateral",
  MULTILATERAL: "Multilateral",
  PRIVATE: "Private",
  FOUNDATION: "Foundation",
  GOVERNMENT: "Government",
  OTHER: "Other",
};

export default function DonorsPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError } = useDonors({ search: search || undefined, limit: 50 });
  const deleteDonor = useDeleteDonor();

  const donors: Donor[] = getPaginatedItems(data);
  const meta = getPaginatedMeta(data);

  const columns = useMemo<ColumnDef<Donor>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-medium text-primary">{row.original.code}</span>
        ),
      },
      { accessorKey: "name", header: "Donor Name" },
      {
        accessorKey: "donorType",
        header: "Type",
        cell: ({ row }) => DONOR_TYPE_LABELS[row.original.donorType] ?? row.original.donorType,
      },
      { accessorKey: "country", header: "Country", cell: ({ row }) => row.original.country ?? "—" },
      {
        accessorKey: "contactEmail",
        header: "Contact Email",
        cell: ({ row }) => row.original.contactEmail ?? "—",
      },
      {
        accessorKey: "_count",
        header: "Grants",
        cell: ({ row }) => row.original._count?.grants ?? 0,
      },
      {
        accessorKey: "createdAt",
        header: "Added",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const donor = row.original;
          const grantCount = donor._count?.grants ?? 0;

          return (
            <div className="flex items-center gap-1">
              <PermissionGate permission="GRANTS:UPDATE">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/settings/donors/${donor.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {donor.name}</span>
                  </Link>
                </Button>
              </PermissionGate>
              <PermissionGate permission="DONORS:DELETE">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={grantCount > 0}
                  title={
                    grantCount > 0
                      ? "Cannot delete a donor with associated grants"
                      : `Delete ${donor.name}`
                  }
                  onClick={() => setDeleteTarget(donor)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete {donor.name}</span>
                </Button>
              </PermissionGate>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    setActionError(null);
    deleteDonor.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        setActionError(extractApiError(err, "Failed to delete donor"));
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Donor Management"
        description="Manage funding organizations and donor profiles"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Donor Management" },
        ]}
        actions={
          <Button asChild>
            <Link href="/settings/donors/new">
              <Plus className="h-4 w-4" />
              Add Donor
            </Link>
          </Button>
        }
      />

      {actionError && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load donors</p>
        </div>
      )}

      {!isLoading && !isError && donors.length === 0 && !search && (
        <EmptyState
          icon={Building2}
          title="No donors yet"
          description="Add your first donor organization to start creating grants."
          actionLabel="Add Donor"
          onAction={() => (window.location.href = "/settings/donors/new")}
        />
      )}

      {!isLoading && !isError && (donors.length > 0 || search) && (
        <>
          <div className="mb-4">
            <Input
              placeholder="Search donors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable
            columns={columns}
            data={donors}
            searchKey="name"
            searchPlaceholder="Filter loaded donors..."
          />
        </>
      )}

      {meta && donors.length > 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Showing {donors.length} of {meta.total} donors
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete donor"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}" (${deleteTarget.code})? This action cannot be undone.`
            : ""
        }
        confirmLabel={deleteDonor.isPending ? "Deleting…" : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
