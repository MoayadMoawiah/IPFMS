"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useGrants } from "@/hooks/use-grants";
import { getPaginatedItems } from "@/lib/api/pagination";
import {
  useCreatePaymentVoucher,
  usePaymentRequest,
} from "@/hooks/use-finance";
import { extractApiError } from "@/lib/api-errors";
import type { Grant } from "@/lib/api/grants";

const PAYEE_TYPES = [
  { value: "VENDOR", label: "Vendor" },
  { value: "EMPLOYEE", label: "Employee" },
  { value: "PETTY_CASH", label: "Petty Cash" },
  { value: "OTHER", label: "Other" },
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "SDG", "SAR", "AED", "EGP"];

const schema = z.object({
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

function NewPaymentVoucherForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentRequestId = searchParams.get("paymentRequestId") ?? "";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: grantsData, isLoading: loadingGrants } = useGrants({ limit: 100 });
  const grants: Grant[] = getPaginatedItems(grantsData);
  const { data: prData, isLoading: loadingPr } = usePaymentRequest(paymentRequestId);
  const createVoucher = useCreatePaymentVoucher();

  const pr = prData as
    | {
        id: string;
        serialNumber: string;
        status: string;
        totalAmount: number | string;
        currency: string;
        grantId: string;
        grant?: { code?: string; name?: string } | null;
        invoice?: {
          invoiceNumber?: string;
          serialNumber?: string;
          vendor?: { id?: string; name?: string } | null;
        } | null;
        paymentVouchers?: Array<{ status: string }>;
      }
    | undefined;

  const fromPr = Boolean(paymentRequestId);
  const prApproved = pr?.status?.toUpperCase() === "APPROVED";
  const hasOpenVoucher = (pr?.paymentVouchers ?? []).some(
    (v) => v.status.toUpperCase() !== "PAID",
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
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

  useEffect(() => {
    if (!pr || !prApproved) return;
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
  }, [pr, prApproved, setValue]);

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createVoucher.mutate(
      {
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
        paymentRequestId: paymentRequestId || undefined,
      },
      {
        onSuccess: (voucher) => router.push(`/finance/payment-vouchers/${voucher.id}`),
        onError: (err) =>
          setSubmitError(extractApiError(err, "Failed to create payment voucher")),
      },
    );
  };

  if (fromPr && loadingPr) {
    return <LoadingSkeleton variant="cards" />;
  }

  if (fromPr && (!pr || !prApproved || hasOpenVoucher)) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <p className="text-sm">
          {!pr
            ? "Payment request not found."
            : !prApproved
              ? "Only an APPROVED payment request can create a voucher."
              : "An open payment voucher already exists for this request."}
        </p>
        <Button variant="outline" asChild>
          <Link
            href={
              paymentRequestId
                ? `/finance/payment-requests/${paymentRequestId}`
                : "/finance/payment-requests"
            }
          >
            Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New Payment Voucher"
        description={
          fromPr
            ? `Create voucher from payment request ${pr?.serialNumber}`
            : "Create a payment voucher for disbursement"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Vouchers", href: "/finance/payment-vouchers" },
          { label: "New Voucher" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                fromPr
                  ? `/finance/payment-requests/${paymentRequestId}`
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

        {fromPr && pr && (
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
            Linked payment request:{" "}
            <Link
              href={`/finance/payment-requests/${pr.id}`}
              className="text-primary hover:underline"
            >
              {pr.serialNumber}
            </Link>
            {pr.invoice?.vendor?.name ? ` — ${pr.invoice.vendor.name}` : ""}
          </div>
        )}

        <FormSection title="Payment Details">
          <FormField label="Grant" htmlFor="grantId" required error={errors.grantId?.message}>
            <Select
              value={watch("grantId")}
              onValueChange={(v) => setValue("grantId", v, { shouldValidate: true })}
              disabled={fromPr}
            >
              <SelectTrigger id="grantId" disabled={loadingGrants || fromPr}>
                <SelectValue placeholder={loadingGrants ? "Loading grants…" : "Select grant"} />
              </SelectTrigger>
              <SelectContent>
                {grants.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.code} — {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Payee Type" htmlFor="payeeType">
            <Select
              value={watch("payeeType")}
              onValueChange={(v) => setValue("payeeType", v)}
              disabled={fromPr}
            >
              <SelectTrigger id="payeeType" disabled={fromPr}>
                <SelectValue placeholder="Select payee type" />
              </SelectTrigger>
              <SelectContent>
                {PAYEE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Payee Name"
            htmlFor="payeeName"
            required
            error={errors.payeeName?.message}
            className="sm:col-span-2"
          >
            <Input
              id="payeeName"
              placeholder="Vendor or recipient name"
              disabled={fromPr}
              {...register("payeeName")}
            />
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
          <FormField label="Currency" htmlFor="currency" required error={errors.currency?.message}>
            <Select
              value={watch("currency")}
              onValueChange={(v) => setValue("currency", v, { shouldValidate: true })}
              disabled={fromPr}
            >
              <SelectTrigger id="currency" disabled={fromPr}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Amount" htmlFor="amount" required error={errors.amount?.message}>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
            />
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

        <FormActions
          submitLabel="Create Voucher"
          submittingLabel="Creating…"
          cancelHref={
            fromPr
              ? `/finance/payment-requests/${paymentRequestId}`
              : "/finance/payment-vouchers"
          }
          isSubmitting={createVoucher.isPending}
        />
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
