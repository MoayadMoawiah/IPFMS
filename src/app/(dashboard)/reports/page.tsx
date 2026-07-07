"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { ReportsCharts } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { grants } from "@/lib/mock-data/grants";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";

export default function ReportsPage() {
  const handleExport = (format: string) => {
    toast({
      title: "Export Simulated",
      description: `${format} export is simulated for this prototype.`,
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
            <Button variant="outline" size="sm" onClick={() => handleExport("Word")}>
              <FileText className="h-4 w-4" />
              Word
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 p-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Grant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grants</SelectItem>
              {grants.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Donor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Donors</SelectItem>
              <SelectItem value="wfp">WFP</SelectItem>
              <SelectItem value="unicef">UNICEF</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Date range" className="w-[200px]" defaultValue="Jan 2025 - May 2025" readOnly />
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="wash">WASH</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <ReportsCharts />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grant Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grant</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.filter((g) => g.status === "active").slice(0, 6).map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell className="font-medium">{grant.code}</TableCell>
                  <TableCell>{grant.donor}</TableCell>
                  <TableCell className="text-right">{formatCurrency(grant.totalBudget)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(grant.spent)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(grant.available)}</TableCell>
                  <TableCell className="text-right">{grant.utilizationPercent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
