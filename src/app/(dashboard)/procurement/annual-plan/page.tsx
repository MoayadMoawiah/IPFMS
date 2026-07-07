"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export default function AnnualPlanPage() {
  return (
    <div>
      <PageHeader
        title="Annual Procurement Plan"
        description="Plan and track annual procurement activities by grant"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Annual Plan" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>FY 2025 Procurement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { grant: "EFSR-2025", planned: 120000, committed: 85000 },
              { grant: "WASH-2025", planned: 95000, committed: 62000 },
              { grant: "PHC-2024", planned: 78000, committed: 71000 },
            ].map((row) => (
              <div key={row.grant} className="flex items-center justify-between rounded-xl border p-4">
                <span className="font-medium">{row.grant}</span>
                <div className="text-right text-sm">
                  <p>Planned: ${row.planned.toLocaleString()}</p>
                  <p className="text-muted-foreground">Committed: ${row.committed.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
