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
import { useCreateInventoryItem, useWarehouses } from "@/hooks/use-inventory";
import { getPaginatedItems } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";

const schema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Item name is required"),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
  warehouseId: z.string().optional(),
  reorderLevel: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), "Must be a non-negative number"),
});

type FormValues = z.infer<typeof schema>;

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: warehousesData, isLoading: loadingWarehouses } = useWarehouses({ limit: 100 });
  const warehouses: { id: string; name: string; code: string }[] =
    getPaginatedItems(warehousesData);

  const createItem = useCreateInventoryItem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sku: "",
      name: "",
      unit: "Unit",
      description: "",
      warehouseId: "",
      reorderLevel: "0",
    },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createItem.mutate(
      {
        sku: values.sku,
        name: values.name,
        unit: values.unit,
        description: values.description || undefined,
        warehouseId: values.warehouseId || undefined,
        reorderLevel: values.reorderLevel ? Number(values.reorderLevel) : 0,
      },
      {
        onSuccess: () => router.push("/procurement/inventory"),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create inventory item")),
      }
    );
  };

  return (
    <div>
      <PageHeader
        title="Add Inventory Item"
        description="Register a new item in the inventory catalog"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Inventory", href: "/procurement/inventory" },
          { label: "Add Item" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/procurement/inventory">
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Item Information">
          <FormField label="SKU" htmlFor="sku" required error={errors.sku?.message}>
            <Input id="sku" placeholder="e.g. ITM-001" {...register("sku")} />
          </FormField>

          <FormField label="Unit" htmlFor="unit" required error={errors.unit?.message}>
            <Input id="unit" placeholder="e.g. Box, Unit, Kg" {...register("unit")} />
          </FormField>

          <FormField
            label="Item Name"
            htmlFor="name"
            required
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input id="name" placeholder="e.g. Office Paper A4" {...register("name")} />
          </FormField>

          <FormField label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea
              id="description"
              placeholder="Item description and specifications…"
              rows={3}
              {...register("description")}
            />
          </FormField>
        </FormSection>

        <FormSection title="Stock Settings">
          <FormField label="Warehouse" htmlFor="warehouseId">
            <Select
              value={watch("warehouseId")}
              onValueChange={(v) => setValue("warehouseId", v)}
            >
              <SelectTrigger id="warehouseId" disabled={loadingWarehouses}>
                <SelectValue
                  placeholder={loadingWarehouses ? "Loading warehouses…" : "Select warehouse (optional)"}
                />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Reorder Level" htmlFor="reorderLevel" error={errors.reorderLevel?.message}>
            <Input
              id="reorderLevel"
              type="number"
              min="0"
              placeholder="0"
              {...register("reorderLevel")}
            />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel="Add Item"
          submittingLabel="Adding…"
          cancelHref="/procurement/inventory"
          isSubmitting={createItem.isPending}
        />
      </form>
    </div>
  );
}
