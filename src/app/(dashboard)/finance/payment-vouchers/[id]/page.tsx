"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle,
  Printer,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import { GenericDocPrintView, formatMetaDate } from "@/components/documents/generic-doc-print-view";
import {
  usePaymentVoucher,
  useSubmitPaymentVoucher,
  useApprovePaymentVoucher,
  useMarkPaymentVoucherPaid,
} from "@/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractApiError } from "@/lib/api-errors";
import { useState } from "react";

export default function PaymentVoucherDetailPage() {
  const params = useParams();
  const pvId = params.id as string;
  const [actionError, setActionError] = useState<string | null>(null);
  const [showMarkPaid, setShowMarkPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CHEQUE");
  const [paymentDate, setPaymentDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [reference, setReference] = useState("");

  const { data, isLoading, isError, refetch } = usePaymentVoucher(pvId);
  const submitPv = useSubmitPaymentVoucher();
  const approvePv = useApprovePaymentVoucher();
  const markPaid = useMarkPaymentVoucherPaid();

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Payment voucher not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/finance/payment-vouchers">Back to Payment Vouchers</Link>
        </Button>
      </div>
    );
  }

  const pv = data as {
    id: string;
    serialNumber: string;
    status: string;
    payeeName: string;
    description: string;
    amount: number | string;
    currency: string;
    paymentDate: string;
    reference?: string | null;
    createdAt: string;
    grant?: { code: string; name: string } | null;
    paymentRequest?: {
      id: string;
      serialNumber: string;
      invoice?: { id: string; serialNumber: string } | null;
    } | null;
    createdBy?: {
      firstName?: string;
      lastName?: string;
      roles?: Array<{ role?: { name?: string } }>;
    } | null;
    approvalContext?: {
      canAct?: boolean;
      waitingForRoleName?: string | null;
      waitingForStepName?: string | null;
      dueAt?: string | null;
    } | null;
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
    payments?: Array<{ id: string; status: string; paymentMethod: string }>;
  };

  const status = pv.status.toUpperCase();
  const canApproveStep =
    status === "SUBMITTED" && Boolean(pv.approvalContext?.canAct);

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={pv.serialNumber}
          description={`Payment to ${pv.payeeName}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Payment Vouchers", href: "/finance/payment-vouchers" },
            { label: pv.serialNumber },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              {(status === "DRAFT" || status === "RETURNED") && (
                <PermissionGate permission="PAYMENTS:SUBMIT">
                  <Button
                    onClick={() =>
                      submitPv.mutate(pvId, {
                        onSuccess: () => refetch(),
                        onError: (err) =>
                          setActionError(extractApiError(err, "Failed to submit voucher")),
                      })
                    }
                    disabled={submitPv.isPending}
                  >
                    <Send className="h-4 w-4" />
                    {submitPv.isPending ? "Submitting…" : "Submit"}
                  </Button>
                </PermissionGate>
              )}
              {canApproveStep && (
                <PermissionGate permission="PAYMENTS:APPROVE">
                  <Button
                    onClick={() =>
                      approvePv.mutate(
                        { id: pvId },
                        {
                          onSuccess: () => refetch(),
                          onError: (err) =>
                            setActionError(
                              extractApiError(err, "Failed to approve voucher"),
                            ),
                        },
                      )
                    }
                    disabled={approvePv.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {approvePv.isPending ? "Approving…" : "Approve step"}
                  </Button>
                </PermissionGate>
              )}
              {status === "APPROVED" && (
                <PermissionGate permission="PAYMENTS:PAY">
                  <Button
                    variant={showMarkPaid ? "secondary" : "default"}
                    onClick={() => setShowMarkPaid((v) => !v)}
                  >
                    <Banknote className="h-4 w-4" />
                    Mark paid
                  </Button>
                </PermissionGate>
              )}
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print PV
              </Button>
              <Button variant="outline" asChild>
                <Link href="/finance/payment-vouchers">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          }
        />

        {actionError && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <StatusBadge status={pv.status.toLowerCase()} />
          <span className="text-2xl font-bold">
            {formatCurrency(Number(pv.amount), pv.currency)}
          </span>
        </div>

        {status === "SUBMITTED" && (
          <WaitingForLabel
            status={status}
            approvalContext={pv.approvalContext}
          />
        )}

        {showMarkPaid && status === "APPROVED" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Record payment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Payment method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="PETTY_CASH">Petty Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payDate">Payment date</Label>
                <Input
                  id="payDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payRef">Reference</Label>
                <Input
                  id="payRef"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="sm:col-span-3">
                <Button
                  onClick={() => {
                    setActionError(null);
                    markPaid.mutate(
                      {
                        id: pvId,
                        paymentDetails: {
                          paymentMethod,
                          paymentDate,
                          reference: reference || undefined,
                        },
                      },
                      {
                        onSuccess: () => {
                          setShowMarkPaid(false);
                          refetch();
                        },
                        onError: (err) =>
                          setActionError(
                            extractApiError(err, "Failed to mark voucher as paid"),
                          ),
                      },
                    );
                  }}
                  disabled={markPaid.isPending || !paymentDate}
                >
                  {markPaid.isPending ? "Recording…" : "Confirm paid"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Voucher Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Payee:</span> {pv.payeeName}
              </p>
              <p>
                <span className="text-muted-foreground">Description:</span> {pv.description}
              </p>
              <p>
                <span className="text-muted-foreground">Payment date:</span>{" "}
                {formatDate(pv.paymentDate)}
              </p>
              <p>
                <span className="text-muted-foreground">Grant:</span>{" "}
                {pv.grant ? `${pv.grant.code} — ${pv.grant.name}` : "—"}
              </p>
              {pv.paymentRequest && (
                <p>
                  <span className="text-muted-foreground">Payment request:</span>{" "}
                  <Link
                    href={`/finance/payment-requests/${pv.paymentRequest.id}`}
                    className="text-primary hover:underline"
                  >
                    {pv.paymentRequest.serialNumber}
                  </Link>
                </p>
              )}
              {pv.reference && (
                <p>
                  <span className="text-muted-foreground">Reference:</span> {pv.reference}
                </p>
              )}
            </CardContent>
          </Card>

          {pv.workflow?.steps && pv.workflow.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepTimeline
                  steps={pv.workflow.steps}
                  currentStepNumber={pv.workflow.currentStepNumber}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden print:block">
        <GenericDocPrintView
          title="Payment Voucher – PV"
          documentNumber={pv.serialNumber}
          description={pv.description}
          currency={pv.currency}
          totalAmount={pv.amount}
          requestedByUser={pv.createdBy}
          requestedAt={pv.createdAt}
          steps={pv.workflow?.steps}
          actions={pv.workflow?.actions}
          meta={[
            { label: "Payee", value: pv.payeeName },
            { label: "Status", value: pv.status },
            { label: "Payment Date", value: formatMetaDate(pv.paymentDate) },
            {
              label: "Grant",
              value: pv.grant ? `${pv.grant.code} — ${pv.grant.name}` : "—",
            },
            { label: "Reference", value: pv.reference ?? "—" },
          ]}
        />
      </div>
    </>
  );
}
