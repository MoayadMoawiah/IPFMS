"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/components/auth/permission-gate";
import {
  DocumentApprovalDialog,
  type ApprovalAction,
} from "@/components/workflow/document-approval-dialog";
import {
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useReturnPurchaseOrder,
} from "@/hooks/use-procurement";
import { extractApiError } from "@/lib/api-errors";

export interface PoApprovalContext {
  canAct?: boolean;
  allowReject?: boolean;
  allowReturn?: boolean;
  waitingForStepName?: string | null;
}

interface PoApprovalActionsProps {
  poId: string;
  serialNumber: string;
  approvalContext?: PoApprovalContext | null;
  /** When true, Approve is disabled (e.g. attachments not yet reviewed). */
  approveDisabled?: boolean;
  approveDisabledReason?: string;
  onError?: (message: string) => void;
}

export function PoApprovalActions({
  poId,
  serialNumber,
  approvalContext,
  approveDisabled = false,
  approveDisabledReason,
  onError,
}: PoApprovalActionsProps) {
  const approve = useApprovePurchaseOrder();
  const reject = useRejectPurchaseOrder();
  const returnPo = useReturnPurchaseOrder();
  const hasPoApprove = usePermission("PURCHASE_ORDERS:APPROVE");
  const hasWorkflowApprove = usePermission("WORKFLOW:APPROVE");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction>("APPROVE");
  const [comment, setComment] = useState("");

  if (!approvalContext?.canAct) return null;
  if (!hasPoApprove && !hasWorkflowApprove) return null;

  const isPending = approve.isPending || reject.isPending || returnPo.isPending;

  function openAction(action: ApprovalAction) {
    setSelectedAction(action);
    setComment("");
    setDialogOpen(true);
  }

  function handleConfirm() {
    const handlers = {
      APPROVE: () =>
        approve.mutate(
          { id: poId, comment: comment.trim() || undefined },
          {
            onSuccess: () => setDialogOpen(false),
            onError: (err: unknown) =>
              onError?.(extractApiError(err, "Approval failed")),
          },
        ),
      REJECT: () =>
        reject.mutate(
          { id: poId, comment: comment.trim() },
          {
            onSuccess: () => setDialogOpen(false),
            onError: (err: unknown) =>
              onError?.(extractApiError(err, "Reject failed")),
          },
        ),
      RETURN: () =>
        returnPo.mutate(
          { id: poId, comment: comment.trim() },
          {
            onSuccess: () => setDialogOpen(false),
            onError: (err: unknown) =>
              onError?.(extractApiError(err, "Return failed")),
          },
        ),
    };

    handlers[selectedAction]();
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => openAction("APPROVE")}
        disabled={isPending || approveDisabled}
        title={approveDisabled ? approveDisabledReason : undefined}
      >
        <CheckCircle2 className="h-4 w-4" />
        Approve
      </Button>
      {approvalContext.allowReject && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => openAction("REJECT")}
          disabled={isPending}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      )}
      {approvalContext.allowReturn && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openAction("RETURN")}
          disabled={isPending}
        >
          <RotateCcw className="h-4 w-4" />
          Return
        </Button>
      )}

      <DocumentApprovalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={selectedAction}
        description={`Purchase Order ${serialNumber}${
          approvalContext.waitingForStepName
            ? ` — ${approvalContext.waitingForStepName}`
            : ""
        }`}
        comment={comment}
        onCommentChange={setComment}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  );
}
