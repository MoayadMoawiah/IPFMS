import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RequiredMark() {
  return <span className="text-destructive"> *</span>;
}

export function FormErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("grid gap-4 sm:grid-cols-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <RequiredMark />}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface FormActionsProps {
  submitLabel: string;
  submittingLabel?: string;
  cancelHref: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  submitType?: "submit" | "button";
  onSubmit?: () => void;
}

export function FormActions({
  submitLabel,
  submittingLabel = "Saving…",
  cancelHref,
  isSubmitting = false,
  submitDisabled = false,
  submitType = "submit",
  onSubmit,
}: FormActionsProps) {
  return (
    <div className="flex gap-3">
      <Button
        type={submitType}
        disabled={isSubmitting || submitDisabled}
        onClick={submitType === "button" ? onSubmit : undefined}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
      <Button type="button" variant="outline" asChild>
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}
