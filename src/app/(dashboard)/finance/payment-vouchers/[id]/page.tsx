"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle,
  Printer,
  Send,
  Trash2,
  Upload,
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
import {
  SupportingDocumentsReview,
  useSupportingDocumentsReview,
} from "@/components/workflow/supporting-documents-review";
import { GenericDocPrintView, formatMetaDate } from "@/components/documents/generic-doc-print-view";
import {
  usePaymentVoucher,
  useSubmitPaymentVoucher,
  useApprovePaymentVoucher,
  useMarkPaymentVoucherPaid,
  useBankAccounts,
} from "@/hooks/use-finance";
import {
  deletePaymentVoucherDocument,
  getPaymentVoucherSupportingDocuments,
  uploadPaymentVoucherDocuments,
  type SupportingDocument,
} from "@/lib/api/uploads";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractApiError } from "@/lib/api-errors";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <p>
      <span className="text-muted-foreground">{label}:</span> {value || "—"}
    </p>
  );
}

export default function PaymentVoucherDetailPage() {
  const params = useParams();
  const pvId = params.id as string;
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showMarkPaid, setShowMarkPaid] = useState(false);
  const [fallbackPaymentMethod, setFallbackPaymentMethod] = useState("CHEQUE");
  const [paymentDate, setPaymentDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [reference, setReference] = useState("");
  const [payFromBankAccountId, setPayFromBankAccountId] = useState("");

  const { data, isLoading, isError, refetch } = usePaymentVoucher(pvId);
  const submitPv = useSubmitPaymentVoucher();
  const approvePv = useApprovePaymentVoucher();
  const markPaid = useMarkPaymentVoucherPaid();
  const { data: bankAccountsData } = useBankAccounts({ limit: 100 });
  const bankAccounts = getPaginatedItems(bankAccountsData) as Array<{
    id: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    currency?: string;
  }>;

  const { data: supportingDocuments = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["payment-voucher-supporting-documents", pvId],
    queryFn: () => getPaymentVoucherSupportingDocuments(pvId),
    enabled: !!pvId,
  });

  const uploadDocs = useMutation({
    mutationFn: ({ files, labels }: { files: File[]; labels: string[] }) =>
      uploadPaymentVoucherDocuments(pvId, files, labels),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["payment-voucher-supporting-documents", pvId],
      });
    },
  });

  const deleteDoc = useMutation({
    mutationFn: (attachmentId: string) =>
      deletePaymentVoucherDocument(pvId, attachmentId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["payment-voucher-supporting-documents", pvId],
      });
    },
  });

  const pvPreview = data as
    | {
        status?: string;
        approvalContext?: { canAct?: boolean } | null;
      }
    | undefined;
  const canApproveStepPreview =
    String(pvPreview?.status ?? "").toUpperCase() === "SUBMITTED" &&
    Boolean(pvPreview?.approvalContext?.canAct);
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
      paymentMethod?: string | null;
      methodDetails?: Record<string, string | null> | null;
      bankAccountId?: string | null;
      bankAccount?: {
        id: string;
        accountName: string;
        bankName: string;
        accountNumber: string;
      } | null;
      invoice?: {
        id: string;
        serialNumber: string;
        invoiceNumber?: string | null;
        vendor?: { id?: string; name?: string } | null;
        po?: { id: string; serialNumber: string } | null;
        grn?: { id: string; serialNumber: string } | null;
      } | null;
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
    payments?: Array<{
      id: string;
      status: string;
      paymentMethod: string;
      paymentDate?: string;
      reference?: string | null;
      journalEntryId?: string | null;
      journalEntry?: {
        id: string;
        serialNumber: string;
        status: string;
        isPosted?: boolean;
      } | null;
    }>;
  };

  const status = pv.status.toUpperCase();
  const canEditDocs = status === "DRAFT" || status === "RETURNED";
  const canApproveStep = canApproveStepPreview;
  const approveBlockedByReview = canApproveStep && !allReviewed;
  const prMethod = (pv.paymentRequest?.paymentMethod || "").toUpperCase();
  const hasLinkedPrMethod = Boolean(prMethod);
  const paymentMethod = hasLinkedPrMethod ? prMethod : fallbackPaymentMethod;
  const methodDetails = (pv.paymentRequest?.methodDetails || {}) as Record<
    string,
    string | null
  >;
  const needsOrgBank =
    paymentMethod === "CHEQUE" || paymentMethod === "BANK_TRANSFER";
  const resolvedPayFromBankId =
    payFromBankAccountId ||
    pv.paymentRequest?.bankAccountId ||
    bankAccounts[0]?.id ||
    "";

  const handleOpenSupportingDoc = (doc: SupportingDocument) => {
    markViewed(doc.id);
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const onUploadFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setActionError(null);
    uploadDocs.mutate(
      {
        files: Array.from(files),
        labels: Array.from(files).map(() => "Other"),
      },
      {
        onError: (err) =>
          setActionError(extractApiError(err, "Failed to upload document")),
      },
    );
  };

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
                    disabled={approvePv.isPending || approveBlockedByReview}
                    title={approveDisabledReason}
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
            <CardContent className="space-y-4">
              {hasLinkedPrMethod ? (
                <div className="rounded-md border bg-muted/30 p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Payment method:</span>
                    <span className="font-medium">
                      {paymentMethod.replace(/_/g, " ")}
                    </span>
                    {pv.paymentRequest && (
                      <span className="text-xs text-muted-foreground">
                        (from{" "}
                        <Link
                          href={`/finance/payment-requests/${pv.paymentRequest.id}`}
                          className="text-primary hover:underline"
                        >
                          {pv.paymentRequest.serialNumber}
                        </Link>
                        )
                      </span>
                    )}
                  </div>

                  {paymentMethod === "CHEQUE" && (
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <DetailRow label="Bank name" value={methodDetails.bankName} />
                      <DetailRow
                        label="Bank branch"
                        value={methodDetails.bankBranch}
                      />
                      <DetailRow
                        label="Cheque No"
                        value={methodDetails.chequeNumber}
                      />
                      <DetailRow
                        label="Cheque date"
                        value={
                          methodDetails.chequeDate
                            ? formatDate(methodDetails.chequeDate)
                            : null
                        }
                      />
                      <DetailRow label="Payee" value={methodDetails.payeeName} />
                      <DetailRow label="Memo" value={methodDetails.memo} />
                    </div>
                  )}

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <DetailRow label="Bank name" value={methodDetails.bankName} />
                      <DetailRow
                        label="Bank branch"
                        value={methodDetails.bankBranch}
                      />
                      <DetailRow
                        label="Account No"
                        value={methodDetails.accountNumber}
                      />
                      <DetailRow
                        label="Account name"
                        value={methodDetails.accountName}
                      />
                      <DetailRow label="IBAN" value={methodDetails.iban} />
                      <DetailRow label="SWIFT" value={methodDetails.swiftCode} />
                    </div>
                  )}

                  {paymentMethod === "CASH" && (
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <DetailRow
                        label="Paid to"
                        value={methodDetails.paidToName || pv.payeeName}
                      />
                      <DetailRow
                        label="Received by"
                        value={methodDetails.receivedByName}
                      />
                      <DetailRow label="Notes" value={methodDetails.notes} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-w-xs">
                  <Label>Payment method</Label>
                  <Select
                    value={fallbackPaymentMethod}
                    onValueChange={setFallbackPaymentMethod}
                  >
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
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {needsOrgBank && (
                  <div className="space-y-2 sm:col-span-1">
                    <Label>Pay from bank account</Label>
                    <Select
                      value={resolvedPayFromBankId}
                      onValueChange={setPayFromBankAccountId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.bankName} — {acc.accountName} ({acc.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bankAccounts.length === 0 && (
                      <p className="text-xs text-destructive">
                        No active bank accounts found. Add one before confirming.
                      </p>
                    )}
                  </div>
                )}
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
              </div>

              <p className="text-xs text-muted-foreground">
                Confirming paid posts a journal entry (Debit AP / Credit Bank or Cash)
                to the GL and closes this voucher. Cheque / transfer details come from
                the approved payment request.
              </p>

              <div>
                <Button
                  onClick={() => {
                    setActionError(null);
                    if (needsOrgBank && !resolvedPayFromBankId) {
                      setActionError(
                        "Select the organisation bank account to pay from",
                      );
                      return;
                    }
                    markPaid.mutate(
                      {
                        id: pvId,
                        paymentDetails: {
                          paymentMethod,
                          paymentDate,
                          reference: reference || undefined,
                          ...(needsOrgBank
                            ? { bankAccountId: resolvedPayFromBankId }
                            : {}),
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
                  disabled={
                    markPaid.isPending ||
                    !paymentDate ||
                    (needsOrgBank && !resolvedPayFromBankId)
                  }
                >
                  {markPaid.isPending ? "Recording…" : "Confirm paid"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {approveBlockedByReview && (
          <div className="mb-6 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            Open all supporting documents before approving.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Voucher Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Payee:</span> {pv.payeeName}
                </p>
                <p>
                  <span className="text-muted-foreground">Description:</span>{" "}
                  {pv.description}
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
                    <span className="text-muted-foreground">Reference:</span>{" "}
                    {pv.reference}
                  </p>
                )}
                {pv.payments && pv.payments.length > 0 && (
                  <div className="space-y-2 border-t pt-3">
                    <p className="font-medium">Payment &amp; journal</p>
                    {pv.payments.map((payment) => (
                      <div key={payment.id} className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Method:</span>{" "}
                          {payment.paymentMethod.replace(/_/g, " ")}
                          {payment.paymentDate
                            ? ` · ${formatDate(payment.paymentDate)}`
                            : ""}
                        </p>
                        {payment.journalEntry ? (
                          <p>
                            <span className="text-muted-foreground">
                              Journal entry:
                            </span>{" "}
                            <Link
                              href="/finance/accounting"
                              className="text-primary hover:underline"
                            >
                              {payment.journalEntry.serialNumber}
                            </Link>
                            {payment.journalEntry.isPosted ||
                            payment.journalEntry.status === "POSTED"
                              ? " (posted)"
                              : ""}
                          </p>
                        ) : payment.journalEntryId ? (
                          <p>
                            <span className="text-muted-foreground">
                              Journal entry:
                            </span>{" "}
                            {payment.journalEntryId}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

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
                        multiple
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
                        Upload
                      </Button>
                    </div>
                  </PermissionGate>
                ) : undefined
              }
              renderRowActions={(doc) =>
                canEditDocs && doc.source === "payment_voucher" ? (
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
          </div>

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
          signOffTitles={{
            requestedBy: "Prepared by:",
            checkedBy: "Finance Manager Review:",
            approvedBy: "Country Director Authorize Payment:",
          }}
          meta={[
            { label: "Payee", value: pv.payeeName },
            {
              label: "Vendor",
              value: pv.paymentRequest?.invoice?.vendor?.name ?? pv.payeeName,
            },
            { label: "Status", value: pv.status },
            { label: "Payment Date", value: formatMetaDate(pv.paymentDate) },
            {
              label: "Grant",
              value: pv.grant
                ? `${pv.grant.code} — ${pv.grant.name}`
                : "—",
            },
            {
              label: "Payment request",
              value: pv.paymentRequest?.serialNumber ?? "—",
            },
            {
              label: "Invoice",
              value: pv.paymentRequest?.invoice
                ? `${pv.paymentRequest.invoice.serialNumber}${
                    pv.paymentRequest.invoice.invoiceNumber
                      ? ` (${pv.paymentRequest.invoice.invoiceNumber})`
                      : ""
                  }`
                : "—",
            },
            {
              label: "Purchase order",
              value: pv.paymentRequest?.invoice?.po?.serialNumber ?? "—",
            },
            {
              label: "Goods receipt",
              value: pv.paymentRequest?.invoice?.grn?.serialNumber ?? "—",
            },
            {
              label: "Payment method",
              value: (pv.paymentRequest?.paymentMethod || "").replace(/_/g, " ") || "—",
            },
            { label: "Reference", value: pv.reference ?? "—" },
          ]}
        />
      </div>
    </>
  );
}
