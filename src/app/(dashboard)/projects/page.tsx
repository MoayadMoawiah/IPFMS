"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Activity, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useActivities } from "@/hooks/use-projects";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Activity as ActivityType } from "@/lib/api/projects";

const KANBAN_COLUMNS = [
  { id: "planning", title: "Planning", status: "PLANNING" },
  { id: "in_progress", title: "In Progress", status: "IN_PROGRESS" },
  { id: "review", title: "Review", status: "REVIEW" },
  { id: "completed", title: "Completed", status: "COMPLETED" },
];

const tableColumns: ColumnDef<ActivityType>[] = [
  {
    accessorKey: "name",
    header: "Activity",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: "project",
    header: "Grant / Project",
    cell: ({ row }) => row.original.project?.grant?.code ?? row.original.project?.code ?? "—",
  },
  {
    accessorKey: "plannedBudget",
    header: "Planned Budget",
    cell: ({ row }) =>
      formatCurrency(
        Number(row.original.plannedBudget),
        row.original.project?.grant?.currency
      ),
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "progressPercent",
    header: "Progress",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={Number(row.original.progressPercent)} className="h-2 w-20" />
        <span className="text-sm">{Number(row.original.progressPercent)}%</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} />,
  },
];

export default function ActivitiesPage() {
  const [view, setView] = useState("kanban");
  const { data, isLoading, isError } = useActivities({ limit: 100 });
  const activities: ActivityType[] = getPaginatedItems(data);

  return (
    <div>
      <PageHeader
        title="Activities"
        description="Work packages across all grants and projects"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Activities" },
        ]}
      />

      {isLoading && <LoadingSkeleton variant="cards" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load activities</p>
        </div>
      )}

      {!isLoading && !isError && (
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {activities.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No activities yet"
                description="Create a grant first, then add activities from the grant detail page."
                actionLabel="Go to Grants"
                onAction={() => (window.location.href = "/grants")}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {KANBAN_COLUMNS.map((column) => {
                  const items = activities.filter((a) => a.status === column.status);
                  return (
                    <div key={column.id} className="rounded-2xl bg-muted/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">{column.title}</h3>
                        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium">
                          {items.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {items.map((activity) => (
                          <Card key={activity.id} className="hover:shadow-card-hover">
                            <CardContent className="p-4">
                              <p className="font-medium">{activity.name}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {activity.project?.grant?.code ?? activity.code}
                              </p>
                              <div className="mt-3 flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {formatDate(activity.endDate)}
                                </span>
                                <span className="font-medium">
                                  {Number(activity.progressPercent)}%
                                </span>
                              </div>
                              <Progress
                                value={Number(activity.progressPercent)}
                                className="mt-2 h-1.5"
                              />
                              <p className="mt-2 text-xs text-muted-foreground">
                                {formatCurrency(
                                  Number(activity.plannedBudget),
                                  activity.project?.grant?.currency
                                )}
                              </p>
                              {activity.project?.grant?.id && (
                                <Link
                                  href={`/grants/${activity.project.grant.id}`}
                                  className="mt-2 inline-block text-xs text-primary hover:underline"
                                >
                                  View grant
                                </Link>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {items.length === 0 && (
                          <p className="py-4 text-center text-xs text-muted-foreground">
                            No activities
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <DataTable
              columns={tableColumns}
              data={activities}
              searchKey="name"
              searchPlaceholder="Search activities..."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
