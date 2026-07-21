"use client";

import { PrintDocumentShell } from "@/components/documents/print-document-shell";
import {
  OfficialSignOffBlock,
  type OfficialSignOffTitles,
} from "@/components/documents/official-sign-off-block";
import {
  buildOfficialSignOff,
  type OfficialSignOffSlots,
  type WorkflowActionLike,
  type WorkflowActorLike,
  type WorkflowStepLike,
} from "@/lib/documents/sign-off";
import { numberToWords } from "@/lib/number-to-words";
import { formatCurrency, formatDate } from "@/lib/formatters";

export interface PrintLineItem {
  id: string;
  description: string;
  unit?: string;
  quantity: number | string;
  unitPrice: number | string;
  total: number | string;
}

interface GenericDocPrintViewProps {
  title: string;
  documentNumber: string;
  meta?: Array<{ label: string; value: string }>;
  description?: string | null;
  items?: PrintLineItem[];
  currency?: string;
  totalAmount?: number | string;
  showTotalInWords?: boolean;
  showSignOff?: boolean;
  signOff?: OfficialSignOffSlots;
  signOffTitles?: OfficialSignOffTitles;
  requestedByUser?: WorkflowActorLike | null;
  requestedAt?: string | Date | null;
  steps?: WorkflowStepLike[] | null;
  actions?: WorkflowActionLike[] | null;
  extraSections?: React.ReactNode;
}

export function GenericDocPrintView({
  title,
  documentNumber,
  meta = [],
  description,
  items = [],
  currency = "USD",
  totalAmount,
  showTotalInWords = true,
  showSignOff = true,
  signOff: signOffProp,
  signOffTitles,
  requestedByUser,
  requestedAt,
  steps,
  actions,
  extraSections,
}: GenericDocPrintViewProps) {
  const signOff =
    signOffProp ??
    buildOfficialSignOff({
      requestedByUser,
      requestedAt,
      steps,
      actions,
    });

  const total = totalAmount != null ? Number(totalAmount) : null;

  return (
    <PrintDocumentShell title={title} documentNumber={documentNumber}>
      {meta.length > 0 && (
        <div className="mb-4 grid gap-1 text-sm sm:grid-cols-2">
          {meta.map((m) => (
            <p key={m.label}>
              <span className="font-semibold">{m.label}:</span> {m.value || "—"}
            </p>
          ))}
        </div>
      )}

      {description && (
        <div className="mb-4 text-sm">
          <p className="font-bold">Description</p>
          <p>{description}</p>
        </div>
      )}

      {items.length > 0 && (
        <table className="gaderon-print-table mb-4 w-full text-sm">
          <thead>
            <tr className="bg-neutral-100">
              <th className="w-10 text-left">No</th>
              <th className="text-left">Description</th>
              <th className="w-20 text-right">Qty</th>
              <th className="w-16 text-left">Unit</th>
              <th className="w-28 text-right">Unit Price</th>
              <th className="w-28 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.description}</td>
                <td className="text-right">{Number(item.quantity)}</td>
                <td>{item.unit || "—"}</td>
                <td className="text-right">
                  {formatCurrency(Number(item.unitPrice), currency)}
                </td>
                <td className="text-right">
                  {formatCurrency(Number(item.total), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {total != null && (
        <div className="mb-6 ml-auto w-full max-w-sm text-sm">
          <div className="flex justify-between border-b-2 border-black py-1 font-bold">
            <span>Total Value</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
          {showTotalInWords && (
            <p className="mt-2 text-xs italic">
              <span className="font-semibold not-italic">Total in words: </span>
              {numberToWords(total, currency)}
            </p>
          )}
        </div>
      )}

      {extraSections}

      {showSignOff && (
        <div className="print-page-break-before">
          <OfficialSignOffBlock slots={signOff} titles={signOffTitles} />
        </div>
      )}
    </PrintDocumentShell>
  );
}

export function formatMetaDate(d?: string | Date | null): string {
  if (!d) return "—";
  try {
    return formatDate(d);
  } catch {
    return "—";
  }
}
