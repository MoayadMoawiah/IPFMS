"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useJournalEntries, useTrialBalance } from "@/hooks/use-finance";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapJournalEntryRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function AccountingPage() {
  const { data, isLoading, isError } = useJournalEntries({ limit: 20 });
  const { data: trialBalance, isLoading: tbLoading } = useTrialBalance();

  const entries = getPaginatedItems(data).map((je) =>
    mapJournalEntryRow(je as Record<string, unknown>)
  );
  const totals = trialBalance?.totals;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting"
        description="Journal entries and trial balance from posted transactions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Accounting" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Journal Entry
          </Button>
        }
      />

      {tbLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <LoadingSkeleton variant="cards" />
        </div>
      )}

      {totals && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posted Debits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(totals.totalDebit)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posted Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(totals.totalCredit)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trial Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  totals.isBalanced
                    ? "text-2xl font-semibold text-green-600"
                    : "text-2xl font-semibold text-destructive"
                }
              >
                {totals.isBalanced ? "Balanced" : "Out of balance"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" />}

          {isError && (
            <div className="flex flex-col items-center gap-2 py-8 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <p className="text-sm">Failed to load journal entries</p>
            </div>
          )}

          {!isLoading && !isError && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>JE Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Grant</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      No journal entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((je) => (
                    <TableRow key={je.id}>
                      <TableCell className="font-medium">{je.jeNumber}</TableCell>
                      <TableCell>{formatDate(je.postingDate || je.createdAt)}</TableCell>
                      <TableCell>{je.description}</TableCell>
                      <TableCell>{je.grant?.code ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(je.totalDebit, je.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(je.totalCredit, je.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={je.status?.toLowerCase() ?? "draft"} />
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
  );
}
