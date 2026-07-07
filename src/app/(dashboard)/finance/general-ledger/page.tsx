"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generalLedger } from "@/lib/mock-data/finance";
import { formatCurrency } from "@/lib/formatters";
import type { GLAccount } from "@/types";

function AccountTree({ accounts, level = 0 }: { accounts: GLAccount[]; level?: number }) {
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
            <span className="font-semibold">{formatCurrency(account.balance)}</span>
          </div>
          {account.children && <AccountTree accounts={account.children} level={level + 1} />}
        </div>
      ))}
    </div>
  );
}

export default function GeneralLedgerPage() {
  return (
    <div>
      <PageHeader
        title="General Ledger"
        description="Chart of accounts and account balances"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "General Ledger" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountTree accounts={generalLedger} />
        </CardContent>
      </Card>
    </div>
  );
}
