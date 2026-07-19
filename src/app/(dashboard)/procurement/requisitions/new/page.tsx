"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Trash2 } from "lucide-react";
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
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import {
  REQUISITION_DOCUMENT_LABELS,
  SupportingDocumentsField,
  markAllStagedFiles,
  type StagedFile,
} from "@/components/forms/supporting-documents-field";
import { useGrants } from "@/hooks/use-grants";
import { getPaginatedItems } from "@/lib/api/pagination";
import {
  useCreatePurchaseRequisition,
  useSubmitPurchaseRequisition,
} from "@/hooks/use-procurement";
import { uploadRequisitionDocuments } from "@/lib/api/uploads";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { cn } from "@/lib/utils";

const steps = [
  "General Information",
  "Items",
  "Budget",
  "Attachments",
  "Approval Preview",
] as const;

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  estimatedUnitPrice: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a non-negative number"),
});

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  grantId: z.string().min(1, "Grant is required"),
  departmentId: z.string().min(1, "Department is required"),
  description: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type FormValues = z.infer<typeof schema>;

const defaultItem = { description: "", quantity: "", unit: "Unit", estimatedUnitPrice: "" };

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NewPRPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: grantsData, isLoading: loadingGrants } = useGrants({
    limit: 100,
    status: "ACTIVE",
  });
  const grants = getPaginatedItems(grantsData);

  const createPR = useCreatePurchaseRequisition();
  const submitPR = useSubmitPurchaseRequisition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      grantId: "",
      departmentId: "",
      description: "",
      items: [{ ...defaultItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const grantId = watch("grantId");
  const items = watch("items");
  const selectedGrant = grants.find((g) => g.id === grantId);

  const estimatedTotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.estimatedUnitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const validateStep = async (currentStep: number) => {
    if (currentStep === 0) {
      return trigger(["title", "grantId", "departmentId", "description"]);
    }
    if (currentStep === 1) {
      return trigger("items");
    }
    return true;
  };

  const nextStep = async () => {
    setSubmitError(null);
    const valid = await validateStep(step);
    if (!valid) return;
    if (step < steps.length - 1) setStep(step + 1);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const dto = {
      grantId: values.grantId,
      departmentId: values.departmentId,
      title: values.title,
      description: values.description || undefined,
      totalEstimatedAmount: values.items.reduce(
        (sum, item) =>
          sum + Number(item.quantity) * Number(item.estimatedUnitPrice),
        0
      ),
      currency: selectedGrant?.currency ?? "USD",
      items: values.items.map((item) => ({
        description: item.description,
        unit: item.unit,
        quantity: Number(item.quantity),
        estimatedUnitPrice: Number(item.estimatedUnitPrice),
        totalEstimated: Number(item.quantity) * Number(item.estimatedUnitPrice),
      })),
    };

    createPR.mutate(dto, {
      onSuccess: async (pr) => {
        if (stagedFiles.length > 0) {
          const files = stagedFiles.map((s) => s.file);
          const labels = stagedFiles.map((s) => s.label);
          setIsUploading(true);
          markAllStagedFiles(setStagedFiles, "uploading");
          try {
            await uploadRequisitionDocuments(pr.id, files, labels);
            markAllStagedFiles(setStagedFiles, "success");
          } catch (uploadErr: unknown) {
            const msg =
              (uploadErr as { response?: { data?: { message?: string } }; message?: string })
                ?.response?.data?.message ??
              (uploadErr as { message?: string })?.message ??
              "Document upload failed";
            markAllStagedFiles(setStagedFiles, "error", msg);
            setSubmitError(`PR created, but document upload failed: ${msg}`);
          } finally {
            setIsUploading(false);
          }
        }

        submitPR.mutate(pr.id, {
          onSuccess: () => router.push(`/procurement/requisitions/${pr.id}`),
          onError: (err: unknown) => {
            const msg = extractError(err);
            setSubmitError(msg);
            router.push(`/procurement/requisitions/${pr.id}`);
          },
        });
      },
      onError: (err: unknown) => {
        setSubmitError(extractError(err));
      },
    });
  };

  const isSubmitting = createPR.isPending || submitPR.isPending || isUploading;

  return (
    <div>
      <PageHeader
        title="Create Purchase Requisition"
        description="Multi-step wizard to create a new purchase requisition"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: "New PR" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/procurement/requisitions">
              <ArrowLeft className="h-4 w-4" />
              Back to Requisitions
            </Link>
          </Button>
        }
      />

      <div className="mb-8 flex items-center justify-between overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "ml-2 hidden text-sm sm:inline",
                i <= step ? "font-medium" : "text-muted-foreground"
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn("mx-4 h-px w-8 sm:w-16", i < step ? "bg-primary" : "bg-border")}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        {step === 0 && (
          <FormSection title="General Information">
            <FormField
              label="Title"
              htmlFor="title"
              required
              error={errors.title?.message}
              className="sm:col-span-2"
            >
              <Input id="title" placeholder="PR title" {...register("title")} />
            </FormField>

            <FormField
              label="Grant"
              htmlFor="grantId"
              required
              error={errors.grantId?.message}
            >
              <Select
                value={watch("grantId")}
                onValueChange={(v) => setValue("grantId", v, { shouldValidate: true })}
              >
                <SelectTrigger id="grantId" disabled={loadingGrants}>
                  <SelectValue
                    placeholder={loadingGrants ? "Loading grants…" : "Select grant"}
                  />
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

            <FormField
              label="Department"
              htmlFor="departmentId"
              required
              error={errors.departmentId?.message}
            >
              <Select
                value={watch("departmentId")}
                onValueChange={(v) => setValue("departmentId", v, { shouldValidate: true })}
              >
                <SelectTrigger id="departmentId">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              className="sm:col-span-2"
            >
              <Textarea
                id="description"
                placeholder="Purpose and justification"
                rows={3}
                {...register("description")}
              />
            </FormField>
          </FormSection>
        )}

        {step === 1 && (
          <FormSection title="Line Items" contentClassName="grid-cols-1">
            {errors.items?.message && (
              <p className="text-xs text-destructive">{errors.items.message}</p>
            )}
            <div className="space-y-4 sm:col-span-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 rounded-lg border p-4 sm:grid-cols-4"
                >
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
                    error={errors.items?.[index]?.quantity?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Qty"
                      {...register(`items.${index}.quantity`)}
                    />
                  </FormField>
                  <FormField
                    label="Unit"
                    required
                    error={errors.items?.[index]?.unit?.message}
                  >
                    <Input placeholder="Unit" {...register(`items.${index}.unit`)} />
                  </FormField>
                  <FormField
                    label="Est. Unit Price"
                    required
                    error={errors.items?.[index]?.estimatedUnitPrice?.message}
                  >
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...register(`items.${index}.estimatedUnitPrice`)}
                    />
                  </FormField>
                  {fields.length > 1 && (
                    <div className="flex items-end sm:col-span-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
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
        )}

        {step === 2 && (
          <FormSection title="Budget Summary" contentClassName="grid-cols-1 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="text-2xl font-bold">
                {formatCurrency(estimatedTotal, selectedGrant?.currency)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Available Budget</p>
              <p className="text-2xl font-bold text-green-600">
                {selectedGrant
                  ? formatCurrency(selectedGrant.availableAmount, selectedGrant.currency)
                  : "—"}
              </p>
            </div>
          </FormSection>
        )}

        {step === 3 && (
          <SupportingDocumentsField
            documentLabels={REQUISITION_DOCUMENT_LABELS}
            stagedFiles={stagedFiles}
            onStagedFilesChange={setStagedFiles}
            onValidationError={setSubmitError}
            disabled={isSubmitting}
          />
        )}

        {step === 4 && (
          <FormSection title="Approval Preview" contentClassName="grid-cols-1">
            <div className="rounded-lg bg-muted/50 p-4 sm:col-span-2">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Title</dt>
                  <dd className="font-medium">{getValues("title") || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Grant</dt>
                  <dd className="font-medium">{selectedGrant?.code ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Department</dt>
                  <dd className="font-medium">
                    {DEPARTMENTS.find((d) => d.id === getValues("departmentId"))?.name ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="font-medium">{items.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Amount</dt>
                  <dd className="font-medium">
                    {formatCurrency(estimatedTotal, selectedGrant?.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Attachments</dt>
                  <dd className="font-medium">
                    {stagedFiles.length === 0
                      ? "None"
                      : `${stagedFiles.length} file${stagedFiles.length === 1 ? "" : "s"}`}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="text-sm text-muted-foreground sm:col-span-2">
              Upon submission, this PR will be routed to the Program Manager and Finance Officer
              for approval.
            </p>
          </FormSection>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || isSubmitting}
          >
            Previous
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isSubmitting ? "Submitting…" : "Submit for Approval"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function extractError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const msg = e?.response?.data?.message ?? e?.message ?? "An error occurred";
  return Array.isArray(msg) ? msg.join(", ") : msg;
}
