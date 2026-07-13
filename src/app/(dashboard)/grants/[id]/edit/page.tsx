"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useGrant, useUpdateGrant } from "@/hooks/use-grants";
import { useDonors } from "@/hooks/use-donors";
import { getPaginatedItems } from "@/lib/api/pagination";
import { grantFormSchema, type GrantFormValues } from "@/lib/schemas/grant-activity";
import { getUsers } from "@/lib/api/search";
import { toDateInputValue } from "@/lib/formatters";

const CURRENCIES = ["USD", "EUR", "GBP", "SDG", "SAR", "AED", "EGP"];

interface UserOption {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export default function EditGrantPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: grant, isLoading, isError } = useGrant(grantId);
  const updateGrant = useUpdateGrant();
  const { data: donorsData } = useDonors({ limit: 100 });
  const donors = getPaginatedItems(donorsData) as { id: string; name: string; code: string }[];

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => getUsers({ limit: 100 }),
  });
  const users: UserOption[] = getPaginatedItems(usersData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GrantFormValues>({
    resolver: zodResolver(grantFormSchema),
  });

  useEffect(() => {
    if (!grant) return;
    reset({
      code: grant.code,
      name: grant.name,
      donorId: grant.donorId,
      currency: grant.currency,
      totalBudget: String(grant.totalBudget),
      startDate: toDateInputValue(grant.startDate),
      endDate: toDateInputValue(grant.endDate),
      signedDate: grant.signedDate ? toDateInputValue(grant.signedDate) : "",
      description: grant.description ?? "",
      objectives: grant.objectives ?? "",
      conditions: grant.conditions ?? "",
      reportingRequirements: grant.reportingRequirements ?? "",
      targetBeneficiaries: grant.targetBeneficiaries ? String(grant.targetBeneficiaries) : "",
      grantManagerId: grant.grantManagerId ?? "",
    });
  }, [grant, reset]);

  if (isLoading) return <LoadingSkeleton variant="cards" />;
  if (isError || !grant) {
    return <div className="py-12 text-center text-muted-foreground">Grant not found.</div>;
  }

  const isClosed = grant.status === "CLOSED" || grant.status === "CANCELLED";

  const onSubmit = (values: GrantFormValues) => {
    setSubmitError(null);
    updateGrant.mutate(
      {
        id: grantId,
        dto: {
          name: values.name,
          totalBudget: Number(values.totalBudget),
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description || undefined,
          objectives: values.objectives || undefined,
          conditions: values.conditions || undefined,
          reportingRequirements: values.reportingRequirements || undefined,
          targetBeneficiaries: values.targetBeneficiaries
            ? Number(values.targetBeneficiaries)
            : undefined,
          grantManagerId: values.grantManagerId || undefined,
        },
      },
      {
        onSuccess: () => router.push(`/grants/${grantId}`),
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
          const msg = e?.response?.data?.message ?? e?.message ?? "Failed to update grant";
          setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
        },
      }
    );
  };

  return (
    <PermissionGate
      permission="GRANTS:UPDATE"
      fallback={
        <div className="py-12 text-center text-muted-foreground">
          You do not have permission to edit grants.
        </div>
      }
    >
      <div>
        <PageHeader
          title="Edit Grant"
          description={`${grant.code} — ${grant.name}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Grants", href: "/grants" },
            { label: grant.code, href: `/grants/${grantId}` },
            { label: "Edit" },
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

        {isClosed && (
          <div className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            This grant is {grant.status.toLowerCase()} and cannot be edited.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {submitError && <FormErrorBanner message={submitError} />}

          <FormSection title="Grant Information">
            <FormField label="Grant Code" htmlFor="code">
              <Input id="code" disabled {...register("code")} />
            </FormField>

            <FormField label="Donor" htmlFor="donorId">
              <Select value={watch("donorId")} disabled>
                <SelectTrigger id="donorId">
                  <SelectValue placeholder="Donor" />
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
              <Input id="name" disabled={isClosed} {...register("name")} />
            </FormField>
          </FormSection>

          <FormSection title="Budget & Timeline">
            <FormField label="Currency" htmlFor="currency">
              <Select value={watch("currency")} disabled>
                <SelectTrigger id="currency">
                  <SelectValue />
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
                disabled={isClosed}
                {...register("totalBudget")}
              />
            </FormField>

            <FormField label="Start Date" htmlFor="startDate" required error={errors.startDate?.message}>
              <Input id="startDate" type="date" disabled={isClosed} {...register("startDate")} />
            </FormField>

            <FormField label="End Date" htmlFor="endDate" required error={errors.endDate?.message}>
              <Input id="endDate" type="date" disabled={isClosed} {...register("endDate")} />
            </FormField>

            <FormField label="Target Beneficiaries" htmlFor="targetBeneficiaries">
              <Input
                id="targetBeneficiaries"
                type="number"
                min="0"
                disabled={isClosed}
                {...register("targetBeneficiaries")}
              />
            </FormField>

            <FormField label="Grant Manager" htmlFor="grantManagerId">
              <Select
                value={watch("grantManagerId") || ""}
                onValueChange={(v) => setValue("grantManagerId", v)}
                disabled={isClosed || loadingUsers}
              >
                <SelectTrigger id="grantManagerId">
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
              <Textarea id="description" rows={3} disabled={isClosed} {...register("description")} />
            </FormField>
            <FormField label="Objectives" htmlFor="objectives">
              <Textarea id="objectives" rows={3} disabled={isClosed} {...register("objectives")} />
            </FormField>
            <FormField label="Conditions" htmlFor="conditions">
              <Textarea id="conditions" rows={3} disabled={isClosed} {...register("conditions")} />
            </FormField>
            <FormField label="Reporting Requirements" htmlFor="reportingRequirements">
              <Textarea
                id="reportingRequirements"
                rows={3}
                disabled={isClosed}
                {...register("reportingRequirements")}
              />
            </FormField>
          </FormSection>

          <FormActions
            submitLabel="Save Changes"
            submittingLabel="Saving…"
            cancelHref={`/grants/${grantId}`}
            isSubmitting={updateGrant.isPending}
            submitDisabled={isClosed}
          />
        </form>
      </div>
    </PermissionGate>
  );
}
