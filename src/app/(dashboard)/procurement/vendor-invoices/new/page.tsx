"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  useCreateVendorInvoice,
  useGoodsReceipt,
  usePurchaseOrders,
} from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";
import { formatCurrency } from "@/lib/formatters";

function NewVendorInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPoId = searchParams.get("poId") ?? "";
  const preselectedGrnId = searchParams.get("grnId") ?? "";

  const { data: poData } = usePurchaseOrders({ limit: 100 });
  const { data: grnData, isLoading: loadingGrn } = useGoodsReceipt(preselectedGrnId);
  const createInvoice = useCreateVendorInvoice();

  const pos = useMemo(() => {
    return (
      getPaginatedItems(poData) as Array<{
        id: string;
        serialNumber: string;
        title?: string;
        status: string;
        totalAmount: number | string;
        currency: string;
        vendor?: { id?: string; name?: string };
      }>
    ).filter((po) => {
      const status = po.status.toUpperCase();
      return status === "APPROVED" || status === "ISSUED";
    });
  }, [poData]);

  const grn = grnData as
    | {
        id: string;
        serialNumber: string;
        status: string;
        poId: string;
        notes?: string | null;
        po?: {
          id: string;
          serialNumber: string;
          currency?: string;
          totalAmount?: number | string;
          vendor?: { name?: string };
        };
        items?: Array<{
          acceptedQuantity: number | string;
          poItem?: { unitPrice?: number | string };
        }>;
      }
    | undefined;

  const grnPoId = grn?.poId ?? grn?.po?.id ?? "";
  const [poId, setPoId] = useState(preselectedPoId || grnPoId);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!grn) return;
    if (grn.poId || grn.po?.id) {
      setPoId(grn.poId || grn.po!.id);
    }
    setNotes((prev) => prev || `Invoice for GRN ${grn.serialNumber}`);
  }, [grn]);

  const selectedPo = pos.find((p) => p.id === poId);

  const grnSubtotal = useMemo(() => {
    if (!grn?.items?.length) return null;
    return grn.items.reduce((sum, item) => {
      const accepted = Number(item.acceptedQuantity) || 0;
      const unitPrice = Number(item.poItem?.unitPrice) || 0;
      return sum + accepted * unitPrice;
    }, 0);
  }, [grn]);

  const subtotal =
    grnSubtotal !== null
      ? grnSubtotal
      : selectedPo
        ? Number(selectedPo.totalAmount)
        : 0;
  const tax = Number(taxAmount) || 0;
  const total = subtotal + tax;
  const currency = selectedPo?.currency || grn?.po?.currency || "USD";
  const fromGrn = Boolean(preselectedGrnId && grn);
  const grnApproved = grn?.status?.toUpperCase() === "APPROVED";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!poId || !invoiceNumber.trim()) {
      setError("PO and vendor invoice number are required");
      return;
    }
    if (preselectedGrnId && !grnApproved) {
      setError("Only an APPROVED GRN can be used to create a vendor invoice");
      return;
    }

    createInvoice.mutate(
      {
        poId,
        grnId: preselectedGrnId || undefined,
        invoiceNumber: invoiceNumber.trim(),
        invoiceDate,
        dueDate: dueDate || undefined,
        subtotal,
        taxAmount: tax,
        totalAmount: total,
        currency,
        notes: notes || undefined,
      },
      {
        onSuccess: (invoice: { id: string }) => {
          router.push(`/procurement/vendor-invoices/${invoice.id}`);
        },
        onError: (err) =>
          setError(extractApiError(err, "Failed to create vendor invoice")),
      },
    );
  };

  if (preselectedGrnId && loadingGrn) {
    return <LoadingSkeleton variant="cards" />;
  }

  if (preselectedGrnId && (!grn || !grnApproved)) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <p className="text-sm">
          Goods receipt not found or not approved. Only approved GRNs can create
          an invoice.
        </p>
        <Button variant="outline" asChild>
          <Link href="/procurement/goods-receipt">Back to Goods Receipts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New Vendor Invoice"
        description={
          fromGrn
            ? `Create invoice from approved GRN ${grn?.serialNumber}`
            : "Record a supplier invoice against an approved or issued PO"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Vendor Invoices", href: "/procurement/vendor-invoices" },
          { label: "New" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                preselectedGrnId
                  ? `/procurement/goods-receipt/${preselectedGrnId}`
                  : "/procurement/vendor-invoices"
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Invoice details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {fromGrn ? (
              <div className="rounded-md border px-3 py-2 text-sm">
                <p className="font-medium">GRN: {grn?.serialNumber}</p>
                <p className="text-muted-foreground">
                  PO: {grn?.po?.serialNumber ?? "—"} · Vendor:{" "}
                  {grn?.po?.vendor?.name ?? selectedPo?.vendor?.name ?? "—"}
                </p>
                <p className="text-muted-foreground">
                  Amount from accepted quantities:{" "}
                  {formatCurrency(subtotal, currency)}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="poId">Purchase Order</Label>
                <Select value={poId} onValueChange={setPoId}>
                  <SelectTrigger id="poId">
                    <SelectValue placeholder="Select approved/issued PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {pos.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.serialNumber} — {po.vendor?.name ?? "Vendor"} (
                        {po.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!fromGrn && selectedPo && (
              <p className="text-sm text-muted-foreground">
                PO total: {formatCurrency(subtotal, selectedPo.currency)} ·
                Vendor: {selectedPo.vendor?.name ?? "—"}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Vendor invoice number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax amount</Label>
              <Input
                id="taxAmount"
                type="number"
                min="0"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />
            </div>

            <p className="text-sm font-medium">
              Invoice total: {formatCurrency(total, currency)}
            </p>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={createInvoice.isPending}>
              {createInvoice.isPending ? "Creating…" : "Create invoice"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewVendorInvoicePage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewVendorInvoiceForm />
    </Suspense>
  );
}
