"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useUser, useUpdateUser, useRoles } from "@/hooks/use-users";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { extractApiError } from "@/lib/api-errors";
import { updateUserSchema, type UpdateUserFormValues } from "@/lib/schemas/user";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: user, isLoading, isError } = useUser(userId);
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      arabicName: "",
      phone: "",
      departmentId: "",
      isActive: true,
      roleIds: [],
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      arabicName: user.arabicName ?? "",
      phone: user.phone ?? "",
      departmentId: user.department?.id ?? "",
      isActive: user.isActive,
      roleIds: (user.roles ?? []).map((r) => r.id),
    });
  }, [user, reset]);

  const selectedRoleIds = watch("roleIds");

  const toggleRole = (roleId: string, checked: boolean) => {
    const current = watch("roleIds");
    if (checked) {
      setValue("roleIds", [...current, roleId], { shouldValidate: true });
    } else {
      setValue(
        "roleIds",
        current.filter((id) => id !== roleId),
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = (values: UpdateUserFormValues) => {
    setSubmitError(null);
    updateUser.mutate(
      {
        id: userId,
        dto: {
          firstName: values.firstName,
          lastName: values.lastName,
          arabicName: values.arabicName || undefined,
          phone: values.phone || undefined,
          departmentId: values.departmentId || null,
          isActive: values.isActive,
          roleIds: values.roleIds,
        },
      },
      {
        onSuccess: () => router.push("/settings/users"),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to update user")),
      }
    );
  };

  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (isError || !user) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        User not found or failed to load.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit User"
        description={`${user.firstName} ${user.lastName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Users", href: "/settings/users" },
          { label: "Edit User" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/settings/users">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="Personal Information">
          <FormField
            label="First Name"
            htmlFor="firstName"
            required
            error={errors.firstName?.message}
          >
            <Input id="firstName" {...register("firstName")} />
          </FormField>

          <FormField
            label="Last Name"
            htmlFor="lastName"
            required
            error={errors.lastName?.message}
          >
            <Input id="lastName" {...register("lastName")} />
          </FormField>

          <FormField label="Arabic Name" htmlFor="arabicName">
            <Input id="arabicName" dir="rtl" {...register("arabicName")} />
          </FormField>

          <FormField label="Phone" htmlFor="phone">
            <Input id="phone" type="tel" placeholder="+249-..." {...register("phone")} />
          </FormField>
        </FormSection>

        <FormSection title="Account Details">
          <FormField label="Email" htmlFor="email">
            <Input id="email" type="email" value={user.email} disabled readOnly />
          </FormField>

          <FormField label="Department" htmlFor="departmentId">
            <Select
              value={watch("departmentId") || "none"}
              onValueChange={(v) => setValue("departmentId", v === "none" ? "" : v)}
            >
              <SelectTrigger id="departmentId">
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="isActive">Active Account</Label>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>
        </FormSection>

        <FormSection title="Roles" contentClassName="grid-cols-1">
          {errors.roleIds?.message && (
            <p className="text-xs text-destructive">{errors.roleIds.message}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2 sm:col-span-2">
            {loadingRoles ? (
              <p className="text-sm text-muted-foreground">Loading roles…</p>
            ) : (
              (roles ?? []).map((role) => (
                <div
                  key={role.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={(checked) => toggleRole(role.id, checked === true)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`role-${role.id}`} className="font-medium">
                      {role.displayName ?? role.name}
                    </Label>
                    {role.description && (
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </FormSection>

        <FormActions
          submitLabel="Save Changes"
          submittingLabel="Saving…"
          cancelHref="/settings/users"
          isSubmitting={updateUser.isPending}
        />
      </form>
    </div>
  );
}
