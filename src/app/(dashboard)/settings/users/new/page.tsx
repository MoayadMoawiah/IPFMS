"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  FormActions,
  FormErrorBanner,
  FormField,
  FormSection,
} from "@/components/forms/form-layout";
import { useCreateUser, useRoles } from "@/hooks/use-users";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { extractApiError } from "@/lib/api-errors";
import { createUserSchema, type CreateUserFormValues } from "@/lib/schemas/user";

type FormValues = CreateUserFormValues;

export default function NewUserPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: roles, isLoading: loadingRoles } = useRoles();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      arabicName: "",
      phone: "",
      departmentId: "",
      isActive: true,
      roleIds: [],
    },
  });

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

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createUser.mutate(
      {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password || undefined,
        arabicName: values.arabicName || undefined,
        phone: values.phone || undefined,
        departmentId: values.departmentId || undefined,
        organizationId: "org-gaderon",
        isActive: values.isActive,
        roleIds: values.roleIds,
      },
      {
        onSuccess: () => router.push("/settings/users"),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create user")),
      }
    );
  };

  return (
    <div>
      <PageHeader
        title="Add User"
        description="Create a new system user and assign roles"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Users", href: "/settings/users" },
          { label: "Add User" },
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
          <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              placeholder="Leave blank for default password"
              autoComplete="new-password"
              {...register("password")}
            />
          </FormField>

          <FormField label="Department" htmlFor="departmentId">
            <Select
              value={watch("departmentId")}
              onValueChange={(v) => setValue("departmentId", v)}
            >
              <SelectTrigger id="departmentId">
                <SelectValue placeholder="Select department (optional)" />
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
          submitLabel="Create User"
          submittingLabel="Creating…"
          cancelHref="/settings/users"
          isSubmitting={createUser.isPending}
        />
      </form>
    </div>
  );
}
