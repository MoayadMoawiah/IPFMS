"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  FilePlus,
  Printer,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { WaitingForLabel } from "@/components/workflow/waiting-for-label";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import {
  SupportingDocumentsReview,
  useSupportingDocumentsReview,
} from "@/components/workflow/supporting-documents-review";
import {
  useApprovePaymentRequest,
  usePaymentRequest,
  useSubmitPaymentRequest,
} from "@/hooks/use-finance";
import {
  deletePaymentRequestDocument,
  getPaymentRequestSupportingDocuments,
  uploadPaymentRequestDocuments,
  type SupportingDocument,
} from "@/lib/api/uploads";
import { getPaymentRequestCashReceipt } from "@/lib/api/finance";
import { extractApiError } from "@/lib/api-errors";
import { formatCurrency, formatDate } from "@/lib/formatters";

const SIGNED_CASH_RECEIPT_LABEL = "SIGNED_CASH_RECEIPT";

export default function PaymentRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError, refetch } = usePaymentRequest(requestId);
  const submitRequest = useSubmitPaymentRequest();
  const approveRequest = useApprovePaymentRequest();
  const [actionError, setActionError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const { data: supportingDocuments = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["payment-request-supporting-documents", requestId],
    queryFn: () => getPaymentRequestSupportingDocuments(requestId),
    enabled: !!requestId,
  });

  const { data: cashReceipt } = useQuery({
    queryKey: ["payment-request-cash-receipt", requestId],
    queryFn: () => getPaymentRequestCashReceipt(requestId),
    enabled: !!requestId && showReceipt,
  });

  const uploadDocs = useMutation({
    mutationFn: ({ files, labels }: { files: File[]; labels: string[] }) =>
      uploadPaymentRequestDocuments(requestId, files, labels),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["payment-request-supporting-documents", requestId],
      });
      refetch();
    },
  });

  const deleteDoc = useMutation({
    mutationFn: (attachmentId: string) =>
      deletePaymentRequestDocument(requestId, attachmentId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["payment-request-supporting-documents", requestId],
      });
      refetch();
    },
  });

  const requestPreview = data as
    | {
        status?: string;
        approvalContext?: { canAct?: boolean } | null;
      }
    | undefined;
  const canApproveStepPreview =
    String(requestPreview?.status ?? "").toUpperCase() === "SUBMITTED" &&
    Boolean(requestPreview?.approvalContext?.canAct);
  const {
    allReviewed,
    approveDisabledReason,
    markViewed,
    viewedAttachmentIds,
  } = useSupportingDocumentsReview(
    supportingDocuments,
    canApproveStepPreview,
  );

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Payment request not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/finance/payment-requests">Back to Payment Requests</Link>
        </Button>
      </div>
    );
  }

  const request = data as {
    id: string;
    serialNumber: string;
    status: string;
    totalAmount: number | string;
    currency: string;
    paymentMethod: string;
    methodDetails?: Record<string, unknown> | null;
    hasSignedCashReceipt?: boolean;
    requestDate: string;
    notes?: string | null;
    approvalContext?: {
      canAct?: boolean;
      waitingForRoleName?: string | null;
      waitingForStepName?: string | null;
      dueAt?: string | null;
    } | null;
    grant?: { code?: string; name?: string } | null;
    invoice?: {
      id: string;
      serialNumber: string;
      invoiceNumber: string;
      vendor?: { name?: string } | null;
    } | null;
    paymentVouchers?: Array<{
      id: string;
      serialNumber: string;
      status: string;
    }>;
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

  const status = request.status.toUpperCase();
  const canEditDocs = status === "DRAFT" || status === "RETURNED";
  const isCash = request.paymentMethod === "CASH";
  const hasSignedReceipt =
    Boolean(request.hasSignedCashReceipt) ||
    supportingDocuments.some(
      (d) =>
        d.source === "payment_request" &&
        d.fileName === SIGNED_CASH_RECEIPT_LABEL,
    );
  const canApproveStep = canApproveStepPreview;
  const approveBlockedByReview = canApproveStep && !allReviewed;
  const existingVoucher = (request.paymentVouchers ?? [])[0];
  const hasExistingVoucher = Boolean(existingVoucher);
  const details = (request.methodDetails || {}) as Record<string, string | null>;

  const handleOpenSupportingDoc = (doc: SupportingDocument) => {
    markViewed(doc.id);
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const buildCashReceiptHtml = (receipt: {
    title: string;
    organizationName: string;
    organizationShortName?: string | null;
    requestSerial: string;
    requestDate: string;
    vendorName?: string | null;
    paidToName?: string | null;
    invoiceSerial?: string | null;
    invoiceNumber?: string | null;
    grantCode?: string | null;
    grantName?: string | null;
    amount: number | string;
    currency: string;
    notes?: string | null;
    signatureLines?: {
      recipient?: string;
      cashier?: string;
      date?: string;
    };
  }) => `<!DOCTYPE html><html><head><title>Cash Receipt ${receipt.requestSerial}</title>
        <style>
          body { font-family: Georgia, serif; padding: 40px; color: #111; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          .muted { color: #555; font-size: 13px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 24px 0; font-size: 14px; }
          .box { border: 1px solid #ccc; padding: 16px; margin-top: 32px; min-height: 80px; }
          .label { font-size: 12px; color: #666; margin-bottom: 24px; }
          @media print { body { padding: 20px; } }
        </style></head><body>
        <h1>${receipt.title}</h1>
        <p class="muted">${receipt.organizationName}${receipt.organizationShortName ? ` (${receipt.organizationShortName})` : ""}</p>
        <div class="grid">
          <div><strong>Request #</strong><br/>${receipt.requestSerial}</div>
          <div><strong>Date</strong><br/>${formatDate(receipt.requestDate)}</div>
          <div><strong>Vendor / Supplier</strong><br/>${receipt.vendorName || "—"}</div>
          <div><strong>Paid to</strong><br/>${receipt.paidToName || "—"}</div>
          <div><strong>Invoice</strong><br/>${receipt.invoiceSerial || "—"} (${receipt.invoiceNumber || "—"})</div>
          <div><strong>Grant</strong><br/>${receipt.grantCode || "—"} ${receipt.grantName ? `— ${receipt.grantName}` : ""}</div>
          <div><strong>Amount</strong><br/>${formatCurrency(Number(receipt.amount), receipt.currency)}</div>
          <div><strong>Method</strong><br/>Cash</div>
        </div>
        ${receipt.notes ? `<p><strong>Notes:</strong> ${receipt.notes}</p>` : ""}
        <p class="muted">I acknowledge receipt of the above amount in cash.</p>
        <div class="box"><div class="label">${receipt.signatureLines?.recipient || "Recipient signature"}</div></div>
        <div class="box"><div class="label">${receipt.signatureLines?.cashier || "Cashier signature"}</div></div>
        <div class="box"><div class="label">${receipt.signatureLines?.date || "Date"}</div></div>
        <script>window.onload = function(){ window.print(); }</script>
        </body></html>`;

  const downloadCashReceiptHtml = (html: string, serial: string) => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cash-receipt-${serial}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openCashReceiptPrint = async () => {
    setActionError(null);
    // Open synchronously in the click stack (before await). Avoid noopener — it makes window.open return null.
    const w = window.open("about:blank", "_blank", "width=800,height=900");
    try {
      setShowReceipt(true);
      if (w) {
        w.document.write(
          "<p style='font-family:sans-serif;padding:24px'>Loading cash receipt…</p>",
        );
      }
      const receipt = cashReceipt || (await getPaymentRequestCashReceipt(requestId));
      const html = buildCashReceiptHtml(receipt);
      if (w && !w.closed) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        return;
      }
      downloadCashReceiptHtml(html, receipt.requestSerial);
    } catch (err) {
      if (w && !w.closed) w.close();
      setActionError(extractApiError(err, "Failed to load cash receipt"));
    }
  };

  const onUploadFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setActionError(null);
    const label = isCash ? SIGNED_CASH_RECEIPT_LABEL : "Other";
    uploadDocs.mutate(
      {
        files: Array.from(files),
        labels: Array.from(files).map(() => label),
      },
      {
        onError: (err) =>
          setActionError(extractApiError(err, "Failed to upload document")),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title={request.serialNumber}
        description={
          request.invoice
            ? `Payment request for ${request.invoice.serialNumber}`
            : "Payment request"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Requests", href: "/finance/payment-requests" },
          { label: request.serialNumber },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            {(status === "DRAFT" || status === "RETURNED") && (
              <PermissionGate permission="PAYMENTS:SUBMIT">
                <Button
                  onClick={() => {
                    setActionError(null);
                    if (isCash && !hasSignedReceipt) {
                      setActionError(
                        "Upload the signed cash receipt before submitting",
                      );
                      return;
                    }
                    submitRequest.mutate(requestId, {
                      onSuccess: () => refetch(),
                      onError: (err) =>
                        setActionError(
                          extractApiError(err, "Failed to submit payment request"),
                        ),
                    });
                  }}
                  disabled={
                    submitRequest.isPending || (isCash && !hasSignedReceipt)
                  }
                >
                  <Send className="h-4 w-4" />
                  {submitRequest.isPending ? "Submitting…" : "Submit"}
                </Button>
              </PermissionGate>
            )}
            {canApproveStep && (
              <PermissionGate permission="PAYMENTS:APPROVE">
                <Button
                  onClick={() =>
                    approveRequest.mutate(
                      { id: requestId },
                      {
                        onSuccess: () => refetch(),
                        onError: (err) =>
                          setActionError(
                            extractApiError(err, "Failed to approve payment request"),
                          ),
                      },
                    )
                  }
                  disabled={approveRequest.isPending || approveBlockedByReview}
                  title={approveDisabledReason}
                >
                  <CheckCircle className="h-4 w-4" />
                  {approveRequest.isPending ? "Approving…" : "Approve step"}
                </Button>
              </PermissionGate>
            )}
            {status === "APPROVED" && !hasExistingVoucher && (
              <PermissionGate permission="PAYMENTS:CREATE">
                <Button asChild>
                  <Link
                    href={`/finance/payment-vouchers/new?paymentRequestId=${requestId}`}
                  >
                    <FilePlus className="h-4 w-4" />
                    Create Payment Voucher
                  </Link>
                </Button>
              </PermissionGate>
            )}
            {existingVoucher && (
              <Button variant="secondary" asChild>
                <Link href={`/finance/payment-vouchers/${existingVoucher.id}`}>
                  Open Payment Voucher
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/finance/payment-requests">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={request.status.toLowerCase()} />
        <span className="text-lg font-semibold">
          {formatCurrency(Number(request.totalAmount), request.currency)}
        </span>
        <span className="text-sm text-muted-foreground">
          {request.paymentMethod.replace(/_/g, " ")}
        </span>
      </div>

      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {isCash && canEditDocs && !hasSignedReceipt && (
        <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Cash payment: download the receipt, get it signed by the supplier, then
          upload it before Submit.
        </div>
      )}

      {status === "SUBMITTED" && (
        <WaitingForLabel
          status={status}
          approvalContext={request.approvalContext}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Invoice:</span>{" "}
                {request.invoice ? (
                  <Link
                    href={`/procurement/vendor-invoices/${request.invoice.id}`}
                    className="text-primary hover:underline"
                  >
                    {request.invoice.serialNumber}
                  </Link>
                ) : (
                  "—"
                )}{" "}
                {request.invoice?.invoiceNumber
                  ? `(${request.invoice.invoiceNumber})`
                  : ""}
              </p>
              <p>
                <span className="text-muted-foreground">Vendor:</span>{" "}
                {request.invoice?.vendor?.name ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Grant:</span>{" "}
                {request.grant
                  ? `${request.grant.code} — ${request.grant.name}`
                  : "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Request date:</span>{" "}
                {formatDate(request.requestDate)}
              </p>
              <p>
                <span className="text-muted-foreground">Payment method:</span>{" "}
                {request.paymentMethod.replace(/_/g, " ")}
              </p>
              {request.notes && (
                <p>
                  <span className="text-muted-foreground">Notes:</span>{" "}
                  {request.notes}
                </p>
              )}
            </CardContent>
          </Card>

          {request.paymentMethod === "CHEQUE" && (
            <Card>
              <CardHeader>
                <CardTitle>Cheque details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Bank name:</span>{" "}
                  {details.bankName || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Bank branch:</span>{" "}
                  {details.bankBranch || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Cheque serial No:</span>{" "}
                  {details.chequeNumber || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Cheque date:</span>{" "}
                  {details.chequeDate ? formatDate(details.chequeDate) : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Payee:</span>{" "}
                  {details.payeeName || "—"}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-muted-foreground">Memo:</span>{" "}
                  {details.memo || "—"}
                </p>
              </CardContent>
            </Card>
          )}

          {request.paymentMethod === "BANK_TRANSFER" && (
            <Card>
              <CardHeader>
                <CardTitle>Bank transfer details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Bank name:</span>{" "}
                  {details.bankName || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Bank branch:</span>{" "}
                  {details.bankBranch || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Account No:</span>{" "}
                  {details.accountNumber || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Account name:</span>{" "}
                  {details.accountName || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">IBAN:</span>{" "}
                  {details.iban || "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">SWIFT:</span>{" "}
                  {details.swiftCode || "—"}
                </p>
              </CardContent>
            </Card>
          )}

          {isCash && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Cash receipt</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCashReceiptPrint}
                  >
                    <Download className="h-4 w-4" />
                    Download / Print
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCashReceiptPrint}
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Print or save as PDF, obtain the supplier signature, then upload
                  the signed file below.
                </p>
                {hasSignedReceipt ? (
                  <p className="text-emerald-700 dark:text-emerald-400">
                    Signed cash receipt attached.
                  </p>
                ) : (
                  <p className="text-amber-800 dark:text-amber-200">
                    Signed receipt not uploaded yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {approveBlockedByReview && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              Open all supporting documents before approving.
            </div>
          )}

          <SupportingDocumentsReview
            documents={supportingDocuments}
            isLoading={loadingDocs}
            requireReview={canApproveStep}
            viewedAttachmentIds={viewedAttachmentIds}
            onOpen={handleOpenSupportingDoc}
            emptyMessage="No supporting documents in the PR → payment chain."
            headerActions={
              canEditDocs ? (
                <PermissionGate permission="PAYMENTS:UPDATE">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        onUploadFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={uploadDocs.isPending}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {isCash ? "Upload signed receipt" : "Upload"}
                    </Button>
                  </div>
                </PermissionGate>
              ) : undefined
            }
            renderRowActions={(doc) =>
              canEditDocs && doc.source === "payment_request" ? (
                <PermissionGate permission="PAYMENTS:UPDATE">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                    disabled={deleteDoc.isPending}
                    onClick={() =>
                      deleteDoc.mutate(doc.id, {
                        onError: (err) =>
                          setActionError(
                            extractApiError(err, "Failed to delete document"),
                          ),
                      })
                    }
                    aria-label={`Delete ${doc.originalName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </PermissionGate>
              ) : null
            }
          />

          {(request.paymentVouchers?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment vouchers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {request.paymentVouchers!.map((v) => (
                    <li key={v.id}>
                      <Link
                        href={`/finance/payment-vouchers/${v.id}`}
                        className="text-primary hover:underline"
                      >
                        {v.serialNumber}
                      </Link>{" "}
                      <StatusBadge status={v.status.toLowerCase()} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {request.workflow?.steps && request.workflow.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Approval Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowStepTimeline
                steps={request.workflow.steps}
                currentStepNumber={request.workflow.currentStepNumber}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
