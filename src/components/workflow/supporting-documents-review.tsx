"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ExternalLink, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/components/forms/supporting-documents-field";
import type { SupportingDocument } from "@/lib/api/uploads";

const SOURCE_LABELS: Record<SupportingDocument["source"], string> = {
  pr: "Purchase requisition",
  po: "Purchase order",
  grn: "Goods receipt",
  invoice: "Vendor invoice",
  payment_request: "Payment request",
  payment_voucher: "Payment voucher",
};

const SOURCE_ORDER: SupportingDocument["source"][] = [
  "pr",
  "po",
  "grn",
  "invoice",
  "payment_request",
  "payment_voucher",
];

export type SupportingDocumentsReviewProps = {
  documents: SupportingDocument[];
  isLoading?: boolean;
  /** When true, show Reviewed / Not reviewed and count toward allReviewed. */
  requireReview?: boolean;
  title?: string;
  emptyMessage?: string;
  /** Optional actions rendered in the card header (e.g. upload). */
  headerActions?: ReactNode;
  /** Optional per-row actions for editable own docs (e.g. delete). */
  renderRowActions?: (doc: SupportingDocument) => ReactNode;
};

export type SupportingDocumentsReviewState = {
  allReviewed: boolean;
  viewedCount: number;
  totalCount: number;
  viewedAttachmentIds: Set<string>;
  approveDisabledReason: string | undefined;
  markViewed: (id: string) => void;
};

/**
 * Controlled helper: use this when the parent needs allReviewed for Approve gating.
 * Pair with SupportingDocumentsReview by lifting viewed state, or use the combined
 * SupportingDocumentsReviewPanel which owns viewed state and reports via onReviewChange.
 */
export function useSupportingDocumentsReview(
  documents: SupportingDocument[],
  requireReview: boolean,
): SupportingDocumentsReviewState {
  const [viewedAttachmentIds, setViewedAttachmentIds] = useState<Set<string>>(
    () => new Set(),
  );

  const totalCount = documents.length;
  const viewedCount = documents.filter((d) =>
    viewedAttachmentIds.has(d.id),
  ).length;
  const allReviewed = !requireReview || totalCount === 0 || viewedCount === totalCount;

  const markViewed = (id: string) => {
    setViewedAttachmentIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return {
    allReviewed,
    viewedCount,
    totalCount,
    viewedAttachmentIds,
    approveDisabledReason:
      requireReview && !allReviewed
        ? "Open all attachments before approving"
        : undefined,
    markViewed,
  };
}

export function SupportingDocumentsReview({
  documents,
  isLoading = false,
  requireReview = false,
  title = "Supporting documents",
  emptyMessage = "No supporting documents.",
  headerActions,
  renderRowActions,
  viewedAttachmentIds,
  onOpen,
}: SupportingDocumentsReviewProps & {
  viewedAttachmentIds: Set<string>;
  onOpen: (doc: SupportingDocument) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<SupportingDocument["source"], SupportingDocument[]>();
    for (const source of SOURCE_ORDER) map.set(source, []);
    for (const doc of documents) {
      const list = map.get(doc.source) ?? [];
      list.push(doc);
      map.set(doc.source, list);
    }
    return SOURCE_ORDER.filter((s) => (map.get(s)?.length ?? 0) > 0).map(
      (source) => ({ source, docs: map.get(source)! }),
    );
  }, [documents]);

  const viewedCount = documents.filter((d) =>
    viewedAttachmentIds.has(d.id),
  ).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            {title}
          </CardTitle>
          {requireReview && documents.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Opened {viewedCount} of {documents.length} — open all before
              approving
            </p>
          )}
        </div>
        {headerActions}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading documents…</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {grouped.map(({ source, docs }) => (
              <div key={source}>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {SOURCE_LABELS[source]}
                </p>
                <ul className="divide-y rounded-md border">
                  {docs.map((doc) => {
                    const reviewed = viewedAttachmentIds.has(doc.id);
                    return (
                      <li
                        key={doc.id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {doc.fileName}
                            {requireReview && (
                              <span
                                className={
                                  reviewed
                                    ? "ml-2 text-xs font-normal text-emerald-600"
                                    : "ml-2 text-xs font-normal text-amber-600"
                                }
                              >
                                {reviewed ? "Reviewed" : "Not reviewed"}
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {doc.originalName}
                            {doc.fileSize > 0
                              ? ` · ${formatBytes(doc.fileSize)}`
                              : ""}
                            {doc.uploadedBy &&
                              ` · ${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => onOpen(doc)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </Button>
                        {renderRowActions?.(doc)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
