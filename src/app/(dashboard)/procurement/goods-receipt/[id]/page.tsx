"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  ExternalLink,
  FileText,
  Printer,
  RotateCcw,
  Save,
  Send,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PermissionGate, usePermission } from "@/components/auth/permission-gate";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import {
  DocumentApprovalDialog,
  type ApprovalAction,
} from "@/components/workflow/document-approval-dialog";
import { GenericDocPrintView, formatMetaDate } from "@/components/documents/generic-doc-print-view";
import {
  ACCEPTED_DOCUMENT_TYPES,
  formatBytes,
} from "@/components/forms/supporting-documents-field";
import {
  useApproveGoodsReceipt,
  useGoodsReceipt,
  useRejectGoodsReceipt,
  useReturnGoodsReceipt,
  useSubmitGoodsReceipt,
  useUpdateGoodsReceipt,
} from "@/hooks/use-procurement";
import { useWarehouses } from "@/hooks/use-inventory";
import {
  type DocumentAttachment,
  deleteGoodsReceiptDocument,
  getGoodsReceiptDocuments,
  uploadGoodsReceiptDocuments,
} from "@/lib/api/uploads";
import { getPaginatedItems } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

type LineDecision = "accepted" | "rejected" | null;

type EditLine = {
  id: string;
  description: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damagedQuantity: number;
  notes: string;
  decision: LineDecision;
};

type LineStatus = "accepted" | "rejected" | "partial" | "pending";

function lineStatus(item: {
  acceptedQuantity: number | string;
  rejectedQuantity?: number | string;
  damagedQuantity?: number | string;
}): LineStatus {
  const accepted = Number(item.acceptedQuantity) || 0;
  const rejected = Number(item.rejectedQuantity) || 0;
  if (accepted > 0 && rejected > 0) return "partial";
  if (rejected > 0 && accepted <= 0) return "rejected";
  if (accepted > 0) return "accepted";
  return "pending";
}

function lineStatusLabel(status: LineStatus): string {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "partial":
      return "Partial";
    default:
      return "Pending";
  }
}

function qty(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") return "0";
  return String(value);
}

export default function GoodsReceiptDetailPage() {
  const params = useParams();
  const grnId = params.id as string;
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canUpdateGrn = usePermission("GOODS_RECEIPTS:UPDATE");
  const { data, isLoading, isError, refetch } = useGoodsReceipt(grnId);
  const submitGrn = useSubmitGoodsReceipt();
  const updateGrn = useUpdateGoodsReceipt();
  const approveGrn = useApproveGoodsReceipt();
  const rejectGrn = useRejectGoodsReceipt();
  const returnGrn = useReturnGoodsReceipt();
  const { data: warehousesData } = useWarehouses({ limit: 100 });
  const warehouses = getPaginatedItems(warehousesData) as Array<{
    id: string;
    name: string;
    code?: string;
  }>;
  const [actionError, setActionError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction>("APPROVE");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentAttachment | null>(null);
  const [warehouseId, setWarehouseId] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [notes, setNotes] = useState("");
  const [editLines, setEditLines] = useState<EditLine[]>([]);

  const { data: documents = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["goods-receipt-documents", grnId],
    queryFn: () => getGoodsReceiptDocuments(grnId),
    enabled: Boolean(grnId),
  });

  const deleteDoc = useMutation({
    mutationFn: (attachmentId: string) =>
      deleteGoodsReceiptDocument(grnId, attachmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goods-receipt-documents", grnId] });
      setDeleteTarget(null);
    },
    onError: (err) =>
      setActionError(extractApiError(err, "Failed to delete document")),
  });

  useEffect(() => {
    if (!data) return;
    const g = data as {
      warehouseId?: string | null;
      warehouse?: { id?: string } | null;
      receiptDate?: string;
      deliveryNote?: string | null;
      notes?: string | null;
      items?: Array<{
        id: string;
        description: string;
        orderedQuantity: number | string;
        deliveredQuantity: number | string;
        acceptedQuantity: number | string;
        rejectedQuantity?: number | string;
        damagedQuantity?: number | string;
        notes?: string | null;
      }>;
    };
    setWarehouseId(g.warehouseId ?? g.warehouse?.id ?? "");
    setReceiptDate(
      g.receiptDate ? new Date(g.receiptDate).toISOString().slice(0, 10) : "",
    );
    setDeliveryNote(g.deliveryNote ?? "");
    setNotes(g.notes ?? "");
    setEditLines(
      (g.items ?? []).map((item) => {
        const accepted = Number(item.acceptedQuantity) || 0;
        const rejected = Number(item.rejectedQuantity) || 0;
        let decision: LineDecision = null;
        if (rejected > 0 && accepted <= 0) decision = "rejected";
        else if (accepted > 0 && rejected <= 0) decision = "accepted";
        return {
          id: item.id,
          description: item.description,
          orderedQuantity: Number(item.orderedQuantity) || 0,
          deliveredQuantity: Number(item.deliveredQuantity) || 0,
          acceptedQuantity: accepted,
          rejectedQuantity: rejected,
          damagedQuantity: Number(item.damagedQuantity) || 0,
          notes: item.notes ?? "",
          decision,
        };
      }),
    );
  }, [data]);

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Goods receipt not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/procurement/goods-receipt">Back to Goods Receipts</Link>
        </Button>
      </div>
    );
  }

  const grn = data as {
    id: string;
    serialNumber: string;
    status: string;
    receiptDate: string;
    deliveryNote?: string | null;
    notes?: string | null;
    createdAt?: string;
    warehouseId?: string | null;
    poId?: string;
    po?: { id?: string; vendor?: { name: string } };
    grant?: { code: string; name: string };
    warehouse?: { id?: string; name: string; code?: string } | null;
    receivedBy?: {
      firstName?: string;
      lastName?: string;
      roles?: Array<{ role?: { name?: string } }>;
    };
    approvalContext?: {
      canAct?: boolean;
      waitingForRoleName?: string | null;
      waitingForStepName?: string | null;
      dueAt?: string | null;
      allowReject?: boolean;
      allowReturn?: boolean;
    } | null;
    items?: Array<{
      id: string;
      description: string;
      orderedQuantity: number | string;
      deliveredQuantity: number | string;
      acceptedQuantity: number | string;
      rejectedQuantity?: number | string;
      damagedQuantity?: number | string;
      notes?: string | null;
      poItem?: { unit?: string; unitPrice?: number | string };
    }>;
    workflow?: {
      currentStepNumber?: number;
      steps?: Array<{
        stepNumber: number;
        stepName: string;
        status: string;
        action?: string | null;
        completedAt?: string | null;
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
        action?: string | null;
        actionAt?: string | null;
        actor?: {
          firstName?: string;
          lastName?: string;
          roles?: Array<{ role?: { name?: string } }>;
        } | null;
      }>;
    } | null;
  };

  const items = grn.items ?? [];
  const status = grn.status.toUpperCase();
  const canSubmit = status === "DRAFT" || status === "RETURNED";
  const canEdit =
    canUpdateGrn && (status === "DRAFT" || status === "RETURNED");
  const canEditDocs = canEdit;
  const canWorkflowAct =
    status === "SUBMITTED" && Boolean(grn.approvalContext?.canAct);
  const showReject =
    canWorkflowAct && grn.approvalContext?.allowReject !== false;
  const showReturn =
    canWorkflowAct && grn.approvalContext?.allowReturn !== false;
  const displayLines = canEdit ? editLines : items;
  const hasRejectedLines = displayLines.some(
    (item) => (Number(item.rejectedQuantity) || 0) > 0,
  );
  const allLinesFullyRejected =
    displayLines.length > 0 &&
    displayLines.every(
      (item) =>
        (Number(item.acceptedQuantity) || 0) <= 0 &&
        (Number(item.rejectedQuantity) || 0) > 0,
    );
  const receivedByName = grn.receivedBy
    ? `${grn.receivedBy.firstName ?? ""} ${grn.receivedBy.lastName ?? ""}`.trim()
    : "";
  const actionPending =
    approveGrn.isPending ||
    rejectGrn.isPending ||
    returnGrn.isPending ||
    updateGrn.isPending;

  const openActionDialog = (action: ApprovalAction) => {
    setSelectedAction(action);
    setComment("");
    setActionError(null);
    setDialogOpen(true);
  };

  const updateEditLine = (
    index: number,
    field: keyof Omit<EditLine, "id" | "description" | "decision" | "notes">,
    value: number,
  ) => {
    setEditLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        const next = { ...line, [field]: value };
        if (
          field === "acceptedQuantity" ||
          field === "rejectedQuantity" ||
          field === "deliveredQuantity"
        ) {
          next.decision = null;
        }
        return next;
      }),
    );
  };

  const acceptEditLine = (index: number) => {
    setEditLines((prev) =>
      prev.map((line, i) =>
        i === index
          ? {
              ...line,
              acceptedQuantity: line.deliveredQuantity,
              rejectedQuantity: 0,
              decision: "accepted",
              notes: "",
            }
          : line,
      ),
    );
  };

  const rejectEditLine = (index: number) => {
    setEditLines((prev) =>
      prev.map((line, i) =>
        i === index
          ? {
              ...line,
              acceptedQuantity: 0,
              rejectedQuantity: line.deliveredQuantity,
              decision: "rejected",
            }
          : line,
      ),
    );
  };

  const handleSave = () => {
    setActionError(null);
    const missingRejectReason = editLines.some(
      (line) =>
        (line.decision === "rejected" || line.rejectedQuantity > 0) &&
        !line.notes.trim(),
    );
    if (missingRejectReason) {
      setActionError("Rejection reason is required for rejected items");
      return;
    }

    updateGrn.mutate(
      {
        id: grnId,
        dto: {
          warehouseId: warehouseId || null,
          receiptDate,
          deliveryNote,
          notes,
          items: editLines.map((line) => ({
            id: line.id,
            description: line.description,
            deliveredQuantity: line.deliveredQuantity,
            acceptedQuantity: line.acceptedQuantity,
            rejectedQuantity: line.rejectedQuantity,
            damagedQuantity: line.damagedQuantity,
            notes: line.notes.trim() || null,
          })),
        },
      },
      {
        onSuccess: () => refetch(),
        onError: (err) =>
          setActionError(extractApiError(err, "Failed to save GRN")),
      },
    );
  };

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    setActionError(null);
    try {
      const files = Array.from(fileList);
      await uploadGoodsReceiptDocuments(
        grnId,
        files,
        files.map(() => "Other"),
      );
      await qc.invalidateQueries({
        queryKey: ["goods-receipt-documents", grnId],
      });
    } catch (err) {
      setActionError(extractApiError(err, "Failed to upload documents"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmAction = () => {
    if (
      (selectedAction === "REJECT" || selectedAction === "RETURN") &&
      !comment.trim()
    ) {
      return;
    }

    setActionError(null);
    if (selectedAction === "APPROVE") {
      approveGrn.mutate(
        { id: grnId, comment: comment.trim() || undefined },
        {
          onSuccess: () => {
            setDialogOpen(false);
            refetch();
          },
          onError: (err) =>
            setActionError(extractApiError(err, "Failed to approve GRN")),
        },
      );
      return;
    }

    if (selectedAction === "REJECT") {
      rejectGrn.mutate(
        { id: grnId, comment: comment.trim() },
        {
          onSuccess: () => {
            setDialogOpen(false);
            refetch();
          },
          onError: (err) =>
            setActionError(extractApiError(err, "Failed to reject GRN")),
        },
      );
      return;
    }

    if (selectedAction === "RETURN") {
      returnGrn.mutate(
        { id: grnId, comment: comment.trim() },
        {
          onSuccess: () => {
            setDialogOpen(false);
            refetch();
          },
          onError: (err) =>
            setActionError(extractApiError(err, "Failed to return GRN")),
        },
      );
    }
  };

  return (
    <>
      <div className="no-print space-y-6">
        <PageHeader
          title={grn.serialNumber}
          description="Goods Receipt Note"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Goods Receipt", href: "/procurement/goods-receipt" },
            { label: grn.serialNumber },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <Button
                  onClick={handleSave}
                  disabled={updateGrn.isPending}
                  variant="secondary"
                >
                  <Save className="h-4 w-4" />
                  {updateGrn.isPending ? "Saving…" : "Save changes"}
                </Button>
              )}
              {status === "APPROVED" && (
                <PermissionGate permission="INVOICES:CREATE">
                  <Button asChild>
                    <Link
                      href={`/procurement/vendor-invoices/new?grnId=${grnId}&poId=${grn.poId ?? grn.po?.id ?? ""}`}
                    >
                      <FileText className="h-4 w-4" />
                      Create Vendor Invoice
                    </Link>
                  </Button>
                </PermissionGate>
              )}
              {canSubmit && (
                <PermissionGate permission="GOODS_RECEIPTS:SUBMIT">
                  <Button
                    onClick={() => {
                      setActionError(null);
                      submitGrn.mutate(grnId, {
                        onSuccess: () => refetch(),
                        onError: (err) =>
                          setActionError(
                            extractApiError(err, "Failed to submit GRN"),
                          ),
                      });
                    }}
                    disabled={submitGrn.isPending || updateGrn.isPending}
                  >
                    <Send className="h-4 w-4" />
                    {submitGrn.isPending
                      ? "Submitting…"
                      : status === "RETURNED"
                        ? "Resubmit GRN"
                        : "Submit GRN"}
                  </Button>
                </PermissionGate>
              )}
              {canWorkflowAct && (
                <PermissionGate permission="GOODS_RECEIPTS:APPROVE">
                  <Button
                    onClick={() => openActionDialog("APPROVE")}
                    disabled={actionPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  {showReturn && (
                    <Button
                      variant="outline"
                      onClick={() => openActionDialog("RETURN")}
                      disabled={actionPending}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return for edit
                    </Button>
                  )}
                  {showReject && (
                    <Button
                      variant="destructive"
                      onClick={() => openActionDialog("REJECT")}
                      disabled={actionPending}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject document
                    </Button>
                  )}
                </PermissionGate>
              )}
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print GRN
              </Button>
              <Button variant="outline" asChild>
                <Link href="/procurement/goods-receipt">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          }
        />

        {actionError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {actionError}
          </div>
        )}

        {hasRejectedLines && status !== "DRAFT" && status !== "REJECTED" && (
          <div
            className={cn(
              "rounded-md border px-4 py-3 text-sm",
              allLinesFullyRejected
                ? "border-amber-500/50 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
                : "border-amber-500/40 bg-amber-50/80 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100",
            )}
          >
            <p className="font-medium">
              {allLinesFullyRejected
                ? "All line items on this GRN are fully rejected."
                : "This GRN includes rejected line items."}
            </p>
            <p className="mt-1 text-muted-foreground dark:text-amber-100/80">
              Approving confirms accepted and rejected quantities as recorded.
              Use <span className="font-medium">Return for edit</span> so the
              officer can fix attachments/details, or{" "}
              <span className="font-medium">Reject document</span> only if the
              whole GRN is invalid.
            </p>
          </div>
        )}

        {status === "RETURNED" && (
          <div className="rounded-md border border-amber-500/40 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
            This GRN was returned for correction. Edit line items and
            attachments, save, then resubmit.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={grn.status.toLowerCase()} />
          <span className="text-sm text-muted-foreground">
            Receipt date: {formatDate(grn.receiptDate)}
          </span>
        </div>

        {status === "SUBMITTED" && (
          <WaitingForLabel
            status={grn.status}
            approvalContext={grn.approvalContext}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Vendor:</span>{" "}
                {grn.po?.vendor?.name ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Grant:</span>{" "}
                {grn.grant ? `${grn.grant.code} — ${grn.grant.name}` : "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Received by:</span>{" "}
                {receivedByName || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Items:</span>{" "}
                {displayLines.length}
              </p>
              {canEdit ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="warehouseId">Warehouse</Label>
                    <Select value={warehouseId} onValueChange={setWarehouseId}>
                      <SelectTrigger id="warehouseId">
                        <SelectValue placeholder="Select warehouse (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.code ? `${w.code} — ${w.name}` : w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="receiptDate">Receipt date</Label>
                    <Input
                      id="receiptDate"
                      type="date"
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="deliveryNote">Delivery note</Label>
                    <Input
                      id="deliveryNote"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <span className="text-muted-foreground">Warehouse:</span>{" "}
                    {grn.warehouse
                      ? grn.warehouse.code
                        ? `${grn.warehouse.code} — ${grn.warehouse.name}`
                        : grn.warehouse.name
                      : "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Delivery note:</span>{" "}
                    {grn.deliveryNote || "—"}
                  </p>
                  {grn.notes && (
                    <p className="sm:col-span-2">
                      <span className="text-muted-foreground">Notes:</span>{" "}
                      {grn.notes}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {grn.workflow?.steps && grn.workflow.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepTimeline
                  steps={grn.workflow.steps}
                  currentStepNumber={grn.workflow.currentStepNumber}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent>
            {displayLines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No line items.</p>
            ) : canEdit ? (
              <div className="space-y-3">
                {editLines.map((line, index) => (
                  <div
                    key={line.id}
                    className={cn(
                      "grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-6",
                      line.decision === "accepted" &&
                        "border-green-500/60 bg-green-50/50 dark:bg-green-950/20",
                      line.decision === "rejected" &&
                        "border-red-500/60 bg-red-50/50 dark:bg-red-950/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 sm:col-span-2 lg:col-span-2">
                      <div>
                        <p className="text-sm font-medium">{line.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Ordered: {line.orderedQuantity}
                          {line.decision === "accepted" && " · Accepted"}
                          {line.decision === "rejected" && " · Rejected"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          title="Accept item"
                          className={cn(
                            "h-8 w-8 border-green-600 text-green-700 hover:bg-green-50",
                            line.decision === "accepted" &&
                              "bg-green-600 text-white hover:bg-green-600 hover:text-white",
                          )}
                          onClick={() => acceptEditLine(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          title="Reject item"
                          className={cn(
                            "h-8 w-8 border-red-600 text-red-700 hover:bg-red-50",
                            line.decision === "rejected" &&
                              "bg-red-600 text-white hover:bg-red-600 hover:text-white",
                          )}
                          onClick={() => rejectEditLine(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {(
                      [
                        ["deliveredQuantity", "Delivered"],
                        ["acceptedQuantity", "Accepted"],
                        ["rejectedQuantity", "Rejected"],
                        ["damagedQuantity", "Damaged"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs">{label}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          value={line[field]}
                          onChange={(e) =>
                            updateEditLine(
                              index,
                              field,
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                    ))}
                    {(line.decision === "rejected" ||
                      line.rejectedQuantity > 0) && (
                      <div className="space-y-1 sm:col-span-2 lg:col-span-6">
                        <Label className="text-xs text-red-700">
                          Rejection reason <span className="text-red-600">*</span>
                        </Label>
                        <Textarea
                          value={line.notes}
                          onChange={(e) =>
                            setEditLines((prev) =>
                              prev.map((l, i) =>
                                i === index
                                  ? { ...l, notes: e.target.value }
                                  : l,
                              ),
                            )
                          }
                          placeholder="Explain why this item is rejected"
                          rows={2}
                          className="border-red-300 focus-visible:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const itemStatus = lineStatus(item);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-md border p-3",
                        itemStatus === "accepted" &&
                          "border-green-500/60 bg-green-50/50 dark:bg-green-950/20",
                        itemStatus === "rejected" &&
                          "border-red-500/60 bg-red-50/50 dark:bg-red-950/20",
                        itemStatus === "partial" &&
                          "border-amber-500/60 bg-amber-50/50 dark:bg-amber-950/20",
                      )}
                    >
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-medium">{item.description}</p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            itemStatus === "accepted" &&
                              "bg-green-600 text-white",
                            itemStatus === "rejected" && "bg-red-600 text-white",
                            itemStatus === "partial" &&
                              "bg-amber-600 text-white",
                            itemStatus === "pending" &&
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {lineStatusLabel(itemStatus)}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-5">
                        <p>
                          Ordered:{" "}
                          <span className="font-medium text-foreground">
                            {qty(item.orderedQuantity)}
                          </span>
                        </p>
                        <p>
                          Delivered:{" "}
                          <span className="font-medium text-foreground">
                            {qty(item.deliveredQuantity)}
                          </span>
                        </p>
                        <p>
                          Accepted:{" "}
                          <span className="font-medium text-green-700 dark:text-green-400">
                            {qty(item.acceptedQuantity)}
                          </span>
                        </p>
                        <p>
                          Rejected:{" "}
                          <span className="font-medium text-red-700 dark:text-red-400">
                            {qty(item.rejectedQuantity)}
                          </span>
                        </p>
                        <p>
                          Damaged:{" "}
                          <span className="font-medium text-foreground">
                            {qty(item.damagedQuantity)}
                          </span>
                        </p>
                      </div>
                      {item.notes && (
                        <div
                          className={cn(
                            "mt-3 rounded-md border px-3 py-2 text-sm",
                            itemStatus === "rejected" ||
                              Number(item.rejectedQuantity) > 0
                              ? "border-red-200 bg-red-50/80 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
                              : "border-border bg-muted/40",
                          )}
                        >
                          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide opacity-80">
                            {Number(item.rejectedQuantity) > 0
                              ? "Rejection reason"
                              : "Comment"}
                          </p>
                          <p>{item.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Attachments</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload delivery notes or supporting files while the GRN is draft
                or returned.
              </p>
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
          <CardContent>
            {loadingDocs ? (
              <p className="text-sm text-muted-foreground">Loading documents…</p>
            ) : documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents attached.
              </p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {doc.fileName || doc.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.originalName}
                        {doc.fileSize ? ` · ${formatBytes(doc.fileSize)}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      {canEditDocs && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => setDeleteTarget(doc)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete document?"
        description={`Remove "${deleteTarget?.fileName ?? deleteTarget?.originalName}" from this goods receipt?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) deleteDoc.mutate(deleteTarget.id);
        }}
      />

      <div className="hidden print:block">
        <GenericDocPrintView
          title="Goods Receipt Note – GRN"
          documentNumber={grn.serialNumber}
          description={grn.notes || grn.deliveryNote}
          showTotalInWords={false}
          requestedByUser={grn.receivedBy}
          requestedAt={grn.receiptDate || grn.createdAt}
          steps={grn.workflow?.steps}
          actions={grn.workflow?.actions}
          meta={[
            { label: "Status", value: grn.status },
            { label: "Receipt Date", value: formatMetaDate(grn.receiptDate) },
            { label: "Vendor", value: grn.po?.vendor?.name ?? "—" },
            {
              label: "Grant",
              value: grn.grant ? `${grn.grant.code} — ${grn.grant.name}` : "—",
            },
            { label: "Warehouse", value: grn.warehouse?.name ?? "—" },
            {
              label: "Delivery Note",
              value: grn.deliveryNote || "—",
            },
          ]}
          items={items.map((item) => {
            const itemStatus = lineStatus(item);
            const noteSuffix = item.notes
              ? ` | ${Number(item.rejectedQuantity) > 0 ? "Reject reason" : "Comment"}: ${item.notes}`
              : "";
            return {
              id: item.id,
              description: `${item.description} [${lineStatusLabel(itemStatus)}] (D:${qty(item.deliveredQuantity)} A:${qty(item.acceptedQuantity)} R:${qty(item.rejectedQuantity)})${noteSuffix}`,
              unit: item.poItem?.unit ?? "Unit",
              quantity: item.acceptedQuantity,
              unitPrice: item.poItem?.unitPrice ?? 0,
              total:
                Number(item.acceptedQuantity) *
                Number(item.poItem?.unitPrice ?? 0),
            };
          })}
        />
      </div>

      <DocumentApprovalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={selectedAction}
        title={
          selectedAction === "REJECT"
            ? "Reject goods receipt document"
            : selectedAction === "RETURN"
              ? "Return goods receipt for edit"
              : "Approve goods receipt"
        }
        description={
          selectedAction === "REJECT"
            ? "Reject this GRN only if the whole receipt is invalid. Line-item rejections are already recorded on the items."
            : selectedAction === "RETURN"
              ? "Return the GRN so procurement can update details and attachments, then resubmit."
              : hasRejectedLines
                ? "Approving confirms accepted and rejected quantities as recorded on each line."
                : "Confirm approval of this goods receipt."
        }
        comment={comment}
        onCommentChange={setComment}
        onConfirm={handleConfirmAction}
        isPending={actionPending}
      />
    </>
  );
}
