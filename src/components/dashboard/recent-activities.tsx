"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  DollarSign,
  Package,
  FilePlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivities } from "@/lib/mock-data/dashboard";
import { formatRelativeTime } from "@/lib/formatters";
import { staggerContainer, slideUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const activityIcons = {
  purchase_order: { icon: CheckCircle2, color: "text-success bg-success/10" },
  invoice: { icon: FileText, color: "text-primary bg-primary/10" },
  payment: { icon: DollarSign, color: "text-success bg-success/10" },
  goods: { icon: Package, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  requisition: { icon: FilePlus, color: "text-warning bg-warning/10" },
};

export function RecentActivitiesTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-title">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {recentActivities.map((activity) => {
            const config = activityIcons[activity.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={activity.id}
                variants={slideUp}
                className="flex gap-3"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    config.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(activity.time)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <Link
          href="/audit"
          className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
        >
          View all activities
        </Link>
      </CardContent>
    </Card>
  );
}
