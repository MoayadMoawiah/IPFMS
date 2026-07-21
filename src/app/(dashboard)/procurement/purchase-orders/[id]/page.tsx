"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  FileText,
  PackageCheck,
  Printer,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate, usePermission } from "@/components/auth/permission-gate";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { PoApprovalActions } from "@/components/workflow/po-approval-actions";
import { PoPrintView, type PoPrintData } from "@/components/documents/po-print-view";
import {
  formatBytes,
  ACCEPTED_DOCUMENT_TYPES,
} from "@/components/forms/supporting-documents-field";
import {
  usePurchaseOrder,
  useIssuePurchaseOrder,
} from "@/hooks/use-procurement";
import { submitPurchaseOrder } from "@/lib/api/procurement";
import {
  type DocumentAttachment,
  getPurchaseOrderDocuments,
  getRequisitionDocuments,
  uploadPurchaseOrderDocuments,
  deletePurchaseOrderDocument,
} from "@/lib/api/uploads";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractApiError } from "@/lib/api-errors";

type AttachmentRow = DocumentAttachment & { source: "pr" | "po" };

export default function PODetailPage() {
  const params = useParams();
  const router = useRouter();
  const poId = params.id as string;
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [viewedAttachmentIds, setViewedAttachmentIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [deleteTarget, setDeleteTarget] = useState<DocumentAttachment | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, isError } = usePurchaseOrder(poId);
  const issuePo = useIssuePurchaseOrder();
  const hasPoApprove = usePermission("PURCHASE_ORDERS:APPROVE");
  const hasWorkflowApprove = usePermission("WORKFLOW:APPROVE");
  const canUpdatePo = usePermission("PURCHASE_ORDERS:UPDATE");

  // If print/PDF truncated the cuid in the URL, canonicalize to the full id.
  useEffect(() => {
    const fullId = (data as { id?: string } | undefined)?.id;
    if (fullId && fullId !== poId) {
      router.replace(`/procurement/purchase-orders/${fullId}`);
    }
  }, [data, poId, router]);

  const submitPo = useMutation({
    mutationFn: (id: string) => submitPurchaseOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      qc.invalidateQueries({ queryKey: ["purchase-orders", poId] });
    },
  });

  const deleteDoc = useMutation({
    mutationFn: (attachmentId: string) =>
      deletePurchaseOrderDocument(poId, attachmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-order-documents", poId] });
      setDeleteTarget(null);
    },
    onError: (err) =>
      setActionError(extractApiError(err, "Failed to delete document")),
  });

  const prId = (data as { pr?: { id?: string } | null } | undefined)?.pr?.id;

  const { data: poDocuments = [], isLoading: loadingPoDocs } = useQuery({
    queryKey: ["purchase-order-documents", poId],
    queryFn: () => getPurchaseOrderDocuments(poId),
    enabled: Boolean(poId),
  });

  const { data: prDocuments = [], isLoading: loadingPrDocs } = useQuery({
    queryKey: ["requisition-documents", prId],
    queryFn: () => getRequisitionDocuments(prId!),
    enabled: Boolean(prId),
  });

  const allAttachments = useMemo<AttachmentRow[]>(() => {
    const prRows: AttachmentRow[] = prDocuments.map((d) => ({ ...d, source: "pr" }));
    const poRows: AttachmentRow[] = poDocuments.map((d) => ({ ...d, source: "po" }));
    return [...prRows, ...poRows];
  }, [prDocuments, poDocuments]);

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Purchase order not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/procurement/purchase-orders">Back to Purchase Orders</Link>
        </Button>
      </div>
    );
  }

  const po = data as PoPrintData & {
    id: string;
    vendor?: { name: string } | null;
    pr?: { id: string; serialNumber: string } | null;
    approvalContext?: {
      canAct?: boolean;
      waitingForRoleName?: string | null;
      waitingForStepName?: string | null;
      dueAt?: string | null;
      allowReject?: boolean;
      allowReturn?: boolean;
    } | null;
    workflow?: {
      currentStepNumber?: number;
      steps?: Array<{
        stepNumber: number;
        stepName: string;
        status: string;
        completedAt?: string | null;
        comment?: string | null;
        digitalSignature?: {
          signedAt?: string | null;
          user?: {
            firstName?: string;
            lastName?: string;
            roles?: Array<{ role?: { name?: string } }>;
          };
        } | null;
      }>;
      actions?: Array<{
        action?: string | null;
        actionAt?: string | null;
        comment?: string | null;
        actor?: {
          firstName?: string;
          lastName?: string;
          roles?: Array<{ role?: { name?: string } }>;
        } | null;
      }>;
    } | null;
  };

  const status = po.status.toLowerCase();
  const vendorName = po.vendor?.name ?? "—";
  const items = po.items ?? [];
  const canShowApprove =
    Boolean(po.approvalContext?.canAct) && (hasPoApprove || hasWorkflowApprove);
  const canEditDocs =
    canUpdatePo &&
    (status === "draft" || status === "returned" || status === "submitted");

  const totalAttachments = allAttachments.length;
  const viewedCount = allAttachments.filter((a) =>
    viewedAttachmentIds.has(a.id),
  ).length;
  const allAttachmentsReviewed =
    totalAttachments === 0 || viewedCount === totalAttachments;
  const approveBlockedByReview = canShowApprove && !allAttachmentsReviewed;

  const markViewed = (id: string) => {
    setViewedAttachmentIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleOpenAttachment = (doc: DocumentAttachment) => {
    markViewed(doc.id);
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setActionError(null);
    setUploading(true);
    try {
      const files = Array.from(fileList);
      const labels = files.map(() => "Other");
      await uploadPurchaseOrderDocuments(poId, files, labels);
      await qc.invalidateQueries({ queryKey: ["purchase-order-documents", poId] });
    } catch (err) {
      setActionError(extractApiError(err, "Failed to upload documents"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const renderDocRow = (doc: AttachmentRow, canDelete: boolean) => {
    const reviewed = viewedAttachmentIds.has(doc.id);
    return (
      <li key={doc.id} className="flex items-center gap-3 px-3 py-2.5">
        <FileText className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {doc.fileName}
            {canShowApprove && (
              <span
                className={
                  reviewed
                    ? "ml-2 text-xs font-normal text-emerald-600"
                    : "ml-2 text-xs font-normal text-amber-600"
                }
              >
                {reviewed ? "Reviewed" : "Not reviewed"}
              </span>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {doc.originalName} · {formatBytes(doc.fileSize)}
            {doc.uploadedBy &&
              ` · ${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => handleOpenAttachment(doc)}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </Button>
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(doc)}
            aria-label={`Delete ${doc.originalName}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={po.serialNumber}
          description={po.title || `Purchase Order — ${vendorName}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Purchase Orders", href: "/procurement/purchase-orders" },
            { label: po.serialNumber },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/procurement/purchase-orders">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              {(status === "draft" || status === "returned") && (
                <PermissionGate permission="PURCHASE_ORDERS:SUBMIT">
                  <Button
                    onClick={() =>
                      submitPo.mutate(poId, {
                        onError: (err) =>
                          setActionError(extractApiError(err, "Failed to submit PO")),
                      })
                    }
                    disabled={submitPo.isPending}
                  >
                    <Send className="h-4 w-4" />
                    {submitPo.isPending ? "Submitting…" : "Submit"}
                  </Button>
                </PermissionGate>
              )}
              <PoApprovalActions
                poId={poId}
                serialNumber={po.serialNumber}
                approvalContext={po.approvalContext}
                approveDisabled={approveBlockedByReview}
                approveDisabledReason="Open all attachments before approving"
                onError={setActionError}
              />
              {status === "approved" && (
                <PermissionGate permission="PURCHASE_ORDERS:ISSUE">
                  <Button
                    onClick={() =>
                      issuePo.mutate(poId, {
                        onError: (err) =>
                          setActionError(extractApiError(err, "Failed to issue PO")),
                        onSuccess: () => {
                          qc.invalidateQueries({ queryKey: ["purchase-orders", poId] });
                        },
                      })
                    }
                    disabled={issuePo.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {issuePo.isPending ? "Issuing…" : "Issue PO"}
                  </Button>
                </PermissionGate>
              )}
              {status === "issued" && (
                <PermissionGate permission="GOODS_RECEIPTS:CREATE">
                  <Button asChild>
                    <Link href={`/procurement/goods-receipt/new?poId=${poId}`}>
                      <PackageCheck className="h-4 w-4" />
                      Create GRN
                    </Link>
                  </Button>
                </PermissionGate>
              )}
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print PO
              </Button>
            </div>
          }
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          {po.pr && (
            <Button variant="link" className="h-auto p-0 text-sm" asChild>
              <Link href={`/procurement/requisitions/${po.pr.id}`}>
                PR {po.pr.serialNumber}
              </Link>
            </Button>
          )}
        </div>
        <WaitingForLabel status={po.status} approvalContext={po.approvalContext} />
        {actionError && (
          <div className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Vendor:</span> {vendorName}
              </p>
              <p>
                <span className="text-muted-foreground">Grant:</span>{" "}
                {po.grant ? `${po.grant.code} — ${po.grant.name}` : "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Total:</span>{" "}
                {formatCurrency(Number(po.totalAmount), po.currency)}
              </p>
              <p>
                <span className="text-muted-foreground">Delivery:</span>{" "}
                {po.deliveryDate ? formatDate(po.deliveryDate) : "—"}
              </p>
              <p className="pt-2 text-muted-foreground">
                {items.length} line item{items.length === 1 ? "" : "s"} — use Print PO for the
                official form with Requested / Checked / Approved sign-off.
              </p>
            </CardContent>
          </Card>

          {po.workflow?.steps && po.workflow.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepTimeline
                  steps={po.workflow.steps}
                  currentStepNumber={po.workflow.currentStepNumber}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-6">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Attachments</CardTitle>
              {canShowApprove && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Reviewed {viewedCount} of {totalAttachments} attachments
                  {totalAttachments > 0
                    ? " — open every file before Approve is enabled"
                    : " — nothing to review"}
                </p>
              )}
            </div>
            {canEditDocs && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                  onChange={(e) => handleUploadFiles(e.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {prId && (
              <div className="space-y-2">
                <p className="text-sm font-medium">From PR</p>
                {loadingPrDocs ? (
                  <p className="text-sm text-muted-foreground">Loading documents…</p>
                ) : prDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No documents attached to the linked PR.
                  </p>
                ) : (
                  <ul className="divide-y rounded-lg border">
                    {prDocuments.map((doc) =>
                      renderDocRow({ ...doc, source: "pr" }, false),
                    )}
                  </ul>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">PO documents</p>
              {loadingPoDocs ? (
                <p className="text-sm text-muted-foreground">Loading documents…</p>
              ) : poDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No PO documents attached.</p>
              ) : (
                <ul className="divide-y rounded-lg border">
                  {poDocuments.map((doc) =>
                    renderDocRow({ ...doc, source: "po" }, canEditDocs),
                  )}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete document?"
        description={`Remove "${deleteTarget?.fileName ?? deleteTarget?.originalName}" from this purchase order?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) deleteDoc.mutate(deleteTarget.id);
        }}
      />

      <div className="hidden print:block">
        <PoPrintView po={po} />
      </div>
    </>
  );
}
