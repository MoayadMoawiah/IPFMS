"use client";

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  AlertCircle,
  CheckCircle2,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Loader2,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const GRANT_DOCUMENT_LABELS = [
  "Grant Agreement",
  "Grant Budget",
  "Work Plan",
  "Reporting Template",
  "Amendment",
  "Other",
] as const;

export const ACTIVITY_DOCUMENT_LABELS = [
  "Terms of Reference (TOR)",
  "Work Plan",
  "Budget Breakdown",
  "Monitoring Plan",
  "Other",
] as const;

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

export const ACCEPT_DOCUMENT_ATTR = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
export const MAX_DOCUMENT_FILES = 10;
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

export type UploadStatus = "pending" | "uploading" | "success" | "error";

export interface StagedFile {
  id: string;
  file: File;
  label: string;
  status: UploadStatus;
  error?: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function updateStagedFileStatus(
  setStagedFiles: Dispatch<SetStateAction<StagedFile[]>>,
  id: string,
  status: UploadStatus,
  error?: string,
) {
  setStagedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status, error } : f)));
}

export function markAllStagedFiles(
  setStagedFiles: Dispatch<SetStateAction<StagedFile[]>>,
  status: UploadStatus,
  error?: string,
) {
  setStagedFiles((prev) => prev.map((f) => ({ ...f, status, error })));
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
  if (mimeType.startsWith("image/")) return <FileImage className="h-4 w-4 text-blue-500" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function StatusIcon({ status }: { status: UploadStatus }) {
  if (status === "uploading") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "error") return <AlertCircle className="h-4 w-4 text-destructive" />;
  return null;
}

interface SupportingDocumentsFieldProps {
  documentLabels: readonly string[];
  stagedFiles: StagedFile[];
  onStagedFilesChange: (files: StagedFile[]) => void;
  onValidationError?: (message: string) => void;
  defaultLabel?: string;
  disabled?: boolean;
}

export function SupportingDocumentsField({
  documentLabels,
  stagedFiles,
  onStagedFilesChange,
  onValidationError,
  defaultLabel = "Other",
  disabled = false,
}: SupportingDocumentsFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      const valid: StagedFile[] = [];
      const errs: string[] = [];

      for (const file of arr) {
        if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
          errs.push(`"${file.name}" has an unsupported file type.`);
          continue;
        }
        if (file.size > MAX_DOCUMENT_SIZE) {
          errs.push(`"${file.name}" exceeds the 20 MB size limit.`);
          continue;
        }
        valid.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          label: defaultLabel,
          status: "pending",
        });
      }

      const combined = [...stagedFiles, ...valid];
      if (combined.length > MAX_DOCUMENT_FILES) {
        errs.push(`Only ${MAX_DOCUMENT_FILES} files are allowed per upload.`);
        onStagedFilesChange(combined.slice(0, MAX_DOCUMENT_FILES));
      } else {
        onStagedFilesChange(combined);
      }

      if (errs.length) onValidationError?.(errs.join(" "));
    },
    [defaultLabel, onStagedFilesChange, onValidationError, stagedFiles],
  );

  const removeFile = (id: string) =>
    onStagedFilesChange(stagedFiles.filter((f) => f.id !== id));

  const updateLabel = (id: string, label: string) =>
    onStagedFilesChange(stagedFiles.map((f) => (f.id === id ? { ...f, label } : f)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Supporting Documents
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional — up to {MAX_DOCUMENT_FILES} files, max 20 MB each)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload documents"
          aria-disabled={disabled}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            if (disabled) return;
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
          }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && !disabled && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            ${isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
            }`}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Drag & drop files here, or{" "}
              <span className="text-primary underline-offset-4 hover:underline">click to browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_DOCUMENT_ATTR}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {stagedFiles.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {stagedFiles.map((sf) => (
              <li key={sf.id} className="flex items-center gap-3 px-3 py-2.5">
                <FileIcon mimeType={sf.file.type} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" title={sf.file.name}>
                    {sf.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(sf.file.size)}
                    {sf.error && <span className="ml-2 text-destructive">{sf.error}</span>}
                  </p>
                </div>
                <Select
                  value={sf.label}
                  onValueChange={(v) => updateLabel(sf.id, v)}
                  disabled={disabled || sf.status === "uploading" || sf.status === "success"}
                >
                  <SelectTrigger className="h-8 w-44 shrink-0 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentLabels.map((l) => (
                      <SelectItem key={l} value={l} className="text-xs">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <StatusIcon status={sf.status} />
                {!disabled && sf.status !== "uploading" && sf.status !== "success" && (
                  <button
                    type="button"
                    onClick={() => removeFile(sf.id)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    aria-label={`Remove ${sf.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
