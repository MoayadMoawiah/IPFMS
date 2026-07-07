"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPOById } from "@/lib/mock-data/procurement";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function PODetailPage() {
  const params = useParams();
  const po = getPOById(params.id as string);
  if (!po) notFound();

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={po.number}
          description={`Purchase Order — ${po.vendor}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Purchase Orders", href: "/procurement/purchase-orders" },
            { label: po.number },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/procurement/purchase-orders">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print PO
              </Button>
            </div>
          }
        />
        <StatusBadge status={po.status} />
      </div>

      <Card className="mt-6 print-only:mt-0 print-only:border-0 print-only:shadow-none">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <Image
                src="/brand/gaderon-logo.png"
                alt="Gaderon"
                width={160}
                height={60}
                className="h-14 w-auto"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Gaderon Organization for Development
              </p>
              <p className="text-xs text-muted-foreground">
                Integrated Procurement & Finance Management System
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary">PURCHASE ORDER</h2>
              <p className="mt-1 font-semibold">{po.number}</p>
              <p className="text-sm text-muted-foreground">
                Date: {formatDate(po.issueDate)}
              </p>
              <StatusBadge status={po.status} className="mt-2" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Vendor Information</h3>
              <p className="font-medium">{po.vendor}</p>
              <p className="text-sm text-muted-foreground">{po.vendorEmail}</p>
              <p className="text-sm text-muted-foreground">{po.vendorPhone}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Shipping Information</h3>
              <p className="text-sm">{po.shippingAddress}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Delivery Date:</span>{" "}
                {formatDate(po.deliveryDate)}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Grant Reference</h3>
              <p className="text-sm">{po.grantName}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Bank Information</h3>
              <p className="text-sm">{po.bankDetails}</p>
            </div>
          </div>

          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.items.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">
                    Grand Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(po.totalAmount, po.currency)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="mt-8">
            <h3 className="mb-2 font-semibold">Terms & Conditions</h3>
            <p className="text-sm text-muted-foreground">{po.terms}</p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            {["Prepared By", "Approved By", "Vendor Acknowledgment"].map((label) => (
              <div key={label} className="text-center">
                <div className="mb-2 h-16 border-b border-dashed" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">Signature & Date</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed">
              <QrCode className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Scan to verify PO authenticity
              <br />
              {po.number}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
