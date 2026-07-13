"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { UserPlus, AlertCircle, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useUsers } from "@/hooks/use-search";
import { useDeleteUser } from "@/hooks/use-users";
import { getPaginatedItems, getPaginatedMeta } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";
import type { SystemUser } from "@/lib/api/users";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError } = useUsers({ search: search || undefined, limit: 50 });
  const deleteUser = useDeleteUser();

  const users: SystemUser[] = getPaginatedItems(data);
  const meta = getPaginatedMeta(data);

  const columns = useMemo<ColumnDef<SystemUser>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => row.original.department?.name ?? "—",
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.roles ?? []).map((role) => (
              <Badge key={role.id} variant="secondary" className="text-xs">
                {role.displayName ?? role.name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-1">
              <PermissionGate permission="USERS:UPDATE">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/settings/users/${user.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {user.firstName} {user.lastName}</span>
                  </Link>
                </Button>
              </PermissionGate>
              <PermissionGate permission="USERS:DELETE">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(user)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete {user.firstName} {user.lastName}</span>
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
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        setActionError(extractApiError(err, "Failed to delete user"));
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Users" },
        ]}
        actions={
          <Button asChild>
            <Link href="/settings/users/new">
              <UserPlus className="h-4 w-4" />
              Add User
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
          <p className="text-sm">Failed to load users</p>
        </div>
      )}

      {!isLoading && !isError && users.length === 0 && !search && (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Add your first system user to manage access and roles."
          actionLabel="Add User"
          onAction={() => (window.location.href = "/settings/users/new")}
        />
      )}

      {!isLoading && !isError && (users.length > 0 || search) && (
        <>
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable
            columns={columns}
            data={users}
            searchKey="email"
            searchPlaceholder="Filter loaded users..."
          />
        </>
      )}

      {meta && users.length > 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Showing {users.length} of {meta.total} users
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.firstName} ${deleteTarget.lastName}" (${deleteTarget.email})? This will deactivate and remove them from the system.`
            : ""
        }
        confirmLabel={deleteUser.isPending ? "Deleting…" : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
