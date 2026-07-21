"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import {
  FormActions,
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import {
  SupportingDocumentsField,
  markAllStagedFiles,
  type StagedFile,
} from "@/components/forms/supporting-documents-field";
import {
  SupportingDocumentsReview,
  useSupportingDocumentsReview,
} from "@/components/workflow/supporting-documents-review";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { getPaginatedItems } from "@/lib/api/pagination";
import {
  useCreatePaymentVoucher,
  usePaymentRequest,
  usePaymentRequests,
} from "@/hooks/use-finance";
import {
  getPaymentRequestSupportingDocuments,
  uploadPaymentVoucherDocuments,
  type SupportingDocument,
} from "@/lib/api/uploads";
import { extractApiError } from "@/lib/api-errors";
import { formatCurrency } from "@/lib/formatters";

const VOUCHER_DOCUMENT_LABELS = [
  "Payment support",
  "Bank advice",
  "Signed voucher",
  "Other",
] as const;

const schema = z.object({
  paymentRequestId: z.string().min(1, "Payment request is required"),
  grantId: z.string().min(1, "Grant is required"),
  payeeName: z.string().min(1, "Payee name is required"),
  payeeType: z.string().optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  description: z.string().min(1, "Description is required"),
  currency: z.string().min(1, "Currency is required"),
  exchangeRate: z.string().optional(),
  reference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="truncate text-sm font-medium">{value || "—"}</div>
    </div>
  );
}

type PrListItem = {
  id: string;
  serialNumber: string;
  status: string;
  totalAmount: number | string;
  currency: string;
  grant?: { code?: string; name?: string } | null;
  invoice?: {
    serialNumber?: string;
    invoiceNumber?: string;
    vendor?: { name?: string } | null;
  } | null;
};

function NewPaymentVoucherForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrId = searchParams.get("paymentRequestId") ?? "";
  const [selectedPrId, setSelectedPrId] = useState(initialPrId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: availablePrData, isLoading: loadingPrList } = usePaymentRequests({
    availableForVoucher: true,
    limit: 100,
  });
  const availablePrs = getPaginatedItems(availablePrData) as PrListItem[];

  const { data: prData, isLoading: loadingPr } = usePaymentRequest(selectedPrId);
  const createVoucher = useCreatePaymentVoucher();

  const { data: supportingDocuments = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["payment-request-supporting-documents", selectedPrId],
    queryFn: () => getPaymentRequestSupportingDocuments(selectedPrId),
    enabled: Boolean(selectedPrId),
  });

  const { markViewed, viewedAttachmentIds } = useSupportingDocumentsReview(
    supportingDocuments,
    false,
  );

  const pr = prData as
    | {
        id: string;
        serialNumber: string;
        status: string;
        totalAmount: number | string;
        currency: string;
        grantId: string;
        paymentMethod?: string;
        methodDetails?: Record<string, string | null> | null;
        grant?: { id?: string; code?: string; name?: string } | null;
        invoice?: {
          id?: string;
          invoiceNumber?: string;
          serialNumber?: string;
          vendor?: { id?: string; name?: string } | null;
          po?: { id?: string; serialNumber?: string } | null;
          grn?: { id?: string; serialNumber?: string } | null;
        } | null;
        paymentVouchers?: Array<{ id?: string; serialNumber?: string; status: string }>;
      }
    | undefined;

  const prApproved = pr?.status?.toUpperCase() === "APPROVED";
  const existingVoucher = (pr?.paymentVouchers ?? [])[0];
  const hasExistingVoucher = Boolean(existingVoucher);
  const prSelectable = Boolean(pr && prApproved && !hasExistingVoucher);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentRequestId: initialPrId,
      grantId: "",
      payeeName: "",
      payeeType: "VENDOR",
      paymentDate: new Date().toISOString().split("T")[0],
      amount: "",
      description: "",
      currency: "USD",
      exchangeRate: "1",
      reference: "",
    },
  });

  const currency = watch("currency");

  const prOptions = useMemo(() => {
    const map = new Map<string, PrListItem>();
    for (const item of availablePrs) {
      map.set(item.id, item);
    }
    if (pr?.id && !map.has(pr.id)) {
      map.set(pr.id, {
        id: pr.id,
        serialNumber: pr.serialNumber,
        status: pr.status,
        totalAmount: pr.totalAmount,
        currency: pr.currency,
        grant: pr.grant,
        invoice: pr.invoice,
      });
    }
    return Array.from(map.values());
  }, [availablePrs, pr]);

  const grantLabel = pr?.grant?.code || pr?.grant?.name
    ? [pr.grant.code, pr.grant.name].filter(Boolean).join(" — ")
    : "—";

  useEffect(() => {
    setValue("paymentRequestId", selectedPrId, { shouldValidate: true });
    if (!pr || !prApproved || hasExistingVoucher) return;
    setValue("grantId", pr.grantId, { shouldValidate: true });
    setValue("payeeType", "VENDOR");
    setValue("payeeName", pr.invoice?.vendor?.name || "", { shouldValidate: true });
    setValue("amount", String(pr.totalAmount), { shouldValidate: true });
    setValue("currency", pr.currency || "USD", { shouldValidate: true });
    setValue(
      "description",
      `Payment for invoice ${pr.invoice?.invoiceNumber || pr.invoice?.serialNumber || ""}`,
      { shouldValidate: true },
    );
    setValue("reference", pr.serialNumber);
  }, [selectedPrId, pr, prApproved, hasExistingVoucher, setValue]);

  const handleSelectPr = (id: string) => {
    setSelectedPrId(id);
    setSubmitError(null);
  };

  const handleOpenSupportingDoc = (doc: SupportingDocument) => {
    markViewed(doc.id);
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const voucher = await createVoucher.mutateAsync({
        paymentRequestId: values.paymentRequestId,
        grantId: values.grantId,
        payeeName: values.payeeName,
        payeeType: values.payeeType || "VENDOR",
        payeeId: pr?.invoice?.vendor?.id,
        paymentDate: values.paymentDate,
        amount: Number(values.amount),
        description: values.description,
        currency: values.currency,
        exchangeRate: Number(values.exchangeRate || 1),
        reference: values.reference || undefined,
      });

      if (stagedFiles.length > 0) {
        const files = stagedFiles.map((s) => s.file);
        const labels = stagedFiles.map((s) => s.label);
        markAllStagedFiles(setStagedFiles, "uploading");
        try {
          await uploadPaymentVoucherDocuments(voucher.id, files, labels);
          markAllStagedFiles(setStagedFiles, "success");
        } catch (uploadErr) {
          markAllStagedFiles(
            setStagedFiles,
            "error",
            extractApiError(uploadErr, "Document upload failed"),
          );
          setSubmitError(
            extractApiError(
              uploadErr,
              "Voucher created but document upload failed. You can upload on the voucher page.",
            ),
          );
          router.push(`/finance/payment-vouchers/${voucher.id}`);
          return;
        }
      }

      router.push(`/finance/payment-vouchers/${voucher.id}`);
    } catch (err) {
      setSubmitError(extractApiError(err, "Failed to create payment voucher"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const methodDetails = (pr?.methodDetails || {}) as Record<string, string | null>;
  const paymentMethodLabel = (pr?.paymentMethod || "").replace(/_/g, " ") || "—";

  return (
    <div>
      <PageHeader
        title="New Payment Voucher"
        description="Create a payment voucher from an approved payment request"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Vouchers", href: "/finance/payment-vouchers" },
          { label: "New Voucher" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                selectedPrId
                  ? `/finance/payment-requests/${selectedPrId}`
                  : "/finance/payment-vouchers"
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Payment request" contentClassName="grid-cols-1">
          <FormField
            label="Payment Request"
            htmlFor="paymentRequestId"
            required
            error={errors.paymentRequestId?.message}
          >
            <Select
              value={selectedPrId || undefined}
              onValueChange={handleSelectPr}
              disabled={loadingPrList}
            >
              <SelectTrigger id="paymentRequestId">
                <SelectValue
                  placeholder={
                    loadingPrList
                      ? "Loading payment requests…"
                      : "Select an approved payment request"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {prOptions.length === 0 ? (
                  <SelectItem value="__none" disabled>
                    No approved payment requests available
                  </SelectItem>
                ) : (
                  prOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.serialNumber}
                      {item.invoice?.vendor?.name
                        ? ` — ${item.invoice.vendor.name}`
                        : ""}
                      {item.grant?.code ? ` (${item.grant.code})` : ""}
                      {" · "}
                      {formatCurrency(Number(item.totalAmount), item.currency)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              Every voucher must reference an approved payment request that does not
              already have a voucher.{" "}
              <Link
                href="/finance/payment-requests"
                className="text-primary hover:underline"
              >
                Browse payment requests
              </Link>
            </p>
          </FormField>
        </FormSection>

        {selectedPrId && loadingPr && <LoadingSkeleton variant="cards" />}

        {selectedPrId && !loadingPr && (!pr || !prApproved || hasExistingVoucher) && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {!pr
              ? "Payment request not found."
              : !prApproved
                ? "Only an APPROVED payment request can create a voucher."
                : `A payment voucher already exists for this request${
                    existingVoucher?.serialNumber
                      ? ` (${existingVoucher.serialNumber})`
                      : ""
                  }. Only one voucher is allowed per payment request.`}
            <div className="mt-2 flex flex-wrap gap-2">
              {existingVoucher?.id && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/finance/payment-vouchers/${existingVoucher.id}`}>
                    Open existing voucher
                  </Link>
                </Button>
              )}
              {selectedPrId && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/finance/payment-requests/${selectedPrId}`}>
                    Open payment request
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {prSelectable && pr && (
          <>
            <FormSection title="From payment request" contentClassName="grid-cols-1">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-md border bg-muted/30 p-4">
                <InfoRow
                  label="Payment request"
                  value={
                    <Link
                      href={`/finance/payment-requests/${pr.id}`}
                      className="text-primary hover:underline"
                    >
                      {pr.serialNumber}
                    </Link>
                  }
                />
                <InfoRow label="Grant" value={grantLabel} />
                <InfoRow
                  label="Amount"
                  value={formatCurrency(Number(pr.totalAmount), pr.currency)}
                />
                <InfoRow
                  label="Invoice"
                  value={
                    pr.invoice ? (
                      pr.invoice.id ? (
                        <Link
                          href={`/procurement/vendor-invoices/${pr.invoice.id}`}
                          className="text-primary hover:underline"
                        >
                          {pr.invoice.serialNumber}
                          {pr.invoice.invoiceNumber
                            ? ` (${pr.invoice.invoiceNumber})`
                            : ""}
                        </Link>
                      ) : (
                        `${pr.invoice.serialNumber || "—"}${
                          pr.invoice.invoiceNumber
                            ? ` (${pr.invoice.invoiceNumber})`
                            : ""
                        }`
                      )
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow label="Vendor / payee" value={pr.invoice?.vendor?.name} />
                <InfoRow label="Payment method" value={paymentMethodLabel} />
                <InfoRow
                  label="Purchase order"
                  value={
                    pr.invoice?.po ? (
                      <Link
                        href={`/procurement/purchase-orders/${pr.invoice.po.id}`}
                        className="text-primary hover:underline"
                      >
                        {pr.invoice.po.serialNumber}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  label="Goods receipt"
                  value={
                    pr.invoice?.grn ? (
                      <Link
                        href={`/procurement/goods-receipt/${pr.invoice.grn.id}`}
                        className="text-primary hover:underline"
                      >
                        {pr.invoice.grn.serialNumber}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                {pr.paymentMethod === "CHEQUE" && (
                  <>
                    <InfoRow label="Bank name" value={methodDetails.bankName} />
                    <InfoRow label="Cheque No" value={methodDetails.chequeNumber} />
                    <InfoRow label="Cheque payee" value={methodDetails.payeeName} />
                  </>
                )}
                {pr.paymentMethod === "BANK_TRANSFER" && (
                  <>
                    <InfoRow label="Bank name" value={methodDetails.bankName} />
                    <InfoRow label="Account No" value={methodDetails.accountNumber} />
                    <InfoRow label="IBAN" value={methodDetails.iban} />
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Grant, payee, and currency are taken from the payment request. Enter
                payment date and confirm the voucher details below.
              </p>
            </FormSection>

            <FormSection title="Payment Details">
              <FormField label="Grant" htmlFor="grantDisplay" required>
                <Input id="grantDisplay" value={grantLabel} readOnly disabled />
                <input type="hidden" {...register("grantId")} />
              </FormField>
              <FormField label="Payee Type" htmlFor="payeeTypeDisplay">
                <Input id="payeeTypeDisplay" value="Vendor" readOnly disabled />
                <input type="hidden" {...register("payeeType")} />
              </FormField>
              <FormField
                label="Payee Name"
                htmlFor="payeeName"
                required
                error={errors.payeeName?.message}
                className="sm:col-span-2"
              >
                <Input id="payeeName" readOnly disabled {...register("payeeName")} />
              </FormField>
              <FormField
                label="Payment Date"
                htmlFor="paymentDate"
                required
                error={errors.paymentDate?.message}
              >
                <Input id="paymentDate" type="date" {...register("paymentDate")} />
              </FormField>
              <FormField label="Reference" htmlFor="reference">
                <Input
                  id="reference"
                  placeholder="Invoice or reference number"
                  {...register("reference")}
                />
              </FormField>
            </FormSection>

            <FormSection title="Amount">
              <FormField label="Currency" htmlFor="currencyDisplay" required>
                <Input id="currencyDisplay" value={currency} readOnly disabled />
                <input type="hidden" {...register("currency")} />
              </FormField>
              <FormField
                label="Amount"
                htmlFor="amount"
                required
                error={errors.amount?.message}
              >
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  max={Number(pr.totalAmount)}
                  placeholder="0.00"
                  {...register("amount")}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Max {formatCurrency(Number(pr.totalAmount), pr.currency)} from
                  payment request
                </p>
              </FormField>
              <FormField label="Exchange Rate" htmlFor="exchangeRate">
                <Input
                  id="exchangeRate"
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="1.0000"
                  {...register("exchangeRate")}
                />
              </FormField>
            </FormSection>

            <FormSection title="Description" contentClassName="grid-cols-1">
              <FormField
                label="Description"
                htmlFor="description"
                required
                error={errors.description?.message}
              >
                <Textarea
                  id="description"
                  placeholder="Purpose of payment…"
                  rows={3}
                  {...register("description")}
                />
              </FormField>
            </FormSection>

            <SupportingDocumentsReview
              title="Chain supporting documents"
              documents={supportingDocuments}
              isLoading={loadingDocs}
              requireReview={false}
              viewedAttachmentIds={viewedAttachmentIds}
              onOpen={handleOpenSupportingDoc}
              emptyMessage="No supporting documents in the PR → payment chain yet."
            />

            <SupportingDocumentsField
              documentLabels={VOUCHER_DOCUMENT_LABELS}
              stagedFiles={stagedFiles}
              onStagedFilesChange={setStagedFiles}
              onValidationError={setSubmitError}
              defaultLabel="Other"
              disabled={isSubmitting}
            />

            <FormActions
              submitLabel="Create Voucher"
              submittingLabel="Creating…"
              cancelHref={`/finance/payment-requests/${selectedPrId}`}
              isSubmitting={isSubmitting || createVoucher.isPending}
            />
          </>
        )}

        {!selectedPrId && (
          <FormActions
            submitLabel="Create Voucher"
            submittingLabel="Creating…"
            cancelHref="/finance/payment-vouchers"
            isSubmitting={false}
            submitDisabled
          />
        )}
      </form>
    </div>
  );
}

export default function NewPaymentVoucherPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewPaymentVoucherForm />
    </Suspense>
  );
}
