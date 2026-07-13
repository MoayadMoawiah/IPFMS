"use client";

import { useGrants } from "@/hooks/use-grants";
import { getPaginatedItems } from "@/lib/api/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Grant as ApiGrant } from "@/lib/api/grants";

export default function DonorPortalPage() {
  const { data, isLoading } = useGrants({ status: 'ACTIVE', limit: 20 });
  const grants = getPaginatedItems(data) as ApiGrant[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Grant Portfolio Overview</h1>
        <p className="mt-1 text-muted-foreground">
          View grant utilization, progress reports, and financial summaries
        </p>
      </div>

      {isLoading && <LoadingSkeleton variant="cards" />}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {grants.map((grant) => {
          const totalBudget = Number(grant.totalBudget) || 0;
          const spent = Number(grant.spentAmount) || 0;
          const committed = Number(grant.committedAmount) || 0;
          const utilization = totalBudget > 0 ? ((spent + committed) / totalBudget) * 100 : 0;

          return (
            <Card key={grant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary">{grant.code}</p>
                    <CardTitle className="mt-1 text-lg leading-tight">{grant.name}</CardTitle>
                  </div>
                  <StatusBadge status={grant.status.toLowerCase()} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Budget</p>
                    <p className="font-semibold">{formatCurrency(totalBudget, grant.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spent</p>
                    <p className="font-semibold">{formatCurrency(spent, grant.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(grant.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{formatDate(grant.endDate)}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget Utilization</span>
                    <span className="font-medium">{utilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                </div>

                {grant.donor && (
                  <p className="text-xs text-muted-foreground">
                    Donor: <span className="font-medium">{grant.donor.name}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isLoading && grants.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No active grants found for your account.</p>
        </div>
      )}
    </div>
  );
}
