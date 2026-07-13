"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
  ACTIVITY_DOCUMENT_LABELS,
  SupportingDocumentsField,
  markAllStagedFiles,
  type StagedFile,
} from "@/components/forms/supporting-documents-field";
import { PermissionGate } from "@/components/auth/permission-gate";
import { activityFormSchema, type ActivityFormValues } from "@/lib/schemas/grant-activity";
import { useGrant } from "@/hooks/use-grants";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/search";
import { getPaginatedItems } from "@/lib/api/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency } from "@/lib/formatters";
import { createActivity } from "@/lib/api/projects";
import { uploadActivityDocuments } from "@/lib/api/uploads";

interface UserOption {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export default function NewActivityPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const { data: grant, isLoading } = useGrant(grantId);

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
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: ActivityFormValues) => {
      const activity = await createActivity({
        grantId,
        name: values.name,
        code: values.code || undefined,
        startDate: values.startDate,
        endDate: values.endDate,
        plannedBudget: Number(values.plannedBudget),
        description: values.description || undefined,
        responsibleUserId: values.responsibleUserId || undefined,
      });

      if (stagedFiles.length > 0) {
        const files = stagedFiles.map((s) => s.file);
        const labels = stagedFiles.map((s) => s.label);
        markAllStagedFiles(setStagedFiles, "uploading");
        try {
          await uploadActivityDocuments(activity.id, files, labels);
          markAllStagedFiles(setStagedFiles, "success");
        } catch (uploadErr: unknown) {
          const msg =
            (uploadErr as { response?: { data?: { message?: string } }; message?: string })
              ?.response?.data?.message ??
            (uploadErr as { message?: string })?.message ??
            "Document upload failed";
          markAllStagedFiles(setStagedFiles, "error", msg);
          throw new Error(msg);
        }
      }

      return activity;
    },
    onSuccess: () => router.push(`/grants/${grantId}`),
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to create activity";
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
    },
  });

  if (isLoading) return <LoadingSkeleton variant="cards" />;
  if (!grant) {
    return <div className="py-12 text-center text-muted-foreground">Grant not found.</div>;
  }

  const onSubmit = (values: ActivityFormValues) => {
    setSubmitError(null);
    mutation.mutate(values);
  };

  return (
    <div>
      <PageHeader
        title="Add Activity"
        description={`${grant.code} — ${grant.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Grants", href: "/grants" },
          { label: grant.code, href: `/grants/${grantId}` },
          { label: "New Activity" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/grants/${grantId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Grant
            </Link>
          </Button>
        }
      />

      <div className="mb-6 rounded-lg border bg-muted/30 p-4 text-sm">
        <p>
          <span className="font-medium">Grant budget:</span>{" "}
          {formatCurrency(Number(grant.totalBudget), grant.currency)}
        </p>
        <p className="text-muted-foreground">
          Activity dates must fall within the grant period. Activity budgets cannot exceed the grant total.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Activity Information">
          <FormField label="Activity Name" htmlFor="name" required error={errors.name?.message}>
            <Input id="name" placeholder="e.g. Beneficiary Registration" {...register("name")} />
          </FormField>

          <FormField label="Activity Code" htmlFor="code" error={errors.code?.message}>
            <Input id="code" placeholder="Auto-generated if left blank" {...register("code")} />
          </FormField>

          <FormField
            label="Planned Budget"
            htmlFor="plannedBudget"
            required
            error={errors.plannedBudget?.message}
          >
            <Input
              id="plannedBudget"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("plannedBudget")}
            />
          </FormField>

          <FormField label="Start Date" htmlFor="startDate" required error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormField>

          <FormField label="End Date" htmlFor="endDate" required error={errors.endDate?.message}>
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormField>

          <FormField label="Responsible Person" htmlFor="responsibleUserId">
            <Select
              value={watch("responsibleUserId") || ""}
              onValueChange={(v) => setValue("responsibleUserId", v)}
            >
              <SelectTrigger id="responsibleUserId" disabled={loadingUsers}>
                <SelectValue placeholder={loadingUsers ? "Loading…" : "Select (optional)"} />
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

        <FormSection title="Description" contentClassName="grid-cols-1">
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              placeholder="Describe this work package…"
              rows={4}
              {...register("description")}
            />
          </FormField>
        </FormSection>

        <PermissionGate permission="ACTIVITIES:UPDATE">
          <SupportingDocumentsField
            documentLabels={ACTIVITY_DOCUMENT_LABELS}
            stagedFiles={stagedFiles}
            onStagedFilesChange={setStagedFiles}
            onValidationError={setSubmitError}
            defaultLabel="Terms of Reference (TOR)"
          />
        </PermissionGate>

        <FormActions
          submitLabel="Create Activity"
          submittingLabel="Creating…"
          cancelHref={`/grants/${grantId}`}
          isSubmitting={mutation.isPending}
        />
      </form>
    </div>
  );
}
