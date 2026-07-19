"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { PafCreateDialog } from "@/components/procurement/paf-create-dialog";
import {
  useRfq,
  useRfqComparison,
  useAwardRfqVendor,
  usePafs,
} from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { extractApiError } from "@/lib/api-errors";

interface ComparisonVendor {
  id: string;
  vendorId: string;
  quotedAmount?: number | string | null;
  currency?: string | null;
  deliveryDays?: number | null;
  warrantyTerms?: string | null;
  technicalScore?: number | string;
  committeeScore?: number | string;
  totalScore?: number | string;
  isWinner?: boolean;
  vendor?: { id: string; name: string };
}

export default function RFQComparePage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = params.id as string;

  const { data: rfqData, isLoading: loadingRfq } = useRfq(rfqId);
  const { data: comparison, isLoading: loadingComparison } = useRfqComparison(rfqId);
  const { data: pafsData } = usePafs({ rfqId });
  const awardVendor = useAwardRfqVendor();

  const [pafDialogOpen, setPafDialogOpen] = useState(false);
  const [pendingAward, setPendingAward] = useState<ComparisonVendor | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createdPafId, setCreatedPafId] = useState<string | null>(null);

  if (loadingRfq || loadingComparison) return <LoadingSkeleton variant="cards" />;

  const rfq = rfqData as {
    id: string;
    serialNumber: string;
    title: string;
    status: string;
    prId: string;
    vendors: ComparisonVendor[];
  } | undefined;

  if (!rfq || !comparison) {
    return <div className="py-12 text-center text-muted-foreground">RFQ not found.</div>;
  }

  const vendors = (comparison.vendors ?? []) as ComparisonVendor[];
  const pafList = getPaginatedItems(pafsData);
  const existingPaf = pafList[0] as { id?: string } | undefined;
  const pafId = createdPafId ?? existingPaf?.id;
  const winner = rfq.vendors.find((v) => v.isWinner) ?? vendors.find((v) => v.isWinner);

  const handleAward = (vendor: ComparisonVendor) => {
    setActionError(null);
    awardVendor.mutate(
      { id: rfqId, rfqVendorId: vendor.id },
      {
        onSuccess: () => {
          setPendingAward(vendor);
          setPafDialogOpen(true);
        },
        onError: (err) => setActionError(extractApiError(err, "Failed to award vendor")),
      },
    );
  };

  const buildPoUrl = () => {
    const params = new URLSearchParams({ prId: rfq.prId, rfqId });
    const vendorId = winner?.vendorId ?? pendingAward?.vendorId;
    if (vendorId) params.set("vendorId", vendorId);
    if (pafId) params.set("pafId", pafId);
    return `/procurement/purchase-orders/new?${params.toString()}`;
  };

  return (
    <div>
      <PageHeader
        title={`Vendor Comparison — ${rfq.serialNumber}`}
        description={rfq.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "RFQ", href: "/procurement/rfq" },
          { label: rfq.serialNumber, href: `/procurement/rfq/${rfqId}` },
          { label: "Compare" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            {rfq.status === "AWARDED" && pafId && (
              <PermissionGate permission="PURCHASE_ORDERS:CREATE">
                <Button asChild>
                  <Link href={buildPoUrl()}>
                    <ShoppingCart className="h-4 w-4" />
                    Create PO
                  </Link>
                </Button>
              </PermissionGate>
            )}
            <Button variant="outline" asChild>
              <Link href={`/procurement/rfq/${rfqId}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to RFQ
              </Link>
            </Button>
          </div>
        }
      />

      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {vendors.length === 0 ? (
        <p className="text-muted-foreground">No vendor quotations submitted yet.</p>
      ) : (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {vendors.map((vendor) => (
              <Card
                key={vendor.id}
                className={cn(vendor.isWinner && "border-success ring-2 ring-success/20")}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{vendor.vendor?.name ?? "—"}</CardTitle>
                    {vendor.isWinner && (
                      <Badge variant="success" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        Winner
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      {vendor.quotedAmount != null
                        ? formatCurrency(Number(vendor.quotedAmount), vendor.currency ?? "USD")
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{vendor.deliveryDays != null ? `${vendor.deliveryDays} days` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Score</span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      {vendor.totalScore != null ? Number(vendor.totalScore) : "—"}
                    </span>
                  </div>
                  {rfq.status !== "AWARDED" && (
                    <PermissionGate permission="RFQ:APPROVE">
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleAward(vendor)}
                        disabled={awardVendor.isPending}
                      >
                        Award Vendor
                      </Button>
                    </PermissionGate>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Technical</TableHead>
                    <TableHead>Committee</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow
                      key={vendor.id}
                      className={cn(vendor.isWinner && "bg-success/5")}
                    >
                      <TableCell className="font-medium">
                        {vendor.vendor?.name ?? "—"}
                        {vendor.isWinner && (
                          <Trophy className="ml-2 inline h-4 w-4 text-success" />
                        )}
                      </TableCell>
                      <TableCell>
                        {vendor.quotedAmount != null
                          ? formatCurrency(Number(vendor.quotedAmount), vendor.currency ?? "USD")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {vendor.deliveryDays != null ? `${vendor.deliveryDays} days` : "—"}
                      </TableCell>
                      <TableCell>{vendor.warrantyTerms ?? "—"}</TableCell>
                      <TableCell>
                        {vendor.technicalScore != null ? Number(vendor.technicalScore) : "—"}
                      </TableCell>
                      <TableCell>
                        {vendor.committeeScore != null ? Number(vendor.committeeScore) : "—"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {vendor.totalScore != null ? Number(vendor.totalScore) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {rfq.status === "AWARDED" && !pafId && winner && (
        <div className="mt-6">
          <Button onClick={() => {
            setPendingAward(winner);
            setPafDialogOpen(true);
          }}>
            Complete PAF
          </Button>
        </div>
      )}

      {(pendingAward || winner) && (
        <PafCreateDialog
          open={pafDialogOpen}
          onOpenChange={setPafDialogOpen}
          rfqId={rfqId}
          rfqVendorId={(pendingAward ?? winner)!.id}
          vendorName={(pendingAward ?? winner)?.vendor?.name}
          onSuccess={(id) => {
            setCreatedPafId(id);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
