"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle, FilePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import {
  useApproveVendorInvoice,
  useSubmitVendorInvoice,
  useVendorInvoice,
} from "@/hooks/use-procurement";
import { extractApiError } from "@/lib/api-errors";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function VendorInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { data, isLoading, isError, refetch } = useVendorInvoice(invoiceId);
  const submitInvoice = useSubmitVendorInvoice();
  const approveInvoice = useApproveVendorInvoice();
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Vendor invoice not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/procurement/vendor-invoices">Back to Vendor Invoices</Link>
        </Button>
      </div>
    );
  }

  const invoice = data as {
    id: string;
    serialNumber: string;
    invoiceNumber: string;
    status: string;
    invoiceDate: string;
    dueDate?: string | null;
    currency: string;
    subtotal: number | string;
    taxAmount: number | string;
    totalAmount: number | string;
    isThreeWayMatched?: boolean;
    paidAmount?: number | string;
    notes?: string | null;
    po?: {
      id: string;
      serialNumber: string;
      title?: string;
      goodsReceipts?: Array<{ id: string; serialNumber: string; status: string }>;
    };
    grn?: { id: string; serialNumber: string; status?: string } | null;
    vendor?: { name: string };
    grant?: { code: string; name: string };
    approvalContext?: {
      canAct?: boolean;
      waitingForRoleName?: string | null;
      waitingForStepName?: string | null;
      dueAt?: string | null;
      allowReject?: boolean;
      allowReturn?: boolean;
    } | null;
    workflow?: {
      currentStepNumber?: number;
      steps?: Array<{
        stepNumber: number;
        stepName: string;
        status: string;
        action?: string | null;
        completedAt?: string | null;
      }>;
    } | null;
  };

  const status = invoice.status.toUpperCase();
  const canApproveStep =
    (status === "MATCHED" || status === "RECEIVED") &&
    Boolean(invoice.workflow?.steps?.length) &&
    Boolean(invoice.approvalContext?.canAct);

  return (
    <div>
      <PageHeader
        title={invoice.serialNumber}
        description={`Vendor invoice ${invoice.invoiceNumber}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vendor Invoices", href: "/procurement/vendor-invoices" },
          { label: invoice.serialNumber },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            {status === "RECEIVED" && (
              <PermissionGate permission="INVOICES:SUBMIT">
                <Button
                  onClick={() =>
                    submitInvoice.mutate(invoiceId, {
                      onSuccess: () => refetch(),
                      onError: (err) =>
                        setActionError(
                          extractApiError(err, "Failed to submit invoice"),
                        ),
                    })
                  }
                  disabled={submitInvoice.isPending}
                >
                  <Send className="h-4 w-4" />
                  {submitInvoice.isPending ? "Submitting…" : "Submit for match"}
                </Button>
              </PermissionGate>
            )}
            {canApproveStep && (
              <PermissionGate permission="INVOICES:APPROVE">
                <Button
                  onClick={() =>
                    approveInvoice.mutate(
                      { id: invoiceId },
                      {
                        onSuccess: () => refetch(),
                        onError: (err) =>
                          setActionError(
                            extractApiError(err, "Failed to approve invoice"),
                          ),
                      },
                    )
                  }
                  disabled={approveInvoice.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  {approveInvoice.isPending ? "Approving…" : "Approve step"}
                </Button>
              </PermissionGate>
            )}
            {status === "APPROVED" && invoice.isThreeWayMatched && (
              <PermissionGate permission="PAYMENTS:CREATE">
                <Button asChild>
                  <Link
                    href={`/finance/payment-requests/new?invoiceId=${invoiceId}`}
                  >
                    <FilePlus className="h-4 w-4" />
                    Create Payment Request
                  </Link>
                </Button>
              </PermissionGate>
            )}
            <Button variant="outline" asChild>
              <Link href="/procurement/vendor-invoices">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={invoice.status.toLowerCase()} />
        {invoice.isThreeWayMatched && (
          <span className="text-sm text-emerald-700">3-way matched</span>
        )}
      </div>

      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {(status === "MATCHED" || status === "RECEIVED") &&
        invoice.workflow?.steps?.length && (
          <WaitingForLabel
            status={status}
            approvalContext={invoice.approvalContext}
          />
        )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">PO:</span>{" "}
              {invoice.po ? (
                <Link
                  href={`/procurement/purchase-orders/${invoice.po.id}`}
                  className="text-primary hover:underline"
                >
                  {invoice.po.serialNumber}
                </Link>
              ) : (
                "—"
              )}
            </p>
            <p>
              <span className="text-muted-foreground">GRN:</span>{" "}
              {invoice.grn ? (
                <Link
                  href={`/procurement/goods-receipt/${invoice.grn.id}`}
                  className="text-primary hover:underline"
                >
                  {invoice.grn.serialNumber}
                </Link>
              ) : (
                "—"
              )}
            </p>
            <p>
              <span className="text-muted-foreground">Vendor:</span>{" "}
              {invoice.vendor?.name ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Grant:</span>{" "}
              {invoice.grant
                ? `${invoice.grant.code} — ${invoice.grant.name}`
                : "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Invoice date:</span>{" "}
              {formatDate(invoice.invoiceDate)}
            </p>
            <p>
              <span className="text-muted-foreground">Due date:</span>{" "}
              {invoice.dueDate ? formatDate(invoice.dueDate) : "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Subtotal:</span>{" "}
              {formatCurrency(Number(invoice.subtotal), invoice.currency)}
            </p>
            <p>
              <span className="text-muted-foreground">Tax:</span>{" "}
              {formatCurrency(Number(invoice.taxAmount), invoice.currency)}
            </p>
            <p className="font-medium">
              Total:{" "}
              {formatCurrency(Number(invoice.totalAmount), invoice.currency)}
            </p>
            {invoice.notes && (
              <p>
                <span className="text-muted-foreground">Notes:</span>{" "}
                {invoice.notes}
              </p>
            )}
            {invoice.po?.goodsReceipts && invoice.po.goodsReceipts.length > 0 && (
              <div className="pt-2">
                <p className="mb-1 text-muted-foreground">Linked GRNs</p>
                <ul className="list-inside list-disc">
                  {invoice.po.goodsReceipts.map((grn) => (
                    <li key={grn.id}>
                      <Link
                        href={`/procurement/goods-receipt/${grn.id}`}
                        className="text-primary hover:underline"
                      >
                        {grn.serialNumber}
                      </Link>{" "}
                      ({grn.status})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {invoice.workflow?.steps && invoice.workflow.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Matching workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowStepTimeline
                steps={invoice.workflow.steps}
                currentStepNumber={invoice.workflow.currentStepNumber}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
