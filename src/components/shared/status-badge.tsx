import { type PRStatus, type POStatus, type PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = PRStatus | POStatus | PaymentStatus | string;

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "muted" | "outline" }
> = {
  draft: { label: "Draft", variant: "muted" },
  submitted: { label: "Submitted", variant: "default" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "muted" },
  issued: { label: "Issued", variant: "default" },
  partial: { label: "Partial", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  paid: { label: "Paid", variant: "success" },
  reviewed: { label: "Reviewed", variant: "secondary" },
  active: { label: "Active", variant: "success" },
  closed: { label: "Closed", variant: "muted" },
  pending: { label: "Pending", variant: "warning" },
  suspended: { label: "Suspended", variant: "destructive" },
  open: { label: "Open", variant: "default" },
  evaluating: { label: "Evaluating", variant: "warning" },
  awarded: { label: "Awarded", variant: "success" },
  processing: { label: "Processing", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
  cleared: { label: "Cleared", variant: "success" },
  presented: { label: "Presented", variant: "warning" },
  bounced: { label: "Bounced", variant: "destructive" },
  voided: { label: "Voided", variant: "muted" },
  inactive: { label: "Inactive", variant: "muted" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  };

  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      {config.label}
    </Badge>
  );
}
