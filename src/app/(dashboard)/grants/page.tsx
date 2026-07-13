"use client";

import Link from "next/link";
import { Plus, Filter, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { GrantCard } from "@/components/grants/grant-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useGrants } from "@/hooks/use-grants";
import { getPaginatedItems, getPaginatedMeta } from "@/lib/api/pagination";
import type { Grant } from "@/types";
import type { Grant as ApiGrant } from "@/lib/api/grants";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

// Map API grant to legacy UI Grant type
function mapApiGrant(apiGrant: ApiGrant): Grant {
  const totalBudget = Number(apiGrant.totalBudget) || 0;
  const committed = Number(apiGrant.committedAmount) || 0;
  const spent = Number(apiGrant.spentAmount) || 0;
  const available = Number(apiGrant.availableAmount) || (totalBudget - committed - spent);
  const utilizationPercent = totalBudget > 0 ? ((committed + spent) / totalBudget) * 100 : 0;

  return {
    id: apiGrant.id,
    code: apiGrant.code,
    name: apiGrant.name,
    donor: apiGrant.donor?.name ?? apiGrant.donorId ?? '',
    startDate: apiGrant.startDate,
    endDate: apiGrant.endDate,
    currency: apiGrant.currency,
    totalBudget,
    committed,
    spent,
    available,
    utilizationPercent,
    status: (apiGrant.status?.toLowerCase() ?? 'draft') as Grant['status'],
    activitiesCount: 0,
    description: apiGrant.description,
  };
}

export default function GrantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, error } = useGrants({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const grants = getPaginatedItems(data).map((g) => mapApiGrant(g as ApiGrant));

  return (
    <div>
      <PageHeader
        title="Grant Management"
        description="Manage donor grants, budgets, and utilization across all programs"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Grant Management" },
        ]}
        actions={
          <Button asChild>
            <Link href="/grants/new">
              <Plus className="h-4 w-4" />
              New Grant
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search grants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingSkeleton variant="cards" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">
            {(error as { message?: string })?.message ?? "Failed to load grants"}
          </p>
        </div>
      )}

      {!isLoading && !isError && grants.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No grants found"
          description="Start by creating your first grant or adjust your filters."
          actionLabel="New Grant"
          onAction={() => window.location.href = '/grants/new'}
        />
      )}

      {!isLoading && grants.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {grants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      )}

      {getPaginatedMeta(data) && (
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Showing {grants.length} of {getPaginatedMeta(data)!.total} grants
        </p>
      )}
    </div>
  );
}
