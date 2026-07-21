"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CornerUpLeft,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { PermissionGate, usePermission } from "@/components/auth/permission-gate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAdminMoveWorkflow,
  useAdminReopenWorkflow,
  useAdminReturnWorkflow,
  useAdminSetWorkflowStep,
  useWorkflowAdminBoard,
} from "@/hooks/use-workflow-admin";
import type {
  WorkflowBoardCard,
  WorkflowBoardDocumentType,
} from "@/lib/api/workflow-admin";
import { extractApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

const DOC_TYPES: Array<{ value: WorkflowBoardDocumentType; label: string }> = [
  { value: "PURCHASE_REQUISITION", label: "Purchase Requisition" },
  { value: "PURCHASE_ORDER", label: "Purchase Order" },
  { value: "GOODS_RECEIPT", label: "Goods Receipt" },
  { value: "VENDOR_INVOICE", label: "Vendor Invoice" },
  { value: "PAYMENT_REQUEST", label: "Payment Request" },
  { value: "PAYMENT_VOUCHER", label: "Payment Voucher" },
];

type OverrideAction =
  | { kind: "FORWARD" | "BACK"; card: WorkflowBoardCard }
  | { kind: "SET_STEP"; card: WorkflowBoardCard; stepNumber: number }
  | { kind: "RETURN"; card: WorkflowBoardCard }
  | { kind: "REOPEN"; card: WorkflowBoardCard; stepNumber: number };

export default function WorkflowBoardPage() {
  const canOverride = usePermission("WORKFLOW:OVERRIDE");
  const [documentType, setDocumentType] =
    useState<WorkflowBoardDocumentType>("PURCHASE_REQUISITION");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<OverrideAction | null>(null);
  const [comment, setComment] = useState("");
  const [jumpStep, setJumpStep] = useState("1");

  const { data, isLoading, isError, refetch } = useWorkflowAdminBoard(documentType);
  const moveMut = useAdminMoveWorkflow();
  const setStepMut = useAdminSetWorkflowStep();
  const returnMut = useAdminReturnWorkflow();
  const reopenMut = useAdminReopenWorkflow();

  const isBusy =
    moveMut.isPending ||
    setStepMut.isPending ||
    returnMut.isPending ||
    reopenMut.isPending;

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, WorkflowBoardCard[]>();
    for (const col of data?.columns ?? []) map.set(col.key, []);
    for (const card of data?.cards ?? []) {
      const list = map.get(card.columnKey) ?? [];
      list.push(card);
      map.set(card.columnKey, list);
    }
    return map;
  }, [data]);

  const openAction = (action: OverrideAction) => {
    setActionError(null);
    setComment("");
    if (action.kind === "SET_STEP" || action.kind === "REOPEN") {
      setJumpStep(String(action.stepNumber));
    }
    setPending(action);
  };

  const confirmAction = async () => {
    if (!pending) return;
    setActionError(null);
    try {
      if (pending.kind === "FORWARD" || pending.kind === "BACK") {
        await moveMut.mutateAsync({
          instanceId: pending.card.instanceId,
          direction: pending.kind,
          comment,
        });
      } else if (pending.kind === "SET_STEP") {
        await setStepMut.mutateAsync({
          instanceId: pending.card.instanceId,
          stepNumber: Number(jumpStep),
          comment,
        });
      } else if (pending.kind === "RETURN") {
        await returnMut.mutateAsync({
          instanceId: pending.card.instanceId,
          comment,
        });
      } else if (pending.kind === "REOPEN") {
        await reopenMut.mutateAsync({
          documentType: pending.card.documentType,
          documentId: pending.card.documentId,
          stepNumber: Number(jumpStep),
          comment,
        });
      }
      setPending(null);
      setComment("");
    } catch (err) {
      setActionError(extractApiError(err, "Override action failed"));
    }
  };

  const dialogTitle = (() => {
    if (!pending) return "";
    switch (pending.kind) {
      case "FORWARD":
        return "Move forward";
      case "BACK":
        return "Move back";
      case "SET_STEP":
        return "Jump to step";
      case "RETURN":
        return "Return to requester";
      case "REOPEN":
        return "Reopen workflow";
    }
  })();

  if (!canOverride) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">
          Workflow Board requires Super Admin override permission
          (`WORKFLOW:OVERRIDE`).
        </p>
        <Button variant="outline" asChild>
          <Link href="/approvals">Back to Approvals</Link>
        </Button>
      </div>
    );
  }

  return (
    <PermissionGate permission="WORKFLOW:OVERRIDE">
      <div>
        <PageHeader
          title="Workflow Board"
          description="Super Admin Kanban — move, return, or reopen any workflow step"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Approvals", href: "/approvals" },
            { label: "Workflow Board" },
          ]}
          actions={
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Label className="text-sm text-muted-foreground">Document type</Label>
          <Select
            value={documentType}
            onValueChange={(v) => setDocumentType(v as WorkflowBoardDocumentType)}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data?.template && (
            <span className="text-sm text-muted-foreground">
              Template: {data.template.name}
            </span>
          )}
        </div>

        {actionError && !pending && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        {isLoading && <LoadingSkeleton variant="cards" />}

        {isError && (
          <div className="flex flex-col items-center gap-2 py-12 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm">Failed to load workflow board</p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {data.columns.map((col) => {
              const cards = cardsByColumn.get(col.key) ?? [];
              return (
                <div
                  key={col.key}
                  className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/20"
                >
                  <div className="border-b px-3 py-2">
                    <p className="text-sm font-semibold">{col.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cards.length} item{cards.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-2 min-h-[280px]">
                    {cards.length === 0 && (
                      <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                        Empty
                      </p>
                    )}
                    {cards.map((card) => (
                      <WorkflowCard
                        key={card.instanceId}
                        card={card}
                        templateSteps={data.template.steps}
                        onForward={() =>
                          openAction({ kind: "FORWARD", card })
                        }
                        onBack={() => openAction({ kind: "BACK", card })}
                        onJump={(stepNumber) =>
                          openAction({ kind: "SET_STEP", card, stepNumber })
                        }
                        onReturn={() => openAction({ kind: "RETURN", card })}
                        onReopen={() =>
                          openAction({
                            kind: "REOPEN",
                            card,
                            stepNumber: 1,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog
          open={!!pending}
          onOpenChange={(open) => {
            if (!open && !isBusy) {
              setPending(null);
              setActionError(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {pending?.kind === "REOPEN"
                  ? "Reopen resets workflow/document status only. It does not reverse budget commits or journal entries."
                  : pending?.kind === "RETURN"
                    ? "Document will be set to RETURNED so the requester can edit and resubmit."
                    : "This override bypasses normal approver assignment. A comment is required."}
              </DialogDescription>
            </DialogHeader>

            {pending && (
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Document:</span>{" "}
                  {pending.card.document?.serialNumber ?? pending.card.documentId}
                </p>
                {(pending.kind === "SET_STEP" || pending.kind === "REOPEN") && (
                  <div className="space-y-2">
                    <Label>Target step</Label>
                    <Select value={jumpStep} onValueChange={setJumpStep}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(data?.template.steps ?? []).map((s) => (
                          <SelectItem key={s.stepNumber} value={String(s.stepNumber)}>
                            {s.stepNumber}. {s.name}
                          </SelectItem>
                        ))}
                        {pending.kind === "SET_STEP" && (
                          <SelectItem
                            value={String((data?.template.steps.length ?? 0) + 1)}
                          >
                            Complete (Approved)
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="overrideComment">Comment *</Label>
                  <Textarea
                    id="overrideComment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Reason for override (min 5 characters)"
                  />
                </div>
                {actionError && (
                  <p className="text-sm text-destructive">{actionError}</p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPending(null)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={isBusy || comment.trim().length < 5}
              >
                {isBusy ? "Applying…" : "Confirm override"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}

function WorkflowCard({
  card,
  templateSteps,
  onForward,
  onBack,
  onJump,
  onReturn,
  onReopen,
}: {
  card: WorkflowBoardCard;
  templateSteps: Array<{ stepNumber: number; name: string }>;
  onForward: () => void;
  onBack: () => void;
  onJump: (stepNumber: number) => void;
  onReturn: () => void;
  onReopen: () => void;
}) {
  const title =
    card.document?.title ||
    card.document?.serialNumber ||
    card.documentId.slice(0, 8);
  const href = card.document?.href;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm",
        "space-y-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {href ? (
            <Link
              href={href}
              className="truncate text-sm font-medium text-primary hover:underline"
            >
              {card.document?.serialNumber ?? title}
            </Link>
          ) : (
            <p className="truncate text-sm font-medium">
              {card.document?.serialNumber ?? title}
            </p>
          )}
          <p className="truncate text-xs text-muted-foreground">{title}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {card.canMoveBack && (
              <DropdownMenuItem onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Move back
              </DropdownMenuItem>
            )}
            {card.canMoveForward && (
              <DropdownMenuItem onClick={onForward}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Move forward
              </DropdownMenuItem>
            )}
            {card.workflowStatus === "IN_PROGRESS" &&
              templateSteps.map((s) => (
                <DropdownMenuItem
                  key={s.stepNumber}
                  onClick={() => onJump(s.stepNumber)}
                >
                  Jump to {s.stepNumber}. {s.name}
                </DropdownMenuItem>
              ))}
            {card.workflowStatus === "IN_PROGRESS" && (
              <DropdownMenuItem
                onClick={() => onJump(templateSteps.length + 1)}
              >
                Force complete (Approved)
              </DropdownMenuItem>
            )}
            {(card.canMoveForward || card.canMoveBack) && (
              <DropdownMenuSeparator />
            )}
            {card.canReturnToRequester && (
              <DropdownMenuItem onClick={onReturn}>
                <CornerUpLeft className="mr-2 h-4 w-4" />
                Return to requester
              </DropdownMenuItem>
            )}
            {card.canReopen && (
              <DropdownMenuItem onClick={onReopen}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reopen workflow
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={card.workflowStatus.toLowerCase()} />
        {card.document?.status && (
          <StatusBadge status={card.document.status.toLowerCase()} />
        )}
      </div>

      {card.waitingForRoleName && card.workflowStatus === "IN_PROGRESS" && (
        <p className="text-xs text-muted-foreground">
          Waiting: {card.waitingForRoleName}
        </p>
      )}

      {card.workflowStatus === "IN_PROGRESS" && (
        <div className="flex gap-1 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 flex-1"
            disabled={!card.canMoveBack}
            onClick={onBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 flex-1"
            disabled={!card.canMoveForward}
            onClick={onForward}
          >
            Forward
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
