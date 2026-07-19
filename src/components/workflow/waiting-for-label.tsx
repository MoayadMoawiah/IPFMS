import { Clock } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface ApprovalContextSummary {
  waitingForRoleName?: string | null;
  waitingForStepName?: string | null;
  dueAt?: string | null;
}

interface WaitingForLabelProps {
  status: string;
  approvalContext?: ApprovalContextSummary | null;
  className?: string;
  variant?: "banner" | "inline";
}

export function WaitingForLabel({
  status,
  approvalContext,
  className,
  variant = "banner",
}: WaitingForLabelProps) {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "DRAFT" || normalizedStatus === "RETURNED") {
    return null;
  }

  if (normalizedStatus === "APPROVED" || normalizedStatus === "REJECTED") {
    return null;
  }

  if (normalizedStatus === "SUBMITTED" && !approvalContext) {
    if (variant === "inline") {
      return <span className={cn("text-muted-foreground", className)}>Workflow not started</span>;
    }
    return (
      <div
        className={cn(
          "mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200",
          className,
        )}
      >
        <Clock className="h-4 w-4 shrink-0" />
        <span>Waiting for: Workflow not started</span>
      </div>
    );
  }

  if (!approvalContext?.waitingForRoleName) {
    return null;
  }

  const label = `Waiting for: ${approvalContext.waitingForRoleName}`;
  const dueSuffix = approvalContext.dueAt
    ? ` · Due ${formatDate(approvalContext.dueAt)}`
    : "";

  if (variant === "inline") {
    return (
      <span className={cn("text-muted-foreground", className)}>
        {label}
        {dueSuffix}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm",
        className,
      )}
    >
      <Clock className="h-4 w-4 shrink-0 text-primary" />
      <span>
        {label}
        {approvalContext.waitingForStepName && (
          <span className="text-muted-foreground"> ({approvalContext.waitingForStepName})</span>
        )}
        {dueSuffix && <span className="text-muted-foreground">{dueSuffix}</span>}
      </span>
    </div>
  );
}
