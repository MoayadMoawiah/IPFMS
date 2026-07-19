"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { WorkflowStepTimeline } from "@/components/workflow/workflow-step-timeline";
import { GenericDocPrintView, formatMetaDate } from "@/components/documents/generic-doc-print-view";
import { useGoodsReceipt } from "@/hooks/use-procurement";
import { formatDate } from "@/lib/formatters";

export default function GoodsReceiptDetailPage() {
  const params = useParams();
  const grnId = params.id as string;
  const { data, isLoading, isError } = useGoodsReceipt(grnId);

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">Goods receipt not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link href="/procurement/goods-receipt">Back to Goods Receipts</Link>
        </Button>
      </div>
    );
  }

  const grn = data as {
    id: string;
    serialNumber: string;
    status: string;
    receiptDate: string;
    deliveryNote?: string | null;
    notes?: string | null;
    createdAt?: string;
    po?: { id: string; serialNumber: string; title?: string; vendor?: { name: string } };
    grant?: { code: string; name: string };
    warehouse?: { name: string } | null;
    receivedBy?: {
      firstName?: string;
      lastName?: string;
      roles?: Array<{ role?: { name?: string } }>;
    };
    items?: Array<{
      id: string;
      description: string;
      orderedQuantity: number | string;
      deliveredQuantity: number | string;
      acceptedQuantity: number | string;
      rejectedQuantity?: number | string;
      poItem?: { unit?: string; unitPrice?: number | string };
    }>;
    workflow?: {
      currentStepNumber?: number;
      steps?: Array<{
        stepNumber: number;
        stepName: string;
        status: string;
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
  };

  const items = grn.items ?? [];

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={grn.serialNumber}
          description={grn.po ? `GRN for ${grn.po.serialNumber}` : "Goods Receipt Note"}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Goods Receipt", href: "/procurement/goods-receipt" },
            { label: grn.serialNumber },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print GRN
              </Button>
              <Button variant="outline" asChild>
                <Link href="/procurement/goods-receipt">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          }
        />

        <div className="mb-6 flex items-center gap-3">
          <StatusBadge status={grn.status.toLowerCase()} />
          <span className="text-sm text-muted-foreground">
            Receipt date: {formatDate(grn.receiptDate)}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">PO:</span>{" "}
                {grn.po ? (
                  <Link
                    href={`/procurement/purchase-orders/${grn.po.id}`}
                    className="text-primary hover:underline"
                  >
                    {grn.po.serialNumber}
                  </Link>
                ) : (
                  "—"
                )}
              </p>
              <p>
                <span className="text-muted-foreground">Vendor:</span>{" "}
                {grn.po?.vendor?.name ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Grant:</span>{" "}
                {grn.grant ? `${grn.grant.code} — ${grn.grant.name}` : "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Items:</span> {items.length}
              </p>
            </CardContent>
          </Card>

          {grn.workflow?.steps && grn.workflow.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkflowStepTimeline
                  steps={grn.workflow.steps}
                  currentStepNumber={grn.workflow.currentStepNumber}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden print:block">
        <GenericDocPrintView
          title="Goods Receipt Note – GRN"
          documentNumber={grn.serialNumber}
          description={grn.notes || grn.deliveryNote}
          showTotalInWords={false}
          requestedByUser={grn.receivedBy}
          requestedAt={grn.receiptDate || grn.createdAt}
          steps={grn.workflow?.steps}
          actions={grn.workflow?.actions}
          meta={[
            { label: "Status", value: grn.status },
            { label: "Receipt Date", value: formatMetaDate(grn.receiptDate) },
            { label: "PO", value: grn.po?.serialNumber ?? "—" },
            { label: "Vendor", value: grn.po?.vendor?.name ?? "—" },
            {
              label: "Grant",
              value: grn.grant ? `${grn.grant.code} — ${grn.grant.name}` : "—",
            },
            { label: "Warehouse", value: grn.warehouse?.name ?? "—" },
          ]}
          items={items.map((item) => ({
            id: item.id,
            description: item.description,
            unit: item.poItem?.unit ?? "Unit",
            quantity: item.acceptedQuantity,
            unitPrice: item.poItem?.unitPrice ?? 0,
            total:
              Number(item.acceptedQuantity) * Number(item.poItem?.unitPrice ?? 0),
          }))}
        />
      </div>
    </>
  );
}
