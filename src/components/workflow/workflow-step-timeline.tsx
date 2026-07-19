import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  status: string;
  completedAt?: string | null;
  comment?: string | null;
  action?: string | null;
  digitalSignature?: {
    signedAt?: string | null;
    ipAddress?: string | null;
    user?: {
      firstName?: string | null;
      lastName?: string | null;
      roles?: Array<{ role?: { name?: string | null } | null } | { name?: string | null }>;
    } | null;
  } | null;
}

interface WorkflowStepTimelineProps {
  steps: WorkflowStep[];
  currentStepNumber?: number;
}

function stepIcon(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "APPROVED" || normalized === "COMPLETED") {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  }
  if (normalized === "REJECTED") {
    return <XCircle className="h-5 w-5 text-destructive" />;
  }
  if (normalized === "IN_PROGRESS") {
    return <Clock className="h-5 w-5 text-primary" />;
  }
  return <Circle className="h-5 w-5 text-muted-foreground" />;
}

function signerName(step: WorkflowStep): string {
  const u = step.digitalSignature?.user;
  if (!u) return "";
  return [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
}

function signerPosition(step: WorkflowStep): string {
  const roles = step.digitalSignature?.user?.roles;
  if (!roles?.length) return "";
  const first = roles[0] as { role?: { name?: string }; name?: string };
  return first?.role?.name ?? first?.name ?? "";
}

export function WorkflowStepTimeline({ steps, currentStepNumber }: WorkflowStepTimelineProps) {
  if (!steps.length) return null;

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCurrent =
          step.status.toUpperCase() === "IN_PROGRESS" ||
          step.stepNumber === currentStepNumber;
        const name = signerName(step);
        const position = signerPosition(step);
        const signedAt = step.digitalSignature?.signedAt ?? step.completedAt;

        return (
          <div key={step.stepNumber} className="flex gap-3">
            <div className="flex flex-col items-center">
              {stepIcon(step.status)}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-1 h-full min-h-[1.5rem] w-px",
                    step.status.toUpperCase() === "APPROVED"
                      ? "bg-green-600/40"
                      : "bg-border",
                  )}
                />
              )}
            </div>
            <div className={cn("flex-1 pb-2", isCurrent && "font-medium")}>
              <p>{step.stepName}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {step.status.toLowerCase().replace(/_/g, " ")}
              </p>
              {name && (
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">E-sign:</span> {name}
                    {position ? ` · ${position}` : ""}
                  </p>
                  {signedAt && <p>Date: {formatDate(signedAt)}</p>}
                </div>
              )}
              {step.comment && (
                <p className="mt-1 text-xs italic text-muted-foreground">{step.comment}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
