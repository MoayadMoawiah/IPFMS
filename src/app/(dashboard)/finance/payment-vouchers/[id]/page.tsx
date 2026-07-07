"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaymentVoucherById, journalEntries } from "@/lib/mock-data/finance";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function PaymentVoucherDetailPage() {
  const params = useParams();
  const pv = getPaymentVoucherById(params.id as string);
  if (!pv) notFound();

  const relatedJournal = journalEntries.filter((j) => j.reference === pv.number);

  return (
    <div>
      <PageHeader
        title={pv.number}
        description={`Payment to ${pv.payee}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Vouchers", href: "/finance/payment-vouchers" },
          { label: pv.number },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/finance/payment-vouchers">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <StatusBadge status={pv.status} />
        <span className="text-2xl font-bold">{formatCurrency(pv.amount)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Approval Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pv.approvalSteps.map((step, i) => (
                <div key={step.stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : step.status === "current" ? (
                      <Clock className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                    {i < pv.approvalSteps.length - 1 && (
                      <div className={cn("mt-1 h-full w-px", step.status === "completed" ? "bg-success" : "bg-border")} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold">{step.stage}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.approver} · {step.role}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground">{formatDate(step.date)}</p>
                    )}
                    {step.comment && (
                      <p className="mt-1 rounded-lg bg-muted/50 p-2 text-sm">{step.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payee</span><span className="font-medium">{pv.payee}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Grant</span><span>{pv.grantName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="capitalize">{pv.paymentMethod.replace("_", " ")}</span></div>
              {pv.poReference && (
                <div className="flex justify-between"><span className="text-muted-foreground">PO Ref</span><span>{pv.poReference}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="text-right">{pv.description}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Invoice.pdf", "PO Copy.pdf", "Delivery Note.pdf"].map((doc) => (
                <div key={doc} className="rounded-lg border p-3 text-sm font-medium hover:bg-muted/50">
                  {doc}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accounting Journal Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedJournal.length > 0 ? (
                relatedJournal.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.account}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">{entry.debit ? formatCurrency(entry.debit) : "—"}</TableCell>
                    <TableCell className="text-right">{entry.credit ? formatCurrency(entry.credit) : "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Journal entries will be generated upon payment approval
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
