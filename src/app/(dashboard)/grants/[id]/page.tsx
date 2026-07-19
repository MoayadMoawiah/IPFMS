"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, CheckCircle2, FileText, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate } from "@/components/auth/permission-gate";
import { ActivityEditDialog } from "@/components/grants/activity-edit-dialog";
import { useGrant, useGrantBudgetSummary, useDeleteGrant, useActivateGrant, useCloseGrant } from "@/hooks/use-grants";
import { useDeleteActivity } from "@/hooks/use-projects";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import type { GrantActivity } from "@/lib/api/grants";

export default function GrantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;

  const { data: grant, isLoading, isError } = useGrant(grantId);
  const { data: budgetSummary } = useGrantBudgetSummary(grantId);
  const deleteGrant = useDeleteGrant();
  const deleteActivity = useDeleteActivity();
  const activateGrant = useActivateGrant();
  const closeGrant = useCloseGrant();

  const [deleteGrantOpen, setDeleteGrantOpen] = useState(false);
  const [activateGrantOpen, setActivateGrantOpen] = useState(false);
  const [closeGrantOpen, setCloseGrantOpen] = useState(false);
  const [closureNotes, setClosureNotes] = useState("");
  const [deleteActivityTarget, setDeleteActivityTarget] = useState<GrantActivity | null>(null);
  const [editActivity, setEditActivity] = useState<GrantActivity | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) return <LoadingSkeleton variant="cards" />;
  if (isError || !grant) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Grant not found or failed to load.
      </div>
    );
  }

  const project = grant.projects?.[0];
  const activities: GrantActivity[] = project?.activities ?? [];
  const activityAllocated = budgetSummary?.summary.activityAllocated ?? 0;
  const activityUnallocated =
    budgetSummary?.summary.activityUnallocated ?? Number(grant.totalBudget) - activityAllocated;
  const canEditGrant = grant.status !== "CLOSED" && grant.status !== "CANCELLED";
  const canActivateGrant = grant.status === "DRAFT";
  const canCloseGrant = grant.status === "ACTIVE";

  const handleActivateGrant = () => {
    setActionError(null);
    activateGrant.mutate(grantId, {
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to activate grant");
      },
    });
  };

  const handleCloseGrant = () => {
    setActionError(null);
    closeGrant.mutate(
      { id: grantId, closureNotes: closureNotes.trim() || "Grant closed." },
      {
        onSuccess: () => {
          setClosureNotes("");
          setCloseGrantOpen(false);
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to close grant");
        },
      }
    );
  };

  const handleDeleteGrant = () => {
    setActionError(null);
    deleteGrant.mutate(grantId, {
      onSuccess: () => router.push("/grants"),
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to delete grant");
      },
    });
  };

  const handleDeleteActivity = () => {
    if (!deleteActivityTarget) return;
    setActionError(null);
    deleteActivity.mutate(
      { id: deleteActivityTarget.id, grantId },
      {
        onSuccess: () => setDeleteActivityTarget(null),
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to delete activity");
        },
      }
    );
  };

  return (
    <div>
      <PageHeader
        title={grant.name}
        description={grant.code}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Grants", href: "/grants" },
          { label: grant.code },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <PermissionGate permission="GRANTS:APPROVE">
              {canActivateGrant && (
                <Button
                  onClick={() => setActivateGrantOpen(true)}
                  disabled={activateGrant.isPending}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {activateGrant.isPending ? "Activating…" : "Activate Grant"}
                </Button>
              )}
            </PermissionGate>
            <PermissionGate permission="GRANTS:APPROVE">
              {canCloseGrant && (
                <Button
                  variant="outline"
                  onClick={() => setCloseGrantOpen(true)}
                  disabled={closeGrant.isPending}
                >
                  <Lock className="h-4 w-4" />
                  {closeGrant.isPending ? "Closing…" : "Close Grant"}
                </Button>
              )}
            </PermissionGate>
            <PermissionGate permission="GRANTS:UPDATE">
              {canEditGrant && (
                <Button variant="outline" asChild>
                  <Link href={`/grants/${grantId}/edit`}>
                    <Pencil className="h-4 w-4" />
                    Edit Grant
                  </Link>
                </Button>
              )}
            </PermissionGate>
            <PermissionGate permission="GRANTS:DELETE">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteGrantOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Grant
              </Button>
            </PermissionGate>
            <Button variant="outline" asChild>
              <Link href="/grants">
                <ArrowLeft className="h-4 w-4" />
                Back to Grants
              </Link>
            </Button>
          </div>
        }
      />

      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <StatusBadge status={grant.status} />
        <span className="text-sm text-muted-foreground">{activities.length} activities</span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Number(grant.totalBudget), grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Number(grant.committedAmount), grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Number(grant.spentAmount), grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(Number(grant.availableAmount), grant.currency)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{grant.donor?.name ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">Primary Donor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {formatDate(grant.startDate)} — {formatDate(grant.endDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">Grant Period</p>
                  </div>
                </div>
                {grant.description && (
                  <p className="text-sm text-muted-foreground">{grant.description}</p>
                )}
                {grant.objectives && (
                  <div>
                    <p className="text-sm font-medium">Objectives</p>
                    <p className="text-sm text-muted-foreground">{grant.objectives}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">
                    {formatPercent(grant.utilizationPercent ?? 0)}
                  </span>
                </div>
                <Progress value={grant.utilizationPercent ?? 0} className="h-3" />
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {formatPercent(
                        Number(grant.totalBudget) > 0
                          ? (Number(grant.spentAmount) / Number(grant.totalBudget)) * 100
                          : 0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {formatPercent(
                        Number(grant.totalBudget) > 0
                          ? (Number(grant.committedAmount) / Number(grant.totalBudget)) * 100
                          : 0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Committed</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">
                      {formatPercent(
                        Number(grant.totalBudget) > 0
                          ? (Number(grant.availableAmount) / Number(grant.totalBudget)) * 100
                          : 0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex justify-end">
            <PermissionGate permission="ACTIVITIES:CREATE">
              <Button asChild>
                <Link href={`/grants/${grantId}/activities/new`}>
                  <Plus className="h-4 w-4" />
                  Add Activity
                </Link>
              </Button>
            </PermissionGate>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.code}
                          {activity.responsibleUser &&
                            ` · ${activity.responsibleUser.firstName} ${activity.responsibleUser.lastName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.startDate)} — {formatDate(activity.endDate)}
                          {" · "}
                          {formatCurrency(Number(activity.plannedBudget), grant.currency)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <StatusBadge status={activity.status.toLowerCase()} />
                          <p className="mt-1 font-medium">{Number(activity.progressPercent)}%</p>
                          <Progress
                            value={Number(activity.progressPercent)}
                            className="mt-1 h-2 w-24"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <PermissionGate permission="ACTIVITIES:UPDATE">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditActivity(activity)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission="ACTIVITIES:DELETE">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteActivityTarget(activity)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </PermissionGate>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-8 text-center text-muted-foreground">
                    No activities yet. Add work packages under this grant/project.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grant Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Total Budget", amount: Number(grant.totalBudget) },
                { label: "Committed", amount: Number(grant.committedAmount) },
                { label: "Actual Expenses", amount: Number(grant.spentAmount) },
                { label: "Remaining Balance", amount: Number(grant.availableAmount) },
                { label: "Allocated to Activities", amount: activityAllocated },
                { label: "Unallocated Activity Budget", amount: activityUnallocated },
              ].map((row) => (
                <div key={row.label} className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold">
                    {formatCurrency(row.amount, grant.currency)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {grant.budgetLines && grant.budgetLines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Budget Lines</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {grant.budgetLines.map((line) => (
                    <div key={line.id} className="flex justify-between p-4">
                      <div>
                        <p className="font-medium">{line.description}</p>
                        <p className="text-xs text-muted-foreground">{line.code}</p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(Number(line.totalBudget), grant.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {["Grant Agreement", "Budget Breakdown", "Work Plan"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{doc}</span>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  Upload documents when creating or editing a grant.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={activateGrantOpen}
        onOpenChange={setActivateGrantOpen}
        title="Activate grant?"
        description={`This will change "${grant.name}" from Draft to Active. Active grants can be used for purchase requisitions and procurement.`}
        confirmLabel="Activate Grant"
        onConfirm={handleActivateGrant}
      />

      <Dialog
        open={closeGrantOpen}
        onOpenChange={(open) => {
          setCloseGrantOpen(open);
          if (!open) setClosureNotes("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close grant?</DialogTitle>
            <DialogDescription>
              This will change &quot;{grant.name}&quot; from Active to Closed. Closed grants
              cannot be edited or used for new purchase requisitions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="closureNotes" className="text-sm font-medium">
              Closure notes
            </label>
            <Textarea
              id="closureNotes"
              value={closureNotes}
              onChange={(e) => setClosureNotes(e.target.value)}
              placeholder="Reason for closing this grant (optional)"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseGrantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseGrant} disabled={closeGrant.isPending}>
              {closeGrant.isPending ? "Closing…" : "Close Grant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteGrantOpen}
        onOpenChange={setDeleteGrantOpen}
        title="Delete grant?"
        description={`This will remove grant "${grant.name}" and hide it from lists. This action cannot be undone.`}
        confirmLabel="Delete Grant"
        variant="destructive"
        onConfirm={handleDeleteGrant}
      />

      <ConfirmDialog
        open={!!deleteActivityTarget}
        onOpenChange={(open) => !open && setDeleteActivityTarget(null)}
        title="Delete activity?"
        description={`Remove activity "${deleteActivityTarget?.name ?? ""}" from this grant?`}
        confirmLabel="Delete Activity"
        variant="destructive"
        onConfirm={handleDeleteActivity}
      />

      <ActivityEditDialog
        open={!!editActivity}
        onOpenChange={(open) => !open && setEditActivity(null)}
        activity={editActivity}
        grantId={grantId}
      />
    </div>
  );
}
