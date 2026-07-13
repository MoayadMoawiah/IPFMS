"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
  GRANT_DOCUMENT_LABELS,
  SupportingDocumentsField,
  markAllStagedFiles,
  type StagedFile,
} from "@/components/forms/supporting-documents-field";
import { createGrant } from "@/lib/api/grants";
import { useDonors } from "@/hooks/use-donors";
import { getPaginatedItems } from "@/lib/api/pagination";
import { uploadGrantDocuments } from "@/lib/api/uploads";
import { grantFormSchema, type GrantFormValues } from "@/lib/schemas/grant-activity";
import { getUsers } from "@/lib/api/search";

const CURRENCIES = ["USD", "EUR", "GBP", "SDG", "SAR", "AED", "EGP"];

type FormValues = GrantFormValues;

interface UserOption {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export default function NewGrantPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const { data: donorsData, isLoading: loadingDonors } = useDonors({ limit: 100 });
  const donors: { id: string; name: string; code: string }[] = getPaginatedItems(donorsData);

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => getUsers({ limit: 100 }),
  });
  const users: UserOption[] = getPaginatedItems(usersData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(grantFormSchema),
    defaultValues: { currency: "USD" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const grant = await createGrant({
        code: values.code,
        name: values.name,
        donorId: values.donorId,
        currency: values.currency,
        totalBudget: Number(values.totalBudget),
        startDate: values.startDate,
        endDate: values.endDate,
        signedDate: values.signedDate || undefined,
        description: values.description || undefined,
        objectives: values.objectives || undefined,
        conditions: values.conditions || undefined,
        reportingRequirements: values.reportingRequirements || undefined,
        targetBeneficiaries: values.targetBeneficiaries
          ? Number(values.targetBeneficiaries)
          : undefined,
        grantManagerId: values.grantManagerId || undefined,
      });

      if (stagedFiles.length > 0) {
        const files = stagedFiles.map((s) => s.file);
        const labels = stagedFiles.map((s) => s.label);
        markAllStagedFiles(setStagedFiles, "uploading");
        try {
          await uploadGrantDocuments(grant.id, files, labels);
          markAllStagedFiles(setStagedFiles, "success");
        } catch (uploadErr: unknown) {
          const msg =
            (uploadErr as { response?: { data?: { message?: string } }; message?: string })
              ?.response?.data?.message ??
            (uploadErr as { message?: string })?.message ??
            "Document upload failed";
          markAllStagedFiles(setStagedFiles, "error", msg);
        }
      }

      return grant;
    },
    onSuccess: (grant) => {
      queryClient.invalidateQueries({ queryKey: ["grants"] });
      router.push(`/grants/${grant.id}`);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to create grant";
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
    },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    mutation.mutate(values);
  };

  return (
    <div>
      <PageHeader
        title="New Grant / Project"
        description="Create a donor grant agreement — a linked project is created automatically"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Grant Management", href: "/grants" },
          { label: "New Grant" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/grants">
              <ArrowLeft className="h-4 w-4" />
              Back to Grants
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Grant Information">
          <FormField label="Grant Code" htmlFor="code" required error={errors.code?.message}>
            <Input id="code" placeholder="e.g. USAID-2026-001" {...register("code")} />
          </FormField>

          <FormField label="Donor" htmlFor="donorId" required error={errors.donorId?.message}>
            <Select
              value={watch("donorId")}
              onValueChange={(v) => setValue("donorId", v, { shouldValidate: true })}
            >
              <SelectTrigger id="donorId" disabled={loadingDonors}>
                <SelectValue placeholder={loadingDonors ? "Loading donors…" : "Select donor"} />
              </SelectTrigger>
              <SelectContent>
                {donors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Grant Name"
            htmlFor="name"
            required
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input
              id="name"
              placeholder="e.g. Health Systems Strengthening Project"
              {...register("name")}
            />
          </FormField>
        </FormSection>

        <FormSection title="Budget & Timeline">
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

          <FormField
            label="Total Budget"
            htmlFor="totalBudget"
            required
            error={errors.totalBudget?.message}
          >
            <Input
              id="totalBudget"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("totalBudget")}
            />
          </FormField>

          <FormField
            label="Start Date"
            htmlFor="startDate"
            required
            error={errors.startDate?.message}
          >
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormField>

          <FormField label="End Date" htmlFor="endDate" required error={errors.endDate?.message}>
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormField>

          <FormField label="Signing Date" htmlFor="signedDate">
            <Input id="signedDate" type="date" {...register("signedDate")} />
          </FormField>

          <FormField label="Target Beneficiaries" htmlFor="targetBeneficiaries">
            <Input
              id="targetBeneficiaries"
              type="number"
              min="0"
              placeholder="e.g. 50000"
              {...register("targetBeneficiaries")}
            />
          </FormField>

          <FormField label="Grant Manager" htmlFor="grantManagerId">
            <Select
              value={watch("grantManagerId") || ""}
              onValueChange={(v) => setValue("grantManagerId", v)}
            >
              <SelectTrigger id="grantManagerId" disabled={loadingUsers}>
                <SelectValue placeholder={loadingUsers ? "Loading…" : "Select manager (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>

        <FormSection title="Additional Details" contentClassName="grid-cols-1">
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              placeholder="General project description…"
              rows={3}
              {...register("description")}
            />
          </FormField>

          <FormField label="Objectives" htmlFor="objectives">
            <Textarea
              id="objectives"
              placeholder="Describe the grant objectives…"
              rows={3}
              {...register("objectives")}
            />
          </FormField>

          <FormField label="Conditions" htmlFor="conditions">
            <Textarea
              id="conditions"
              placeholder="Any special conditions or restrictions…"
              rows={3}
              {...register("conditions")}
            />
          </FormField>

          <FormField label="Reporting Requirements" htmlFor="reportingRequirements">
            <Textarea
              id="reportingRequirements"
              placeholder="Frequency and format of donor reporting…"
              rows={3}
              {...register("reportingRequirements")}
            />
          </FormField>
        </FormSection>

        <SupportingDocumentsField
          documentLabels={GRANT_DOCUMENT_LABELS}
          stagedFiles={stagedFiles}
          onStagedFilesChange={setStagedFiles}
          onValidationError={setSubmitError}
        />

        <FormActions
          submitLabel="Create Grant"
          submittingLabel="Creating…"
          cancelHref="/grants"
          isSubmitting={mutation.isPending}
        />
      </form>
    </div>
  );
}
