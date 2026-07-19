"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ApprovalAction = "APPROVE" | "REJECT" | "RETURN";

export const ACTION_LABELS: Record<ApprovalAction, string> = {
  APPROVE: "Approve",
  REJECT: "Reject",
  RETURN: "Return",
};

interface DocumentApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ApprovalAction;
  title?: string;
  description?: string;
  comment: string;
  onCommentChange: (value: string) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DocumentApprovalDialog({
  open,
  onOpenChange,
  action,
  title,
  description,
  comment,
  onCommentChange,
  onConfirm,
  isPending = false,
}: DocumentApprovalDialogProps) {
  const requiresComment = action === "REJECT" || action === "RETURN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? `${ACTION_LABELS[action]} document`}</DialogTitle>
          <DialogDescription>
            {description ?? "Confirm your workflow action."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="approval-comment">
            Comment{action === "APPROVE" ? " (optional)" : ""}
          </Label>
          <Textarea
            id="approval-comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={
              action === "APPROVE"
                ? "Add an optional note for the requester..."
                : "Explain why this document is being returned or rejected..."
            }
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={action === "REJECT" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isPending || (requiresComment && !comment.trim())}
          >
            {ACTION_LABELS[action]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
