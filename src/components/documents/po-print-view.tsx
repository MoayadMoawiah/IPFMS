"use client";

import { PrintDocumentShell } from "@/components/documents/print-document-shell";
import { OfficialSignOffBlock } from "@/components/documents/official-sign-off-block";
import { SupplierAcceptanceBlock } from "@/components/documents/supplier-acceptance-block";
import { buildOfficialSignOff } from "@/lib/documents/sign-off";
import { numberToWords } from "@/lib/number-to-words";
import { formatCurrency, formatDate } from "@/lib/formatters";

export interface PoPrintData {
  serialNumber: string;
  title: string;
  status: string;
  currency: string;
  subtotal?: number | string;
  taxAmount?: number | string;
  totalAmount: number | string;
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  terms?: string | null;
  notes?: string | null;
  issuedAt?: string | null;
  createdAt: string;
  vendor?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    bankAccounts?: Array<{
      bankName: string;
      accountName: string;
      accountNumber: string;
      isPrimary?: boolean;
      country?: string | null;
    }>;
  } | null;
  grant?: { code: string; name: string } | null;
  pr?: {
    serialNumber: string;
    requestedBy?: {
      firstName?: string;
      lastName?: string;
      roles?: Array<{ role?: { name?: string } }>;
    } | null;
  } | null;
  rfq?: { serialNumber: string } | null;
  createdBy?: {
    firstName?: string;
    lastName?: string;
    roles?: Array<{ role?: { name?: string } }>;
  } | null;
  items?: Array<{
    id: string;
    description: string;
    unit: string;
    orderedQuantity: number | string;
    unitPrice: number | string;
    totalPrice: number | string;
  }>;
  workflow?: {
    steps?: Array<{
      stepNumber: number;
      stepName?: string;
      status?: string;
      action?: string | null;
      completedAt?: string | null;
      digitalSignature?: {
        signedAt?: string | null;
        user?: {
          firstName?: string;
          lastName?: string;
          roles?: Array<{ role?: { name?: string } }>;
        } | null;
      } | null;
    }>;
    actions?: Array<{
      action?: string | null;
      actionAt?: string | null;
      actor?: {
        firstName?: string;
        lastName?: string;
        roles?: Array<{ role?: { name?: string } }>;
      } | null;
    }>;
  } | null;
}

export function PoPrintView({ po }: { po: PoPrintData }) {
  const items = po.items ?? [];
  const subtotal = Number(po.subtotal ?? po.totalAmount);
  const tax = Number(po.taxAmount ?? 0);
  const total = Number(po.totalAmount);
  const bank =
    po.vendor?.bankAccounts?.find((b) => b.isPrimary) ?? po.vendor?.bankAccounts?.[0];

  const signOff = buildOfficialSignOff({
    requestedByUser: po.createdBy ?? po.pr?.requestedBy,
    requestedAt: po.createdAt,
    steps: po.workflow?.steps,
    actions: po.workflow?.actions,
  });

  const vendorAddress = [po.vendor?.address, po.vendor?.city].filter(Boolean).join(", ");

  return (
    <PrintDocumentShell title="Purchase Order – PO" documentNumber={po.serialNumber}>
      <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Account No / Grant:</span>{" "}
            {po.grant ? `${po.grant.code}` : "—"}
          </p>
          <p>
            <span className="font-semibold">Currency:</span> {po.currency}
          </p>
          <p>
            <span className="font-semibold">Delivery Date:</span>{" "}
            {po.deliveryDate ? formatDate(po.deliveryDate) : "—"}
          </p>
          <p>
            <span className="font-semibold">Currency &amp; Payment Terms:</span>{" "}
            {po.terms || "—"}
          </p>
        </div>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Status:</span> {po.status}
          </p>
          <p>
            <span className="font-semibold">Issue Date:</span>{" "}
            {formatDate(po.issuedAt ?? po.createdAt)}
          </p>
          {po.pr && (
            <p>
              <span className="font-semibold">PR Ref:</span> {po.pr.serialNumber}
            </p>
          )}
          {po.rfq && (
            <p>
              <span className="font-semibold">RFQ Ref:</span> {po.rfq.serialNumber}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 grid gap-4 text-sm sm:grid-cols-2">
        <div className="border border-black p-2">
          <p className="mb-1 font-bold underline">Issued To:</p>
          <p className="font-medium">{po.vendor?.name ?? "—"}</p>
          {vendorAddress && <p>{vendorAddress}</p>}
          {po.vendor?.email && <p>{po.vendor.email}</p>}
          {po.vendor?.phone && <p>{po.vendor.phone}</p>}
        </div>
        <div className="border border-black p-2">
          <p className="mb-1 font-bold underline">Ship To:</p>
          <p>{po.deliveryAddress || "—"}</p>
          <p className="mt-2">
            <span className="font-semibold">Delivery Terms:</span> {po.terms || "—"}
          </p>
        </div>
      </div>

      <div className="mb-4 text-sm">
        <p className="font-bold">Title / Description</p>
        <p>{po.title}</p>
        {po.notes && (
          <>
            <p className="mt-2 font-bold">Additional Instructions:</p>
            <p>{po.notes}</p>
          </>
        )}
      </div>

      <table className="gaderon-print-table mb-4 w-full text-sm">
        <thead>
          <tr className="bg-neutral-100">
            <th className="w-10 text-left">No</th>
            <th className="text-left">Description</th>
            <th className="w-20 text-right">Quantity</th>
            <th className="w-16 text-left">Unit</th>
            <th className="w-28 text-right">Unit Cost</th>
            <th className="w-28 text-right">Extended Cost</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No line items
              </td>
            </tr>
          ) : (
            items.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.description}</td>
                <td className="text-right">{Number(item.orderedQuantity)}</td>
                <td>{item.unit}</td>
                <td className="text-right">
                  {formatCurrency(Number(item.unitPrice), po.currency)}
                </td>
                <td className="text-right">
                  {formatCurrency(Number(item.totalPrice), po.currency)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mb-6 ml-auto w-full max-w-sm text-sm">
        <div className="flex justify-between border-b border-black py-1">
          <span>Total EX-works</span>
          <span>{formatCurrency(subtotal, po.currency)}</span>
        </div>
        <div className="flex justify-between border-b border-black/40 py-1">
          <span>Taxes</span>
          <span>{formatCurrency(tax, po.currency)}</span>
        </div>
        <div className="flex justify-between border-b border-black/40 py-1">
          <span>Shipping</span>
          <span>{formatCurrency(0, po.currency)}</span>
        </div>
        <div className="flex justify-between border-b border-black/40 py-1">
          <span>Insurance</span>
          <span>{formatCurrency(0, po.currency)}</span>
        </div>
        <div className="flex justify-between border-b-2 border-black py-1 font-bold">
          <span>Total Value</span>
          <span>{formatCurrency(total, po.currency)}</span>
        </div>
        <p className="mt-2 text-xs italic">
          <span className="font-semibold not-italic">Total in words: </span>
          {numberToWords(total, po.currency)}
        </p>
      </div>

      <div className="print-page-break-before space-y-4">
        <OfficialSignOffBlock slots={signOff} />
        <SupplierAcceptanceBlock
          vendorName={po.vendor?.name}
          bankName={bank?.bankName}
          accountName={bank?.accountName}
          branchName={bank?.country}
          accountNumber={bank?.accountNumber}
          date={po.issuedAt ?? po.createdAt}
        />
      </div>
    </PrintDocumentShell>
  );
}
