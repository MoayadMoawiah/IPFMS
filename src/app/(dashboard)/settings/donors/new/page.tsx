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
import { useCreateDonor } from "@/hooks/use-donors";
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
  code: z
    .string()
    .min(1, "Donor code is required")
    .max(20, "Code must be 20 characters or fewer")
    .regex(/^[A-Z0-9_-]+$/i, "Code may only contain letters, numbers, hyphens, and underscores"),
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

export default function NewDonorPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createDonor = useCreateDonor();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
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

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createDonor.mutate(
      {
        code: values.code.toUpperCase(),
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
      {
        onSuccess: () => router.push("/settings/donors"),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create donor")),
      }
    );
  };

  return (
    <div>
      <PageHeader
        title="Add Donor"
        description="Register a new funding organization"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Donor Management", href: "/settings/donors" },
          { label: "Add Donor" },
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
          <FormField label="Donor Code" htmlFor="code" required error={errors.code?.message}>
            <Input id="code" placeholder="e.g. USAID, UNICEF" {...register("code")} />
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
            <Input
              id="name"
              placeholder="e.g. United States Agency for International Development"
              {...register("name")}
            />
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
            <Input id="contactName" placeholder="Primary contact person" {...register("contactName")} />
          </FormField>

          <FormField label="Contact Email" htmlFor="contactEmail" error={errors.contactEmail?.message}>
            <Input
              id="contactEmail"
              type="email"
              placeholder="grants@donor.org"
              {...register("contactEmail")}
            />
          </FormField>

          <FormField label="Contact Phone" htmlFor="contactPhone">
            <Input id="contactPhone" type="tel" placeholder="+1-..." {...register("contactPhone")} />
          </FormField>

          <FormField label="Address" htmlFor="address" className="sm:col-span-2">
            <Input id="address" placeholder="Mailing address" {...register("address")} />
          </FormField>
        </FormSection>

        <FormSection title="Additional Details" contentClassName="grid-cols-1">
          <FormField label="Notes" htmlFor="notes">
            <Textarea
              id="notes"
              placeholder="Reporting requirements, special conditions, etc."
              rows={3}
              {...register("notes")}
            />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel="Create Donor"
          submittingLabel="Creating…"
          cancelHref="/settings/donors"
          isSubmitting={createDonor.isPending}
        />
      </form>
    </div>
  );
}
