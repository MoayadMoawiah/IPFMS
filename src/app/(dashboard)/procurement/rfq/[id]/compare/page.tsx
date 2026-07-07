"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { getRFQById } from "@/lib/mock-data/procurement";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function RFQComparePage() {
  const params = useParams();
  const rfq = getRFQById(params.id as string);
  if (!rfq) notFound();

  return (
    <div>
      <PageHeader
        title={`Vendor Comparison — ${rfq.number}`}
        description={rfq.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "RFQ", href: "/procurement/rfq" },
          { label: "Compare" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/procurement/rfq">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {rfq.vendors.map((vendor) => (
          <Card
            key={vendor.id}
            className={cn(
              vendor.isWinner && "border-success ring-2 ring-success/20"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{vendor.name}</CardTitle>
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
                <span className="font-semibold">{formatCurrency(vendor.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{vendor.deliveryDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Score</span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  {vendor.totalScore}
                </span>
              </div>
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
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfq.vendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className={cn(vendor.isWinner && "bg-success/5")}
                >
                  <TableCell className="font-medium">
                    {vendor.name}
                    {vendor.isWinner && (
                      <Trophy className="ml-2 inline h-4 w-4 text-success" />
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(vendor.price)}</TableCell>
                  <TableCell>{vendor.deliveryDays} days</TableCell>
                  <TableCell>{vendor.warranty}</TableCell>
                  <TableCell>{vendor.technicalScore}/100</TableCell>
                  <TableCell>{vendor.committeeScore}/100</TableCell>
                  <TableCell className="font-semibold">{vendor.totalScore}</TableCell>
                  <TableCell>{vendor.documents.length} files</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
