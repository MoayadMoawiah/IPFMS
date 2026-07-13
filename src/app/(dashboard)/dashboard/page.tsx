"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  BudgetVsActualChart,
  UtilizationChart,
  MonthlySpendingChart,
  ProcurementStatusChart,
  CashFlowChart,
} from "@/components/dashboard/charts";
import { RecentActivitiesTimeline } from "@/components/dashboard/recent-activities";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { dashboardKPIs } from "@/lib/mock-data/dashboard";
import { staggerContainer, slideUp } from "@/lib/motion";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display"
          >
            Welcome back, {user?.firstName ?? 'User'} 👋
          </motion.h1>
          <p className="mt-1 text-muted">Gaderon G-GPFMS — Enterprise ERP</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Grants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grants</SelectItem>
              <SelectItem value="gr-001">EFSR-2025</SelectItem>
              <SelectItem value="gr-002">WASH-2025</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            defaultValue="01 May 2025 - 19 May 2025"
            className="w-[220px]"
            readOnly
          />
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {dashboardKPIs.map((kpi) => (
          <motion.div key={kpi.label} variants={slideUp}>
            <StatCard
              label={kpi.label}
              value={kpi.value}
              subtext={kpi.subtext}
              icon={kpi.icon}
              href={kpi.href}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BudgetVsActualChart />
        <UtilizationChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentActivitiesTimeline />
        <MonthlySpendingChart />
        <ProcurementStatusChart />
      </div>

      <CashFlowChart />

      <QuickActions />
    </div>
  );
}
