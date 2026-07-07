"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { projectActivities, kanbanColumns } from "@/lib/mock-data/projects";
import type { ProjectActivity } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<ProjectActivity>[] = [
  {
    accessorKey: "title",
    header: "Activity",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">{row.original.grantName}</p>
      </div>
    ),
  },
  { accessorKey: "milestone", header: "Milestone" },
  {
    accessorKey: "budgetAllocated",
    header: "Budget",
    cell: ({ row }) => formatCurrency(row.original.budgetAllocated),
  },
  { accessorKey: "responsibleStaff", header: "Responsible" },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={row.original.progress} className="h-2 w-20" />
        <span className="text-sm">{row.original.progress}%</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function ProjectsPage() {
  const [view, setView] = useState("kanban");

  return (
    <div>
      <PageHeader
        title="Projects & Activities"
        description="Track project milestones, budget allocation, and team progress"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Activity
          </Button>
        }
      />

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kanbanColumns.map((column) => {
              const items = projectActivities.filter(
                (a) => a.status === column.status
              );
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
                      <Card key={activity.id} className="cursor-pointer hover:shadow-card-hover">
                        <CardContent className="p-4">
                          <p className="font-medium">{activity.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {activity.grantName}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span>{activity.responsibleStaff}</span>
                            <span className="font-medium">{activity.progress}%</span>
                          </div>
                          <Progress value={activity.progress} className="mt-2 h-1.5" />
                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatCurrency(activity.budgetAllocated)} allocated
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <DataTable
            columns={columns}
            data={projectActivities}
            searchKey="title"
            searchPlaceholder="Search activities..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
