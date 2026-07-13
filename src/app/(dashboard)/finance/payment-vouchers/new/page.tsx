"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useGrants } from "@/hooks/use-grants";
import { getPaginatedItems } from "@/lib/api/pagination";
import { useCreatePaymentVoucher } from "@/hooks/use-finance";
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

export default function NewPaymentVoucherPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: grantsData, isLoading: loadingGrants } = useGrants({ limit: 100 });
  const grants: Grant[] = getPaginatedItems(grantsData);

  const createVoucher = useCreatePaymentVoucher();

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

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createVoucher.mutate(
      {
        grantId: values.grantId,
        payeeName: values.payeeName,
        payeeType: values.payeeType || "VENDOR",
        paymentDate: values.paymentDate,
        amount: Number(values.amount),
        description: values.description,
        currency: values.currency,
        exchangeRate: Number(values.exchangeRate || 1),
        reference: values.reference || undefined,
      },
      {
        onSuccess: (voucher) => router.push(`/finance/payment-vouchers/${voucher.id}`),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create payment voucher")),
      }
    );
  };

  return (
    <div>
      <PageHeader
        title="New Payment Voucher"
        description="Create a payment voucher for disbursement"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Vouchers", href: "/finance/payment-vouchers" },
          { label: "New Voucher" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/finance/payment-vouchers">
              <ArrowLeft className="h-4 w-4" />
              Back to Vouchers
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Payment Details">
          <FormField label="Grant" htmlFor="grantId" required error={errors.grantId?.message}>
            <Select
              value={watch("grantId")}
              onValueChange={(v) => setValue("grantId", v, { shouldValidate: true })}
            >
              <SelectTrigger id="grantId" disabled={loadingGrants}>
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
            >
              <SelectTrigger id="payeeType">
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
            <Input id="payeeName" placeholder="Vendor or recipient name" {...register("payeeName")} />
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
            <Input id="reference" placeholder="Invoice or reference number" {...register("reference")} />
          </FormField>
        </FormSection>

        <FormSection title="Amount">
          <FormField label="Currency" htmlFor="currency" required error={errors.currency?.message}>
            <Select
              value={watch("currency")}
              onValueChange={(v) => setValue("currency", v, { shouldValidate: true })}
            >
              <SelectTrigger id="currency">
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
          cancelHref="/finance/payment-vouchers"
          isSubmitting={createVoucher.isPending}
        />
      </form>
    </div>
  );
}
