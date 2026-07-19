"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/permission-gate";
import {
  DocumentApprovalDialog,
  type ApprovalAction,
} from "@/components/workflow/document-approval-dialog";
import {
  useApprovePurchaseRequisition,
  useRejectPurchaseRequisition,
  useReturnPurchaseRequisition,
} from "@/hooks/use-procurement";
import { getPostApprovalRedirect } from "@/lib/procurement/post-approval-redirect";

export interface PrApprovalContext {
  canAct?: boolean;
  allowReject?: boolean;
  allowReturn?: boolean;
  waitingForStepName?: string | null;
}

interface PrApprovalActionsProps {
  prId: string;
  serialNumber: string;
  approvalContext?: PrApprovalContext | null;
  onError?: (message: string) => void;
}

export function PrApprovalActions({
  prId,
  serialNumber,
  approvalContext,
  onError,
}: PrApprovalActionsProps) {
  const router = useRouter();
  const approve = useApprovePurchaseRequisition();
  const reject = useRejectPurchaseRequisition();
  const returnPR = useReturnPurchaseRequisition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction>("APPROVE");
  const [comment, setComment] = useState("");

  if (!approvalContext || !approvalContext.canAct) return null;

  const isPending = approve.isPending || reject.isPending || returnPR.isPending;

  function openAction(action: ApprovalAction) {
    setSelectedAction(action);
    setComment("");
    setDialogOpen(true);
  }

  function handleConfirm() {
    const handlers = {
      APPROVE: () =>
        approve.mutate(
          { id: prId, comment: comment.trim() || undefined },
          {
            onSuccess: (result) => {
              setDialogOpen(false);
              const redirectUrl = getPostApprovalRedirect(result);
              if (redirectUrl) {
                router.push(redirectUrl);
              }
            },
            onError: (err: unknown) => {
              const e = err as { response?: { data?: { message?: string } }; message?: string };
              onError?.(e?.response?.data?.message ?? e?.message ?? "Approval failed");
            },
          },
        ),
      REJECT: () =>
        reject.mutate(
          { id: prId, comment: comment.trim() },
          {
            onSuccess: () => setDialogOpen(false),
            onError: (err: unknown) => {
              const e = err as { response?: { data?: { message?: string } }; message?: string };
              onError?.(e?.response?.data?.message ?? e?.message ?? "Reject failed");
            },
          },
        ),
      RETURN: () =>
        returnPR.mutate(
          { id: prId, comment: comment.trim() },
          {
            onSuccess: () => setDialogOpen(false),
            onError: (err: unknown) => {
              const e = err as { response?: { data?: { message?: string } }; message?: string };
              onError?.(e?.response?.data?.message ?? e?.message ?? "Return failed");
            },
          },
        ),
    };

    handlers[selectedAction]();
  }

  return (
    <PermissionGate permission="WORKFLOW:APPROVE">
      <Button size="sm" onClick={() => openAction("APPROVE")} disabled={isPending}>
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
        description={`Purchase Requisition ${serialNumber}${
          approvalContext.waitingForStepName
            ? ` — ${approvalContext.waitingForStepName}`
            : ""
        }`}
        comment={comment}
        onCommentChange={setComment}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </PermissionGate>
  );
}
