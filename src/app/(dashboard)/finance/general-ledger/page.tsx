"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useChartOfAccountsTree, useTrialBalance } from "@/hooks/use-finance";
import { mergeCoaBalances, type CoaTreeNodeWithBalance } from "@/lib/finance/merge-coa-balances";
import { formatCurrency } from "@/lib/formatters";

function AccountTree({
  accounts,
  level = 0,
}: {
  accounts: CoaTreeNodeWithBalance[];
  level?: number;
}) {
  return (
    <div className={level > 0 ? "ml-6 border-l pl-4" : ""}>
      {accounts.map((account) => (
        <div key={account.id}>
          <div
            className="flex items-center justify-between rounded-lg py-2 hover:bg-muted/50"
            style={{ paddingLeft: level * 8 }}
          >
            <div>
              <span className="font-mono text-sm text-muted-foreground">{account.code}</span>
              <span className="ml-2 font-medium">{account.name}</span>
            </div>
            <span
              className={
                account.balance !== 0 ? "font-semibold" : "text-muted-foreground"
              }
            >
              {formatCurrency(account.balance)}
            </span>
          </div>
          {account.children && account.children.length > 0 && (
            <AccountTree accounts={account.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function GeneralLedgerPage() {
  const {
    data: tree,
    isLoading: treeLoading,
    isError: treeError,
  } = useChartOfAccountsTree();
  const {
    data: trialBalance,
    isLoading: tbLoading,
    isError: tbError,
  } = useTrialBalance();

  const accountsWithBalances = useMemo(() => {
    if (!tree?.length) return [];

    const balanceMap = new Map<string, number>();
    for (const account of trialBalance?.accounts ?? []) {
      balanceMap.set(account.id, account.balance);
    }

    return mergeCoaBalances(tree, balanceMap);
  }, [tree, trialBalance]);

  const isLoading = treeLoading || tbLoading;
  const isError = treeError || tbError;
  const totals = trialBalance?.totals;
  const activeAccounts = trialBalance?.accounts ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Ledger"
        description="Chart of accounts and posted account balances"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "General Ledger" },
        ]}
      />

      {totals && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Debits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCurrency(totals.totalDebit)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Credits
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
          <CardTitle>Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" />}

          {isError && (
            <div className="flex flex-col items-center gap-2 py-8 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <p className="text-sm">Failed to load chart of accounts or balances</p>
            </div>
          )}

          {!isLoading && !isError && accountsWithBalances.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No accounts found</p>
          )}

          {!isLoading && !isError && accountsWithBalances.length > 0 && (
            <AccountTree accounts={accountsWithBalances} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trial Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" />}

          {!isLoading && !isError && activeAccounts.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No posted journal activity yet
            </p>
          )}

          {!isLoading && !isError && activeAccounts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Code</th>
                    <th className="pb-2 pr-4 font-medium">Account</th>
                    <th className="pb-2 pr-4 text-right font-medium">Debit</th>
                    <th className="pb-2 pr-4 text-right font-medium">Credit</th>
                    <th className="pb-2 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAccounts.map((account) => (
                    <tr key={account.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono">{account.code}</td>
                      <td className="py-2 pr-4">{account.name}</td>
                      <td className="py-2 pr-4 text-right">
                        {formatCurrency(account.totalDebit)}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        {formatCurrency(account.totalCredit)}
                      </td>
                      <td className="py-2 text-right font-medium">
                        {formatCurrency(account.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
