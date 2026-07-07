"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getGrantById } from "@/lib/mock-data/grants";
import { projectActivities } from "@/lib/mock-data/projects";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";

export default function GrantDetailPage() {
  const params = useParams();
  const grant = getGrantById(params.id as string);
  if (!grant) notFound();

  const activities = projectActivities.filter((a) => a.grantId === grant.id);

  return (
    <div>
      <PageHeader
        title={grant.name}
        description={grant.code}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Grants", href: "/grants" },
          { label: grant.code },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/grants">
              <ArrowLeft className="h-4 w-4" />
              Back to Grants
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <StatusBadge status={grant.status} />
        <span className="text-sm text-muted-foreground">
          {grant.activitiesCount} activities
        </span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(grant.totalBudget, grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(grant.committed, grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(grant.spent, grant.currency)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(grant.available, grant.currency)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{grant.donor}</p>
                    <p className="text-sm text-muted-foreground">Primary Donor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {formatDate(grant.startDate)} — {formatDate(grant.endDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">Grant Period</p>
                  </div>
                </div>
                {grant.description && (
                  <p className="text-sm text-muted-foreground">{grant.description}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">
                    {formatPercent(grant.utilizationPercent)}
                  </span>
                </div>
                <Progress value={grant.utilizationPercent} className="h-3" />
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {formatPercent((grant.spent / grant.totalBudget) * 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {formatPercent(((grant.committed - grant.spent) / grant.totalBudget) * 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">Committed</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">
                      {formatPercent((grant.available / grant.totalBudget) * 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.responsibleStaff} · {activity.milestone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.progress}%</p>
                        <Progress value={activity.progress} className="mt-1 h-2 w-24" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-8 text-center text-muted-foreground">
                    No activities linked to this grant yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { label: "Total Budget", amount: grant.totalBudget },
                  { label: "Committed", amount: grant.committed },
                  { label: "Actual Expenses", amount: grant.spent },
                  { label: "Remaining Balance", amount: grant.available },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between border-b pb-3">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold">
                      {formatCurrency(row.amount, grant.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {["Grant Agreement", "Budget Breakdown", "Quarterly Report Q1", "Donor Compliance Checklist"].map(
                  (doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{doc}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
