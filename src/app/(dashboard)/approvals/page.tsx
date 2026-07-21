"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertCircle, CheckCircle2, ExternalLink, RotateCcw, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useWorkflowPendingTasks } from "@/hooks/use-search";
import { useProcessDocumentApproval } from "@/hooks/use-approvals";
import {
  DocumentApprovalDialog,
  type ApprovalAction,
} from "@/components/workflow/document-approval-dialog";
import { formatDate } from "@/lib/formatters";
import { getPostApprovalRedirect } from "@/lib/procurement/post-approval-redirect";

interface PendingDocument {
  id: string;
  serialNumber: string;
  title: string;
  status: string;
  label: string;
  href: string;
}

interface PendingTask {
  id: string;
  stepNumber: number;
  stepName: string;
  dueAt?: string | null;
  startedAt?: string | null;
  instanceId: string;
  documentType: string;
  documentId: string;
  allowReject: boolean;
  allowReturn: boolean;
  waitingForRoleName?: string | null;
  document: PendingDocument | null;
}

export default function PendingApprovalsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useWorkflowPendingTasks();
  const processApproval = useProcessDocumentApproval();

  const tasks: PendingTask[] = Array.isArray(data) ? data : [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction>("APPROVE");
  const [comment, setComment] = useState("");

  function openActionDialog(task: PendingTask, action: ApprovalAction) {
    setSelectedTask(task);
    setSelectedAction(action);
    setComment("");
    setDialogOpen(true);
  }

  function handleConfirm() {
    if (!selectedTask) return;
    if ((selectedAction === "REJECT" || selectedAction === "RETURN") && !comment.trim()) {
      return;
    }

    processApproval.mutate(
      {
        documentType: selectedTask.documentType,
        documentId: selectedTask.documentId,
        action: selectedAction,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: (result) => {
          setDialogOpen(false);
          setSelectedTask(null);
          setComment("");
          if (
            selectedTask.documentType === "PURCHASE_REQUISITION" &&
            selectedAction === "APPROVE"
          ) {
            const redirectUrl = getPostApprovalRedirect(result);
            if (redirectUrl) {
              router.push(redirectUrl);
            }
          }
        },
      },
    );
  }

  const columns: ColumnDef<PendingTask>[] = [
    {
      accessorKey: "document.label",
      header: "Document Type",
      cell: ({ row }) => row.original.document?.label ?? row.original.documentType.replace(/_/g, " "),
    },
    {
      accessorKey: "document.serialNumber",
      header: "Reference",
      cell: ({ row }) => {
        const doc = row.original.document;
        if (!doc) return row.original.documentId;
        return (
          <Link href={doc.href} className="font-medium text-primary hover:underline">
            {doc.serialNumber}
          </Link>
        );
      },
    },
    {
      accessorKey: "document.title",
      header: "Title",
      cell: ({ row }) => row.original.document?.title ?? "—",
    },
    {
      accessorKey: "stepName",
      header: "Approval Step",
    },
    {
      accessorKey: "waitingForRoleName",
      header: "Waiting For",
      cell: ({ row }) => row.original.waitingForRoleName ?? "—",
    },
    {
      accessorKey: "dueAt",
      header: "Due",
      cell: ({ row }) => (row.original.dueAt ? formatDate(row.original.dueAt) : "—"),
    },
    {
      accessorKey: "document.status",
      header: "Status",
      cell: ({ row }) =>
        row.original.document?.status ? (
          <StatusBadge status={row.original.document.status.toLowerCase()} />
        ) : (
          "—"
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        const doc = task.document;

        return (
          <div className="flex flex-wrap items-center gap-2">
            {doc && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={doc.href}>
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View
                </Link>
              </Button>
            )}
            <PermissionGate permission="WORKFLOW:APPROVE">
              <Button
                size="sm"
                onClick={() => openActionDialog(task, "APPROVE")}
                disabled={processApproval.isPending}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approve
              </Button>
              {task.allowReject &&
                (task.documentType === "PURCHASE_REQUISITION" ||
                  task.documentType === "GOODS_RECEIPT") && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openActionDialog(task, "REJECT")}
                  disabled={processApproval.isPending}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              )}
              {task.allowReturn &&
                (task.documentType === "PURCHASE_REQUISITION" ||
                  task.documentType === "GOODS_RECEIPT") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openActionDialog(task, "RETURN")}
                  disabled={processApproval.isPending}
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Return
                </Button>
              )}
            </PermissionGate>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        description="Review and action documents assigned to your approval role"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pending Approvals" },
        ]}
      />

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Failed to load pending approvals. Please try again.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          emptyTitle="No pending approvals"
          emptyDescription="You're all caught up — no documents are waiting for your action."
        />
      )}

      <DocumentApprovalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={selectedAction}
        description={
          selectedTask?.document
            ? `${selectedTask.document.label} ${selectedTask.document.serialNumber} — ${selectedTask.stepName}`
            : "Confirm your workflow action."
        }
        comment={comment}
        onCommentChange={setComment}
        onConfirm={handleConfirm}
        isPending={processApproval.isPending}
      />
    </div>
  );
}
