"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormActions,
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import { organization, fiscalYears } from "@/lib/mock-data/users";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Organization name is required"),
  nameAr: z.string().optional(),
  tagline: z.string().optional(),
  fiscalYear: z.string().min(1, "Fiscal year is required"),
  fiscalYearStart: z.string().min(1, "Fiscal year start is required"),
  prApprovalNotifications: z.boolean(),
  paymentStatusUpdates: z.boolean(),
  budgetAlertThresholds: z.boolean(),
  grantReportReminders: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: organization.name,
      nameAr: organization.nameAr,
      tagline: organization.tagline,
      fiscalYear: "2025",
      fiscalYearStart: "January 1",
      prApprovalNotifications: true,
      paymentStatusUpdates: true,
      budgetAlertThresholds: true,
      grantReportReminders: false,
    },
  });

  const notificationPrefs = [
    { key: "prApprovalNotifications" as const, label: "PR Approval Notifications" },
    { key: "paymentStatusUpdates" as const, label: "Payment Status Updates" },
    { key: "budgetAlertThresholds" as const, label: "Budget Alert Thresholds" },
    { key: "grantReportReminders" as const, label: "Grant Report Reminders" },
  ];

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setIsSaving(true);
    try {
      // Settings API not yet available — simulate save
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Settings Saved",
        description: `${values.name} settings updated successfully.`,
      });
    } catch {
      setSubmitError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure organization profile and system preferences"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection
          title="Organization Profile"
          description="Basic organization information"
          contentClassName="grid-cols-1"
        >
          <FormField
            label="Organization Name"
            htmlFor="name"
            required
            error={errors.name?.message}
          >
            <Input id="name" {...register("name")} />
          </FormField>

          <FormField label="Arabic Name" htmlFor="nameAr">
            <Input id="nameAr" dir="rtl" {...register("nameAr")} />
          </FormField>

          <FormField label="System Tagline" htmlFor="tagline" className="sm:col-span-2">
            <Input id="tagline" {...register("tagline")} />
          </FormField>
        </FormSection>

        <FormSection
          title="Fiscal Year Configuration"
          description="Financial period settings"
        >
          <FormField
            label="Current Fiscal Year"
            htmlFor="fiscalYear"
            required
            error={errors.fiscalYear?.message}
          >
            <Select
              value={watch("fiscalYear")}
              onValueChange={(v) => setValue("fiscalYear", v, { shouldValidate: true })}
            >
              <SelectTrigger id="fiscalYear">
                <SelectValue placeholder="Select fiscal year" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYears.map((fy) => (
                  <SelectItem key={fy} value={fy}>
                    FY {fy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Fiscal Year Start"
            htmlFor="fiscalYearStart"
            required
            error={errors.fiscalYearStart?.message}
          >
            <Input id="fiscalYearStart" {...register("fiscalYearStart")} />
          </FormField>
        </FormSection>

        <FormSection
          title="Notification Preferences"
          description="Manage email and in-app notifications"
          contentClassName="grid-cols-1"
        >
          <div className="space-y-4 sm:col-span-2">
            {notificationPrefs.map((pref) => (
              <div
                key={pref.key}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <Label htmlFor={pref.key}>{pref.label}</Label>
                <Switch
                  id={pref.key}
                  checked={watch(pref.key)}
                  onCheckedChange={(checked) => setValue(pref.key, checked)}
                />
              </div>
            ))}
          </div>
        </FormSection>

        <FormActions
          submitLabel="Save Changes"
          submittingLabel="Saving…"
          cancelHref="/dashboard"
          isSubmitting={isSaving}
        />
      </form>
    </div>
  );
}
