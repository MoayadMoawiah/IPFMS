"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, FileText, Printer, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate } from "@/components/auth/permission-gate";
import {
  usePurchaseRequisition,
  useSubmitPurchaseRequisition,
  useDeletePurchaseRequisition,
} from "@/hooks/use-procurement";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { formatBytes } from "@/components/forms/supporting-documents-field";
import { getRequisitionDocuments } from "@/lib/api/uploads";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { PrApprovalActions } from "@/components/workflow/pr-approval-actions";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import { PrNextSteps } from "@/components/procurement/pr-next-steps";
import { GenericDocPrintView, formatMetaDate } from "@/components/documents/generic-doc-print-view";

interface PrItem {
  id: string;
  description: string;
  specification?: string | null;
  unit: string;
  quantity: number | string;
  estimatedUnitPrice: number | string;
  totalEstimated: number | string;
}

interface PurchaseRequisitionDetail {
  id: string;
  serialNumber: string;
  title: string;
  description?: string | null;
  status: string;
  currency: string;
  totalEstimatedAmount: number | string;
  departmentId?: string | null;
  requiredByDate?: string | null;
  justification?: string | null;
  createdAt: string;
  grant?: { id: string; code: string; name: string };
  activity?: { id: string; code: string; name: string } | null;
  requestedBy?: {
    firstName: string;
    lastName: string;
    email: string;
    roles?: Array<{ role?: { name?: string } }>;
  };
  procurementMethod?: { name: string; code: string } | null;
  items?: PrItem[];
  approvalContext?: {
    waitingForRoleName?: string | null;
    waitingForStepName?: string | null;
    dueAt?: string | null;
    canAct?: boolean;
    allowReject?: boolean;
    allowReturn?: boolean;
  } | null;
  procurementRoute?: "RFQ" | "DIRECT_PO";
  rfqs?: Array<{ id: string; serialNumber: string; status: string }>;
  purchaseOrders?: Array<{
    id: string;
    serialNumber: string;
    status: string;
    vendor?: { id: string; name: string } | null;
  }>;
  pafForms?: Array<{
    id: string;
    status: string;
    rfqId: string;
    recommendedVendorId?: string | null;
  }>;
  workflow?: {
    currentStepNumber?: number;
    steps?: Array<{
      stepNumber: number;
      stepName: string;
      status: string;
      action?: string | null;
      completedAt?: string | null;
      comment?: string | null;
      digitalSignature?: {
        signedAt?: string | null;
        user?: {
          firstName?: string;
          lastName?: string;
          roles?: Array<{ role?: { name?: string } }>;
        } | null;
      } | null;
    }>;
    actions?: Array<{
      action: string;
      comment?: string | null;
      actionAt: string;
      actor?: {
        firstName: string;
        lastName: string;
        roles?: Array<{ role?: { name?: string } }>;
      };
    }>;
  } | null;
}

function getDepartmentName(departmentId?: string | null) {
  if (!departmentId) return "—";
  return DEPARTMENTS.find((d) => d.id === departmentId)?.name ?? departmentId;
}

export default function PurchaseRequisitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prId = params.id as string;

  const { data, isLoading, isError } = usePurchaseRequisition(prId);
  const { data: documents = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["requisition-documents", prId],
    queryFn: () => getRequisitionDocuments(prId),
    enabled: Boolean(prId),
  });
  const submitPR = useSubmitPurchaseRequisition();
  const deletePR = useDeletePurchaseRequisition();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const pr = data as PurchaseRequisitionDetail | undefined;

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !pr) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Purchase requisition not found or failed to load.
      </div>
    );
  }

  const items = pr.items ?? [];
  const canSubmit = pr.status === "DRAFT" || pr.status === "RETURNED";
  const canDelete = pr.status === "DRAFT" || pr.status === "RETURNED";
  const workflowActions = pr.workflow?.actions ?? [];
  const workflowSteps = pr.workflow?.steps ?? [];

  const handleSubmit = () => {
    setActionError(null);
    submitPR.mutate(prId, {
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to submit requisition");
      },
    });
  };

  const handleDelete = () => {
    setActionError(null);
    deletePR.mutate(prId, {
      onSuccess: () => router.push("/procurement/requisitions"),
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        setActionError(e?.response?.data?.message ?? e?.message ?? "Failed to delete requisition");
      },
    });
  };

  return (
    <div>
      <PageHeader
        className="no-print"
        title={pr.serialNumber}
        description={pr.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: pr.serialNumber },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <PrApprovalActions
              prId={prId}
              serialNumber={pr.serialNumber}
              approvalContext={pr.approvalContext}
              onError={setActionError}
            />
            <PermissionGate permission="PURCHASE_REQUISITIONS:SUBMIT">
              {canSubmit && (
                <Button onClick={handleSubmit} disabled={submitPR.isPending}>
                  <Send className="h-4 w-4" />
                  {submitPR.isPending ? "Submitting…" : "Submit for Approval"}
                </Button>
              )}
            </PermissionGate>
            <PermissionGate permission="PURCHASE_REQUISITIONS:DELETE">
              {canDelete && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </PermissionGate>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print PR
            </Button>
            <Button variant="outline" asChild>
              <Link href="/procurement/requisitions">
                <ArrowLeft className="h-4 w-4" />
                Back to Requisitions
              </Link>
            </Button>
          </div>
        }
      />

      <div className="no-print">
      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <WaitingForLabel status={pr.status} approvalContext={pr.approvalContext} />

      <PrNextSteps
        prId={prId}
        status={pr.status}
        procurementRoute={pr.procurementRoute}
        rfqs={pr.rfqs}
        purchaseOrders={pr.purchaseOrders}
        pafForms={pr.pafForms}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={pr.status.toLowerCase()} />
        <span className="text-2xl font-bold">
          {formatCurrency(Number(pr.totalEstimatedAmount), pr.currency)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.description}</p>
                        {item.specification && (
                          <p className="text-xs text-muted-foreground">{item.specification}</p>
                        )}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">{Number(item.quantity)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(item.estimatedUnitPrice), pr.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(item.totalEstimated), pr.currency)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No line items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {items.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">
                      Total Estimated
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(Number(pr.totalEstimatedAmount), pr.currency)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Grant</span>
                <span className="text-right font-medium">
                  {pr.grant ? (
                    <Link
                      href={`/grants/${pr.grant.id}`}
                      className="text-primary hover:underline"
                    >
                      {pr.grant.code}
                    </Link>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              {pr.grant?.name && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Grant Name</span>
                  <span className="text-right">{pr.grant.name}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Department</span>
                <span className="text-right">{getDepartmentName(pr.departmentId)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Requested By</span>
                <span className="text-right">
                  {pr.requestedBy
                    ? `${pr.requestedBy.firstName} ${pr.requestedBy.lastName}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Created</span>
                <span className="text-right">{formatDate(pr.createdAt)}</span>
              </div>
              {pr.requiredByDate && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Required By</span>
                  <span className="text-right">{formatDate(pr.requiredByDate)}</span>
                </div>
              )}
              {pr.procurementMethod && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Procurement Method</span>
                  <span className="text-right">{pr.procurementMethod.name}</span>
                </div>
              )}
              {pr.activity && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Activity</span>
                  <span className="text-right">{pr.activity.code}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(pr.description || pr.justification) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {pr.description && (
                  <div>
                    <p className="font-medium text-muted-foreground">Description</p>
                    <p className="mt-1">{pr.description}</p>
                  </div>
                )}
                {pr.justification && (
                  <div>
                    <p className="font-medium text-muted-foreground">Justification</p>
                    <p className="mt-1">{pr.justification}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingDocs ? (
                <p className="text-sm text-muted-foreground">Loading documents…</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents attached.</p>
              ) : (
                <ul className="divide-y rounded-lg border">
                  {documents.map((doc) => (
                    <li key={doc.id} className="flex items-center gap-3 px-3 py-2.5">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{doc.fileName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {doc.originalName} · {formatBytes(doc.fileSize)}
                          {doc.uploadedBy &&
                            ` · ${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`}
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-primary hover:underline"
                        aria-label={`Open ${doc.originalName}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {workflowSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepTimeline
                  steps={workflowSteps}
                  currentStepNumber={pr.workflow?.currentStepNumber}
                />
              </CardContent>
            </Card>
          )}

          {workflowActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Workflow History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflowActions.map((action, index) => (
                  <div key={`${action.actionAt}-${index}`} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium capitalize">{action.action.toLowerCase()}</p>
                    <p className="text-muted-foreground">
                      {action.actor
                        ? `${action.actor.firstName} ${action.actor.lastName}`
                        : "System"}{" "}
                      · {formatDate(action.actionAt)}
                    </p>
                    {action.comment && (
                      <p className="mt-1 text-muted-foreground">{action.comment}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete requisition?"
        description={`This will remove "${pr.serialNumber}". This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
      </div>

      <div className="hidden print:block">
        <GenericDocPrintView
          title="Purchase Requisition – PR"
          documentNumber={pr.serialNumber}
          description={pr.description || pr.justification}
          currency={pr.currency}
          totalAmount={pr.totalEstimatedAmount}
          requestedByUser={pr.requestedBy}
          requestedAt={pr.createdAt}
          steps={pr.workflow?.steps}
          actions={pr.workflow?.actions}
          meta={[
            { label: "Title", value: pr.title },
            { label: "Status", value: pr.status },
            { label: "Grant", value: pr.grant ? `${pr.grant.code} — ${pr.grant.name}` : "—" },
            { label: "Department", value: getDepartmentName(pr.departmentId) },
            { label: "Required by", value: formatMetaDate(pr.requiredByDate) },
            { label: "Created", value: formatMetaDate(pr.createdAt) },
            {
              label: "Requested by",
              value: pr.requestedBy
                ? `${pr.requestedBy.firstName} ${pr.requestedBy.lastName}`
                : "—",
            },
          ]}
          items={items.map((item) => ({
            id: item.id,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.estimatedUnitPrice,
            total: item.totalEstimated,
          }))}
        />
      </div>
    </div>
  );
}
