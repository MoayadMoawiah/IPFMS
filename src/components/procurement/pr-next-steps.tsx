"use client";

import Link from "next/link";
import { ArrowRight, FileText, MessageSquareQuote, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionGate } from "@/components/auth/permission-gate";
import { RFQ_MIN_AMOUNT_USD } from "@/lib/constants/procurement";

interface RfqSummary {
  id: string;
  serialNumber: string;
  status: string;
}

interface PoSummary {
  id: string;
  serialNumber: string;
  status: string;
  vendor?: { id: string; name: string } | null;
}

interface PafSummary {
  id: string;
  status: string;
  rfqId: string;
  recommendedVendorId?: string | null;
}

interface PrNextStepsProps {
  prId: string;
  status: string;
  procurementRoute?: "RFQ" | "DIRECT_PO";
  rfqs?: RfqSummary[];
  purchaseOrders?: PoSummary[];
  pafForms?: PafSummary[];
}

export function PrNextSteps({
  prId,
  status,
  procurementRoute = "DIRECT_PO",
  rfqs = [],
  purchaseOrders = [],
  pafForms = [],
}: PrNextStepsProps) {
  if (status !== "APPROVED") return null;

  const primaryRfq = rfqs[0];
  const primaryPo = purchaseOrders[0];
  const primaryPaf = pafForms[0];
  const winnerVendorId = primaryPaf?.recommendedVendorId;

  if (procurementRoute === "DIRECT_PO") {
    return (
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRight className="h-4 w-4 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Purchase amount is at or below ${RFQ_MIN_AMOUNT_USD.toLocaleString()} — create a
            Purchase Order directly (RFQ not required).
          </p>
          <div className="flex flex-wrap gap-2">
            {primaryPo ? (
              <Button asChild>
                <Link href={`/procurement/purchase-orders/${primaryPo.id}`}>
                  <ShoppingCart className="h-4 w-4" />
                  View PO — {primaryPo.serialNumber}
                </Link>
              </Button>
            ) : (
              <PermissionGate permission="PURCHASE_ORDERS:CREATE">
                <Button asChild>
                  <Link href={`/procurement/purchase-orders/new?prId=${prId}`}>
                    <ShoppingCart className="h-4 w-4" />
                    Create PO
                  </Link>
                </Button>
              </PermissionGate>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasRespondedVendors = primaryRfq && ["ISSUED", "AWARDED", "CLOSED"].includes(primaryRfq.status);
  const buildPoUrl = () => {
    const params = new URLSearchParams({ prId });
    if (primaryRfq) params.set("rfqId", primaryRfq.id);
    if (winnerVendorId) params.set("vendorId", winnerVendorId);
    if (primaryPaf) params.set("pafId", primaryPaf.id);
    return `/procurement/purchase-orders/new?${params.toString()}`;
  };

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowRight className="h-4 w-4 text-primary" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Purchase amount exceeds ${RFQ_MIN_AMOUNT_USD.toLocaleString()} — complete RFQ and PAF
          before creating a Purchase Order.
        </p>
        <div className="flex flex-wrap gap-2">
          {primaryPo ? (
            <>
              <Button asChild>
                <Link href={`/procurement/purchase-orders/${primaryPo.id}`}>
                  <ShoppingCart className="h-4 w-4" />
                  View PO — {primaryPo.serialNumber}
                </Link>
              </Button>
              {primaryRfq && (
                <Button variant="outline" asChild>
                  <Link href={`/procurement/rfq/${primaryRfq.id}`}>
                    <MessageSquareQuote className="h-4 w-4" />
                    View RFQ
                  </Link>
                </Button>
              )}
            </>
          ) : !primaryRfq ? (
            <PermissionGate permission="RFQ:CREATE">
              <Button asChild>
                <Link href={`/procurement/rfq/new?prId=${prId}`}>
                  <MessageSquareQuote className="h-4 w-4" />
                  Create RFQ
                </Link>
              </Button>
            </PermissionGate>
          ) : primaryRfq.status === "AWARDED" && !primaryPaf ? (
            <Button asChild>
              <Link href={`/procurement/rfq/${primaryRfq.id}/compare`}>
                <FileText className="h-4 w-4" />
                Complete PAF
              </Link>
            </Button>
          ) : primaryRfq.status === "AWARDED" && primaryPaf ? (
            <PermissionGate permission="PURCHASE_ORDERS:CREATE">
              <Button asChild>
                <Link href={buildPoUrl()}>
                  <ShoppingCart className="h-4 w-4" />
                  Create PO
                </Link>
              </Button>
            </PermissionGate>
          ) : (
            <>
              <Button asChild>
                <Link href={`/procurement/rfq/${primaryRfq.id}`}>
                  <MessageSquareQuote className="h-4 w-4" />
                  Manage RFQ — {primaryRfq.serialNumber}
                </Link>
              </Button>
              {hasRespondedVendors && (
                <Button variant="outline" asChild>
                  <Link href={`/procurement/rfq/${primaryRfq.id}/compare`}>
                    Compare Vendors
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
