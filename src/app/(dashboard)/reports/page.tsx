"use client";

import { FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { useBudgetVsActual } from "@/hooks/use-finance";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function ReportsPage() {
  const { data: budgetData, isLoading } = useBudgetVsActual();
  const grants = Array.isArray(budgetData) ? budgetData : [];

  const handleExport = (format: string) => {
    toast({
      title: "Export Queued",
      description: `${format} export will be generated and downloaded shortly.`,
    });
  };

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Interactive financial and operational reports with export capabilities"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton variant="table" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant Code</TableHead>
                    <TableHead>Grant Name</TableHead>
                    <TableHead className="text-right">Total Budget</TableHead>
                    <TableHead className="text-right">Committed</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Utilization %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    grants.map((g: Record<string, unknown>) => (
                      <TableRow key={g.id as string}>
                        <TableCell className="font-medium">{g.code as string}</TableCell>
                        <TableCell>{g.name as string}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(g.totalBudget) || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(g.committedAmount) || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(g.spentAmount) || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(g.available) || 0)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {Number(g.utilizationPercent || 0).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
