"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FormErrorBanner, FormField } from "@/components/forms/form-layout";
import {
  ACTIVITY_DOCUMENT_LABELS,
  SupportingDocumentsField,
  formatBytes,
  markAllStagedFiles,
  type StagedFile,
} from "@/components/forms/supporting-documents-field";
import { PermissionGate, usePermission } from "@/components/auth/permission-gate";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { activityFormSchema, type ActivityFormValues } from "@/lib/schemas/grant-activity";
import { useUpdateActivity } from "@/hooks/use-projects";
import { getUsers } from "@/lib/api/search";
import { getPaginatedItems } from "@/lib/api/pagination";
import { toDateInputValue } from "@/lib/formatters";
import type { GrantActivity } from "@/lib/api/grants";
import {
  deleteActivityDocument,
  getActivityDocuments,
  uploadActivityDocuments,
  type DocumentAttachment,
} from "@/lib/api/uploads";

interface UserOption {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

interface ActivityEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: GrantActivity | null;
  grantId: string;
}

export function ActivityEditDialog({
  open,
  onOpenChange,
  activity,
  grantId,
}: ActivityEditDialogProps) {
  const queryClient = useQueryClient();
  const canUpdate = usePermission("ACTIVITIES:UPDATE");
  const canRead = usePermission("ACTIVITIES:READ");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DocumentAttachment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const updateActivity = useUpdateActivity();

  const activityId = activity?.id ?? "";

  const { data: documents = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["activity-documents", activityId],
    queryFn: () => getActivityDocuments(activityId),
    enabled: open && !!activityId && canRead,
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => getUsers({ limit: 100 }),
    enabled: open,
  });
  const users: UserOption[] = getPaginatedItems(usersData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
  });

  useEffect(() => {
    if (!activity || !open) return;
    reset({
      name: activity.name,
      code: activity.code,
      startDate: toDateInputValue(activity.startDate),
      endDate: toDateInputValue(activity.endDate),
      plannedBudget: String(activity.plannedBudget),
      description: activity.description ?? "",
      responsibleUserId: activity.responsibleUserId ?? "",
    });
    setSubmitError(null);
    setStagedFiles([]);
  }, [activity, open, reset]);

  const refreshDocuments = () => {
    queryClient.invalidateQueries({ queryKey: ["activity-documents", activityId] });
  };

  const handleDeleteDocument = async () => {
    if (!deleteTarget || !activity) return;
    try {
      await deleteActivityDocument(activity.id, deleteTarget.id);
      refreshDocuments();
      setDeleteTarget(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(e?.response?.data?.message ?? e?.message ?? "Failed to delete document");
    }
  };

  const onSubmit = async (values: ActivityFormValues) => {
    if (!activity) return;
    setSubmitError(null);
    setIsSaving(true);

    try {
      await updateActivity.mutateAsync({
        id: activity.id,
        grantId,
        dto: {
          name: values.name,
          startDate: values.startDate,
          endDate: values.endDate,
          plannedBudget: Number(values.plannedBudget),
          description: values.description || undefined,
          responsibleUserId: values.responsibleUserId || undefined,
        },
      });

      if (stagedFiles.length > 0 && canUpdate) {
        const files = stagedFiles.map((s) => s.file);
        const labels = stagedFiles.map((s) => s.label);
        markAllStagedFiles(setStagedFiles, "uploading");
        try {
          await uploadActivityDocuments(activity.id, files, labels);
          markAllStagedFiles(setStagedFiles, "success");
          refreshDocuments();
        } catch (uploadErr: unknown) {
          const msg =
            (uploadErr as { response?: { data?: { message?: string } }; message?: string })
              ?.response?.data?.message ??
            (uploadErr as { message?: string })?.message ??
            "Document upload failed";
          markAllStagedFiles(setStagedFiles, "error", msg);
          setSubmitError(`Activity saved, but document upload failed: ${msg}`);
          setIsSaving(false);
          return;
        }
      }

      onOpenChange(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to update activity";
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && <FormErrorBanner message={submitError} />}

            <FormField label="Activity Name" htmlFor="edit-activity-name" required error={errors.name?.message}>
              <Input id="edit-activity-name" {...register("name")} />
            </FormField>

            <FormField label="Activity Code" htmlFor="edit-activity-code">
              <Input id="edit-activity-code" disabled {...register("code")} />
            </FormField>

            <FormField
              label="Planned Budget"
              htmlFor="edit-activity-budget"
              required
              error={errors.plannedBudget?.message}
            >
              <Input id="edit-activity-budget" type="number" min="0" step="0.01" {...register("plannedBudget")} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Start Date" htmlFor="edit-activity-start" required error={errors.startDate?.message}>
                <Input id="edit-activity-start" type="date" {...register("startDate")} />
              </FormField>
              <FormField label="End Date" htmlFor="edit-activity-end" required error={errors.endDate?.message}>
                <Input id="edit-activity-end" type="date" {...register("endDate")} />
              </FormField>
            </div>

            <FormField label="Responsible Person" htmlFor="edit-activity-responsible">
              <Select
                value={watch("responsibleUserId") || ""}
                onValueChange={(v) => setValue("responsibleUserId", v)}
              >
                <SelectTrigger id="edit-activity-responsible" disabled={loadingUsers}>
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

            <FormField label="Description" htmlFor="edit-activity-description">
              <Textarea id="edit-activity-description" rows={3} {...register("description")} />
            </FormField>

            {canRead && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attached Documents</p>
                {loadingDocs ? (
                  <p className="text-sm text-muted-foreground">Loading documents…</p>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents attached yet.</p>
                ) : (
                  <ul className="divide-y rounded-lg border">
                    {documents.map((doc) => (
                      <li key={doc.id} className="flex items-center gap-3 px-3 py-2.5">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{doc.fileName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {doc.originalName} · {formatBytes(doc.fileSize)}
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-primary hover:underline"
                          aria-label={`Download ${doc.originalName}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        {canUpdate && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(doc)}
                            aria-label={`Delete ${doc.originalName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <PermissionGate permission="ACTIVITIES:UPDATE">
              <SupportingDocumentsField
                documentLabels={ACTIVITY_DOCUMENT_LABELS}
                stagedFiles={stagedFiles}
                onStagedFilesChange={setStagedFiles}
                onValidationError={setSubmitError}
                defaultLabel="Terms of Reference (TOR)"
              />
            </PermissionGate>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || updateActivity.isPending}>
                {isSaving || updateActivity.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete document?"
        description={`Remove "${deleteTarget?.fileName ?? deleteTarget?.originalName}" from this activity?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteDocument}
      />
    </>
  );
}
