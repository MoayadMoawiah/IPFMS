"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import {
  FormActions,
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useGrants, useGrant } from "@/hooks/use-grants";
import { getPaginatedItems } from "@/lib/api/pagination";
import {
  useCreatePurchaseOrder,
  useVendors,
  useVendor,
  usePurchaseRequisition,
  useRfq,
} from "@/hooks/use-procurement";
import { extractApiError } from "@/lib/api-errors";
import type { Grant } from "@/lib/api/grants";

const CURRENCIES = ["USD", "EUR", "GBP", "SDG"];

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  unit: z.string().min(1, "Unit is required"),
  orderedQuantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  unitPrice: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a non-negative number"),
});

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  grantId: z.string().min(1, "Grant is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  currency: z.string().min(1, "Currency is required"),
  deliveryAddress: z.string().optional(),
  deliveryDate: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type FormValues = z.infer<typeof schema>;

const defaultItem = { description: "", unit: "Unit", orderedQuantity: "", unitPrice: "" };

type PrLike = {
  id?: string;
  title: string;
  currency?: string;
  grantId?: string;
  grant?: { id: string; code?: string; name?: string; currency?: string };
  serialNumber?: string;
  items?: Array<{
    description: string;
    unit: string;
    quantity: number | string;
    estimatedUnitPrice: number | string;
  }>;
};

type RfqLike = {
  id: string;
  serialNumber?: string;
  title?: string;
  prId?: string;
  grantId?: string;
  currency?: string;
  grant?: { id: string; code?: string; name?: string; currency?: string };
  pr?: PrLike | null;
  vendors?: Array<{
    vendorId: string;
    isWinner?: boolean;
    quotedAmount?: number | string | null;
    currency?: string | null;
    vendor?: { id: string; name: string };
  }>;
};

function mapPrItemsToPoItems(
  prItems: NonNullable<PrLike["items"]>,
  totalQuoted: number | null,
) {
  if (prItems.length === 0) return [{ ...defaultItem }];

  return prItems.map((item) => {
    let unitPrice = Number(item.estimatedUnitPrice);
    if (totalQuoted != null && totalQuoted > 0 && prItems.length === 1) {
      unitPrice = totalQuoted / Number(item.quantity);
    } else if (totalQuoted != null && totalQuoted > 0 && prItems.length > 1) {
      const prTotal = prItems.reduce(
        (s, i) => s + Number(i.quantity) * Number(i.estimatedUnitPrice),
        0,
      );
      if (prTotal > 0) {
        const ratio =
          (Number(item.quantity) * Number(item.estimatedUnitPrice)) / prTotal;
        unitPrice = (totalQuoted * ratio) / Number(item.quantity);
      }
    }
    return {
      description: item.description,
      unit: item.unit,
      orderedQuantity: String(item.quantity),
      unitPrice: unitPrice.toFixed(2),
    };
  });
}

function NewPurchaseOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prIdParam = searchParams.get("prId") ?? "";
  const rfqId = searchParams.get("rfqId") ?? "";
  const vendorIdParam = searchParams.get("vendorId") ?? "";
  const pafId = searchParams.get("pafId") ?? "";
  const fromSource = Boolean(prIdParam || rfqId);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  const { data: grantsData, isLoading: loadingGrants } = useGrants({ limit: 100 });
  const grantsFromList: Grant[] = getPaginatedItems(grantsData);

  const { data: vendorsData, isLoading: loadingVendors } = useVendors({ limit: 100 });
  const vendorsFromList: { id: string; name: string; registrationNumber?: string }[] =
    getPaginatedItems(vendorsData);

  const { data: prData, isLoading: loadingPr } = usePurchaseRequisition(prIdParam);
  const { data: rfqData, isLoading: loadingRfq } = useRfq(rfqId);

  const rfq = rfqData as RfqLike | undefined;
  const prFromApi = prData as PrLike | undefined;
  const pr = prFromApi ?? rfq?.pr ?? undefined;
  const resolvedPrId = prIdParam || pr?.id || rfq?.prId || "";

  const winner =
    rfq?.vendors?.find((v) => v.isWinner) ??
    (vendorIdParam
      ? rfq?.vendors?.find((v) => v.vendorId === vendorIdParam)
      : undefined);

  const resolvedGrantId =
    pr?.grantId ?? pr?.grant?.id ?? rfq?.grantId ?? rfq?.grant?.id ?? "";
  const resolvedVendorId = vendorIdParam || winner?.vendorId || "";

  const { data: grantDetail } = useGrant(resolvedGrantId);
  const { data: vendorDetail } = useVendor(resolvedVendorId);

  const grants = useMemo(() => {
    const list = [...grantsFromList];
    const ensureGrant = (g?: { id: string; code?: string; name?: string; currency?: string } | null) => {
      if (!g?.id || list.some((x) => x.id === g.id)) return;
      list.unshift({
        id: g.id,
        code: g.code ?? "—",
        name: g.name ?? "Grant",
        currency: g.currency ?? "USD",
      } as Grant);
    };
    ensureGrant(grantDetail as Grant | undefined);
    ensureGrant(pr?.grant);
    ensureGrant(rfq?.grant);
    return list;
  }, [grantsFromList, grantDetail, pr?.grant, rfq?.grant]);

  const vendors = useMemo(() => {
    const list = [...vendorsFromList];
    const ensureVendor = (v?: { id: string; name: string } | null) => {
      if (!v?.id || list.some((x) => x.id === v.id)) return;
      list.unshift(v);
    };
    if (vendorDetail && typeof vendorDetail === "object" && "id" in vendorDetail) {
      ensureVendor(vendorDetail as { id: string; name: string });
    }
    if (winner?.vendor) {
      ensureVendor({ id: winner.vendor.id, name: winner.vendor.name });
    } else if (winner?.vendorId) {
      ensureVendor({ id: winner.vendorId, name: "Awarded vendor" });
    }
    if (resolvedVendorId && !list.some((v) => v.id === resolvedVendorId)) {
      ensureVendor({ id: resolvedVendorId, name: "Selected vendor" });
    }
    return list;
  }, [vendorsFromList, vendorDetail, winner, resolvedVendorId]);

  const createPO = useCreatePurchaseOrder();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      grantId: "",
      vendorId: "",
      currency: "USD",
      deliveryAddress: "",
      deliveryDate: "",
      terms: "",
      notes: "",
      items: [{ ...defaultItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const grantIdValue = watch("grantId");
  const vendorIdValue = watch("vendorId");
  const selectedGrant = grants.find((g) => g.id === grantIdValue);

  const sourceReady =
    !fromSource ||
    ((!prIdParam || !loadingPr) &&
      (!rfqId || !loadingRfq) &&
      Boolean(pr || rfq));

  const listsReady = !loadingGrants && !loadingVendors;

  useEffect(() => {
    if (prefilled || !fromSource || !sourceReady || !listsReady) return;
    if (!pr && !rfq) return;

    const totalQuoted =
      winner?.quotedAmount != null ? Number(winner.quotedAmount) : null;
    const prItems = pr?.items ?? [];
    const mappedItems = mapPrItemsToPoItems(prItems, totalQuoted);

    const title =
      pr?.title ||
      rfq?.title ||
      (rfq?.serialNumber ? `PO for ${rfq.serialNumber}` : "Purchase Order");

    const grantId = resolvedGrantId;
    const vendorId = resolvedVendorId;
    const currency =
      winner?.currency ||
      pr?.currency ||
      rfq?.grant?.currency ||
      pr?.grant?.currency ||
      "USD";

    const noteParts: string[] = [];
    if (rfq?.serialNumber) noteParts.push(`Created from RFQ ${rfq.serialNumber}`);
    else if (rfqId) noteParts.push(`Created from RFQ ${rfqId}`);
    if (pr?.serialNumber) noteParts.push(`PR ${pr.serialNumber}`);
    else if (resolvedPrId) noteParts.push(`PR ${resolvedPrId}`);

    reset({
      title,
      grantId,
      vendorId,
      currency,
      deliveryAddress: "",
      deliveryDate: "",
      terms: "",
      notes: noteParts.join(" · "),
      items: mappedItems,
    });
    setPrefilled(true);
  }, [
    prefilled,
    fromSource,
    sourceReady,
    listsReady,
    pr,
    rfq,
    rfqId,
    resolvedPrId,
    resolvedGrantId,
    resolvedVendorId,
    winner,
    reset,
  ]);

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.orderedQuantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createPO.mutate(
      {
        title: values.title,
        grantId: values.grantId,
        vendorId: values.vendorId,
        currency: values.currency,
        subtotal,
        totalAmount: subtotal,
        deliveryAddress: values.deliveryAddress || undefined,
        deliveryDate: values.deliveryDate || undefined,
        terms: values.terms || undefined,
        notes: values.notes || undefined,
        ...(resolvedPrId && { prId: resolvedPrId }),
        ...(rfqId && { rfqId }),
        ...(pafId && { pafId }),
        items: values.items.map((item) => ({
          description: item.description,
          unit: item.unit,
          orderedQuantity: Number(item.orderedQuantity),
          unitPrice: Number(item.unitPrice),
        })),
      },
      {
        onSuccess: (po) => router.push(`/procurement/purchase-orders/${po.id}`),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create purchase order")),
      },
    );
  };

  if (fromSource && (!sourceReady || (sourceReady && !listsReady && !prefilled))) {
    return <LoadingSkeleton variant="cards" />;
  }

  const grantSelectReady = !loadingGrants && (!grantIdValue || grants.some((g) => g.id === grantIdValue));
  const vendorSelectReady =
    !loadingVendors && (!vendorIdValue || vendors.some((v) => v.id === vendorIdValue));

  return (
    <div>
      <PageHeader
        title="New Purchase Order"
        description={
          fromSource
            ? rfqId
              ? "Create PO from awarded RFQ"
              : "Create PO directly from purchase requisition"
            : "Create a purchase order for a vendor"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: "New PO" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                resolvedPrId
                  ? `/procurement/requisitions/${resolvedPrId}`
                  : rfqId
                    ? `/procurement/rfq/${rfqId}`
                    : "/procurement/purchase-orders"
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

        <FormSection title="Order Information">
          <FormField
            label="Title"
            htmlFor="title"
            required
            error={errors.title?.message}
            className="sm:col-span-2"
          >
            <Input id="title" placeholder="PO title" {...register("title")} />
          </FormField>

          <FormField label="Grant" htmlFor="grantId" required error={errors.grantId?.message}>
            <Select
              key={grantSelectReady ? `grant-${grantIdValue || "empty"}` : "grant-loading"}
              value={grantIdValue || undefined}
              onValueChange={(v) => setValue("grantId", v, { shouldValidate: true })}
            >
              <SelectTrigger
                id="grantId"
                disabled={loadingGrants || Boolean(fromSource && prefilled && grantIdValue)}
              >
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

          <FormField label="Vendor" htmlFor="vendorId" required error={errors.vendorId?.message}>
            <Select
              key={vendorSelectReady ? `vendor-${vendorIdValue || "empty"}` : "vendor-loading"}
              value={vendorIdValue || undefined}
              onValueChange={(v) => setValue("vendorId", v, { shouldValidate: true })}
            >
              <SelectTrigger
                id="vendorId"
                disabled={loadingVendors || Boolean(fromSource && prefilled && vendorIdValue)}
              >
                <SelectValue placeholder={loadingVendors ? "Loading vendors…" : "Select vendor"} />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Currency" htmlFor="currency" required error={errors.currency?.message}>
            <Select
              value={watch("currency") || undefined}
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

          <FormField label="Delivery Date" htmlFor="deliveryDate">
            <Input id="deliveryDate" type="date" {...register("deliveryDate")} />
          </FormField>

          <FormField label="Delivery Address" htmlFor="deliveryAddress" className="sm:col-span-2">
            <Input id="deliveryAddress" placeholder="Delivery location" {...register("deliveryAddress")} />
          </FormField>
        </FormSection>

        <FormSection title="Line Items" contentClassName="grid-cols-1">
          {errors.items?.message && (
            <p className="text-xs text-destructive">{errors.items.message}</p>
          )}
          <div className="space-y-4 sm:col-span-2">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-4">
                <FormField
                  label="Description"
                  required
                  error={errors.items?.[index]?.description?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    placeholder="Item description"
                    {...register(`items.${index}.description`)}
                  />
                </FormField>
                <FormField
                  label="Quantity"
                  required
                  error={errors.items?.[index]?.orderedQuantity?.message}
                >
                  <Input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    {...register(`items.${index}.orderedQuantity`)}
                  />
                </FormField>
                <FormField label="Unit" required error={errors.items?.[index]?.unit?.message}>
                  <Input placeholder="Unit" {...register(`items.${index}.unit`)} />
                </FormField>
                <FormField
                  label="Unit Price"
                  required
                  error={errors.items?.[index]?.unitPrice?.message}
                >
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register(`items.${index}.unitPrice`)}
                  />
                </FormField>
                {fields.length > 1 && (
                  <div className="flex items-end sm:col-span-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ ...defaultItem })}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </FormSection>

        <FormSection title="Totals & Terms">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: watch("currency") || selectedGrant?.currency || "USD",
              }).format(subtotal)}
            </p>
          </div>

          <FormField label="Terms" htmlFor="terms">
            <Input id="terms" placeholder="Payment and delivery terms" {...register("terms")} />
          </FormField>

          <FormField label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" placeholder="Additional notes…" rows={3} {...register("notes")} />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel="Create Purchase Order"
          submittingLabel="Creating…"
          cancelHref="/procurement/purchase-orders"
          isSubmitting={createPO.isPending}
        />
      </form>
    </div>
  );
}

export default function NewPurchaseOrderPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewPurchaseOrderForm />
    </Suspense>
  );
}
