"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  useCreateGoodsReceipt,
  usePurchaseOrder,
  usePurchaseOrders,
} from "@/hooks/use-procurement";
import { useWarehouses } from "@/hooks/use-inventory";
import { getPaginatedItems } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";

type PoItemRow = {
  id: string;
  description: string;
  unit?: string;
  orderedQuantity: number | string;
  receivedQuantity?: number | string;
};

type LineDecision = "accepted" | "rejected" | null;

type LineDraft = {
  poItemId: string;
  description: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damagedQuantity: number;
  decision: LineDecision;
  notes: string;
};

function remainingQty(item: PoItemRow): number {
  const ordered = Number(item.orderedQuantity) || 0;
  const received = Number(item.receivedQuantity) || 0;
  return Math.max(0, ordered - received);
}

function NewGoodsReceiptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPoId = searchParams.get("poId") ?? "";

  const [poId, setPoId] = useState(preselectedPoId);
  const { data: poData, isLoading: loadingPo, isError: poError } = usePurchaseOrder(poId);
  const { data: poListData } = usePurchaseOrders({ limit: 100 });
  const { data: warehousesData, isLoading: loadingWarehouses } = useWarehouses({
    limit: 100,
  });
  const createGrn = useCreateGoodsReceipt();

  const selectablePos = useMemo(() => {
    return (
      getPaginatedItems(poListData) as Array<{
        id: string;
        serialNumber: string;
        status: string;
        vendor?: { name?: string };
      }>
    ).filter((po) => {
      const status = po.status.toUpperCase();
      return status === "APPROVED" || status === "ISSUED";
    });
  }, [poListData]);

  const warehouses = getPaginatedItems(warehousesData) as Array<{
    id: string;
    name: string;
    code?: string;
  }>;

  const po = poData as
    | {
        id: string;
        serialNumber: string;
        title?: string;
        status: string;
        notes?: string | null;
        deliveryAddress?: string | null;
        vendor?: { name?: string } | null;
        items?: PoItemRow[];
      }
    | undefined;

  const [warehouseId, setWarehouseId] = useState("");
  const [receiptDate, setReceiptDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [deliveryNote, setDeliveryNote] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prefilledForPo, setPrefilledForPo] = useState<string | null>(null);

  useEffect(() => {
    if (!po || prefilledForPo === po.id) return;
    const status = po.status.toUpperCase();
    if (status !== "ISSUED" && status !== "APPROVED") return;

    setNotes(po.notes ?? "");
    setDeliveryNote(po.deliveryAddress ?? "");
    setLines(
      (po.items ?? []).map((item) => {
        const remaining = remainingQty(item);
        return {
          poItemId: item.id,
          description: item.description,
          orderedQuantity: Number(item.orderedQuantity) || 0,
          deliveredQuantity: remaining,
          acceptedQuantity: remaining,
          rejectedQuantity: 0,
          damagedQuantity: 0,
          decision: null as LineDecision,
          notes: "",
        };
      }),
    );
    setPrefilledForPo(po.id);
  }, [po, prefilledForPo]);

  const updateLine = (
    index: number,
    field: keyof Omit<LineDraft, "poItemId" | "description" | "decision" | "notes">,
    value: number,
  ) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        const next = { ...line, [field]: value };
        if (
          field === "acceptedQuantity" ||
          field === "rejectedQuantity" ||
          field === "deliveredQuantity"
        ) {
          next.decision = null;
        }
        return next;
      }),
    );
  };

  const updateLineNotes = (index: number, notes: string) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, notes } : line)),
    );
  };

  const acceptLine = (index: number) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        return {
          ...line,
          acceptedQuantity: line.deliveredQuantity,
          rejectedQuantity: 0,
          decision: "accepted",
          notes: "",
        };
      }),
    );
  };

  const rejectLine = (index: number) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        return {
          ...line,
          acceptedQuantity: 0,
          rejectedQuantity: line.deliveredQuantity,
          decision: "rejected",
        };
      }),
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!poId) {
      setError("Select a purchase order");
      return;
    }
    if (!po) {
      setError("Purchase order could not be loaded");
      return;
    }
    const status = po.status.toUpperCase();
    if (status !== "ISSUED" && status !== "APPROVED") {
      setError("PO must be APPROVED or ISSUED to create a GRN");
      return;
    }
    if (lines.length === 0) {
      setError("PO has no line items to receive");
      return;
    }

    const missingRejectReason = lines.some(
      (line) =>
        (line.decision === "rejected" || line.rejectedQuantity > 0) &&
        !line.notes.trim(),
    );
    if (missingRejectReason) {
      setError("Rejection reason is required for rejected items");
      return;
    }

    createGrn.mutate(
      {
        poId,
        warehouseId: warehouseId || undefined,
        receiptDate,
        deliveryNote: deliveryNote || undefined,
        notes: notes || undefined,
        items: lines.map((line) => ({
          poItemId: line.poItemId,
          description: line.description,
          orderedQuantity: line.orderedQuantity,
          deliveredQuantity: line.deliveredQuantity,
          acceptedQuantity: line.acceptedQuantity,
          rejectedQuantity: line.rejectedQuantity,
          damagedQuantity: line.damagedQuantity,
          notes: line.notes.trim() || undefined,
        })),
      },
      {
        onSuccess: (grn: { id: string }) => {
          router.push(`/procurement/goods-receipt/${grn.id}`);
        },
        onError: (err) =>
          setError(extractApiError(err, "Failed to create goods receipt")),
      },
    );
  };

  if (poId && loadingPo) return <LoadingSkeleton variant="cards" />;

  if (poId && (poError || !po)) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <p className="text-sm">Purchase order not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/procurement/goods-receipt">Back to Goods Receipts</Link>
        </Button>
      </div>
    );
  }

  if (po) {
    const status = po.status.toUpperCase();
    if (status !== "ISSUED" && status !== "APPROVED") {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-destructive">
          <p className="text-sm">
            Only APPROVED or ISSUED purchase orders can have a GRN.
          </p>
          <Button variant="outline" asChild>
            <Link href={`/procurement/purchase-orders/${po.id}`}>Back to PO</Link>
          </Button>
        </div>
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="New Goods Receipt"
        description="Create a draft GRN from an approved or issued purchase order"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Goods Receipt", href: "/procurement/goods-receipt" },
          { label: "New" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                poId
                  ? `/procurement/purchase-orders/${poId}`
                  : "/procurement/goods-receipt"
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>PO & receipt details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poId">Purchase Order</Label>
              {preselectedPoId && po ? (
                <div className="rounded-md border px-3 py-2 text-sm">
                  <p className="font-medium">{po.serialNumber}</p>
                  <p className="text-muted-foreground">
                    {po.title || "—"} · {po.vendor?.name ?? "—"} · {po.status}
                  </p>
                </div>
              ) : (
                <Select
                  value={poId}
                  onValueChange={(id) => {
                    setPoId(id);
                    setPrefilledForPo(null);
                    setLines([]);
                  }}
                >
                  <SelectTrigger id="poId">
                    <SelectValue placeholder="Select approved/issued PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectablePos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.serialNumber} — {p.vendor?.name ?? "Vendor"} ({p.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="warehouseId">Warehouse</Label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger id="warehouseId" disabled={loadingWarehouses}>
                    <SelectValue
                      placeholder={
                        loadingWarehouses
                          ? "Loading warehouses…"
                          : "Select warehouse (optional)"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.code ? `${w.code} — ${w.name}` : w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptDate">Receipt date</Label>
                <Input
                  id="receiptDate"
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryNote">Delivery note / ship-to</Label>
              <Input
                id="deliveryNote"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent>
            {lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Select a PO to load line items.
              </p>
            ) : (
              <div className="space-y-4">
                {lines.map((line, index) => (
                  <div
                    key={line.poItemId}
                    className={cn(
                      "grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-6",
                      line.decision === "accepted" &&
                        "border-green-500/60 bg-green-50/50 dark:bg-green-950/20",
                      line.decision === "rejected" &&
                        "border-red-500/60 bg-red-50/50 dark:bg-red-950/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 sm:col-span-2 lg:col-span-2">
                      <div>
                        <p className="text-sm font-medium">{line.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Ordered: {line.orderedQuantity}
                          {line.decision === "accepted" && " · Accepted"}
                          {line.decision === "rejected" && " · Rejected"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          title="Accept item"
                          aria-label="Accept item"
                          className={cn(
                            "h-8 w-8 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800",
                            line.decision === "accepted" &&
                              "bg-green-600 text-white hover:bg-green-600 hover:text-white",
                          )}
                          onClick={() => acceptLine(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          title="Reject item"
                          aria-label="Reject item"
                          className={cn(
                            "h-8 w-8 border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800",
                            line.decision === "rejected" &&
                              "bg-red-600 text-white hover:bg-red-600 hover:text-white",
                          )}
                          onClick={() => rejectLine(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {(
                      [
                        ["deliveredQuantity", "Delivered"],
                        ["acceptedQuantity", "Accepted"],
                        ["rejectedQuantity", "Rejected"],
                        ["damagedQuantity", "Damaged"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs">{label}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          value={line[field]}
                          onChange={(e) =>
                            updateLine(index, field, Number(e.target.value) || 0)
                          }
                        />
                      </div>
                    ))}
                    {(line.decision === "rejected" || line.rejectedQuantity > 0) && (
                      <div className="space-y-1 sm:col-span-2 lg:col-span-6">
                        <Label
                          htmlFor={`reject-reason-${line.poItemId}`}
                          className="text-xs text-red-700"
                        >
                          Rejection reason <span className="text-red-600">*</span>
                        </Label>
                        <Textarea
                          id={`reject-reason-${line.poItemId}`}
                          value={line.notes}
                          onChange={(e) => updateLineNotes(index, e.target.value)}
                          placeholder="Explain why this item is rejected"
                          rows={2}
                          required
                          className="border-red-300 focus-visible:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={createGrn.isPending || !poId}>
          {createGrn.isPending ? "Creating…" : "Create GRN"}
        </Button>
      </form>
    </div>
  );
}

export default function NewGoodsReceiptPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewGoodsReceiptForm />
    </Suspense>
  );
}
