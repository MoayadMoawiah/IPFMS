"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  FormActions,
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import { useDonor, useUpdateDonor } from "@/hooks/use-donors";
import { extractApiError } from "@/lib/api-errors";
import type { DonorType } from "@/lib/api/donors";

const DONOR_TYPES = [
  { value: "BILATERAL", label: "Bilateral" },
  { value: "MULTILATERAL", label: "Multilateral" },
  { value: "PRIVATE", label: "Private" },
  { value: "FOUNDATION", label: "Foundation" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "OTHER", label: "Other" },
] as const;

const schema = z.object({
  name: z.string().min(1, "Donor name is required"),
  donorType: z.string().min(1, "Donor type is required"),
  country: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditDonorPage() {
  const params = useParams();
  const router = useRouter();
  const donorId = params.id as string;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: donor, isLoading, isError } = useDonor(donorId);
  const updateDonor = useUpdateDonor();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      donorType: "OTHER",
      country: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      website: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!donor) return;
    reset({
      name: donor.name,
      donorType: donor.donorType,
      country: donor.country ?? "",
      contactName: donor.contactName ?? "",
      contactEmail: donor.contactEmail ?? "",
      contactPhone: donor.contactPhone ?? "",
      address: donor.address ?? "",
      website: donor.website ?? "",
      notes: donor.notes ?? "",
    });
  }, [donor, reset]);

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    updateDonor.mutate(
      {
        id: donorId,
        dto: {
          name: values.name,
          donorType: values.donorType as DonorType,
          country: values.country || undefined,
          contactName: values.contactName || undefined,
          contactEmail: values.contactEmail || undefined,
          contactPhone: values.contactPhone || undefined,
          address: values.address || undefined,
          website: values.website || undefined,
          notes: values.notes || undefined,
        },
      },
      {
        onSuccess: () => router.push("/settings/donors"),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to update donor")),
      }
    );
  };

  if (isLoading) return <LoadingSkeleton variant="page" />;
  if (isError || !donor) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Donor not found or failed to load.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Donor"
        description={`Update profile for ${donor.code}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Donor Management", href: "/settings/donors" },
          { label: donor.code },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/settings/donors">
              <ArrowLeft className="h-4 w-4" />
              Back to Donors
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Donor Information">
          <FormField label="Donor Code">
            <Input value={donor.code} disabled readOnly />
          </FormField>

          <FormField label="Donor Type" htmlFor="donorType" required error={errors.donorType?.message}>
            <Select
              value={watch("donorType")}
              onValueChange={(v) => setValue("donorType", v, { shouldValidate: true })}
            >
              <SelectTrigger id="donorType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DONOR_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Donor Name"
            htmlFor="name"
            required
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input id="name" {...register("name")} />
          </FormField>

          <FormField label="Country" htmlFor="country">
            <Input id="country" placeholder="e.g. USA" {...register("country")} />
          </FormField>

          <FormField label="Website" htmlFor="website" error={errors.website?.message}>
            <Input id="website" type="url" placeholder="https://..." {...register("website")} />
          </FormField>
        </FormSection>

        <FormSection title="Contact Details">
          <FormField label="Contact Name" htmlFor="contactName">
            <Input id="contactName" {...register("contactName")} />
          </FormField>

          <FormField label="Contact Email" htmlFor="contactEmail" error={errors.contactEmail?.message}>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </FormField>

          <FormField label="Contact Phone" htmlFor="contactPhone">
            <Input id="contactPhone" type="tel" {...register("contactPhone")} />
          </FormField>

          <FormField label="Address" htmlFor="address" className="sm:col-span-2">
            <Input id="address" {...register("address")} />
          </FormField>
        </FormSection>

        <FormSection title="Additional Details" contentClassName="grid-cols-1">
          <FormField label="Notes" htmlFor="notes">
            <Textarea id="notes" rows={3} {...register("notes")} />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel="Save Changes"
          submittingLabel="Saving…"
          cancelHref="/settings/donors"
          isSubmitting={updateDonor.isPending}
        />
      </form>
    </div>
  );
}
