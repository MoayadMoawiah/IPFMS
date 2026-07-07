import type { DashboardKPI, RecentActivity, ChartDataPoint } from "@/types";
import { getDashboardTotals } from "./grants";
import { formatCurrency, formatPercent } from "@/lib/formatters";

const totals = getDashboardTotals();

export const dashboardKPIs: DashboardKPI[] = [
  {
    label: "Active Grants",
    value: `${totals.activeCount} Active Grants`,
    subtext: "Across all donors",
    icon: "Bookmark",
    href: "/grants",
  },
  {
    label: "Total Budget",
    value: formatCurrency(totals.totalBudget),
    subtext: "All active grants",
    icon: "Wallet",
    href: "/grants",
  },
  {
    label: "Committed Budget",
    value: formatCurrency(totals.committed),
    subtext: `${formatPercent((totals.committed / totals.totalBudget) * 100)} of total budget`,
    icon: "FileLock",
    href: "/reports",
  },
  {
    label: "Actual Expenses",
    value: formatCurrency(totals.spent),
    subtext: `${formatPercent((totals.spent / totals.totalBudget) * 100)} of total budget`,
    icon: "CircleDollarSign",
    href: "/finance/payment-vouchers",
  },
  {
    label: "Remaining Budget",
    value: formatCurrency(totals.available),
    subtext: `${formatPercent((totals.available / totals.totalBudget) * 100)} available`,
    icon: "Coins",
    href: "/reports",
  },
  {
    label: "Open Procurement Requests",
    value: "14 Open PRs",
    subtext: "3 awaiting approval",
    icon: "FilePlus",
    href: "/procurement/requisitions",
  },
  {
    label: "Pending Payments",
    value: "8 Pending",
    subtext: formatCurrency(142500) + " total",
    icon: "Receipt",
    href: "/finance/payment-vouchers",
  },
  {
    label: "Inventory Value",
    value: formatCurrency(89400),
    subtext: "124 items in stock",
    icon: "Package",
    href: "/procurement/inventory",
  },
];

export const budgetVsActualData: ChartDataPoint[] = [
  { name: "Jan", budget: 380000, actual: 295000 },
  { name: "Feb", budget: 420000, actual: 340000 },
  { name: "Mar", budget: 450000, actual: 410000 },
  { name: "Apr", budget: 480000, actual: 395000 },
  { name: "May", budget: 510000, actual: 445000 },
  { name: "Jun", budget: 490000, actual: 380000 },
];

export const utilizationData = [
  { name: "Spent", value: totals.spent, color: "hsl(var(--chart-1))" },
  { name: "Committed", value: totals.committed - totals.spent, color: "hsl(var(--chart-2))" },
  { name: "Available", value: totals.available, color: "hsl(var(--muted))" },
];

export const monthlySpendingData: ChartDataPoint[] = [
  { name: "Jan", spent: 295000 },
  { name: "Feb", spent: 340000 },
  { name: "Mar", spent: 410000 },
  { name: "Apr", spent: 395000 },
  { name: "May", spent: 445000 },
  { name: "Jun", spent: 380000 },
];

export const procurementStatusData = [
  { name: "Draft", value: 5 },
  { name: "Submitted", value: 8 },
  { name: "Approved", value: 12 },
  { name: "PO Issued", value: 9 },
  { name: "Completed", value: 15 },
];

export const cashFlowData = [
  { name: "Jan", inflow: 520000, outflow: 295000 },
  { name: "Feb", inflow: 480000, outflow: 340000 },
  { name: "Mar", inflow: 610000, outflow: 410000 },
  { name: "Apr", inflow: 550000, outflow: 395000 },
  { name: "May", inflow: 590000, outflow: 445000 },
  { name: "Jun", inflow: 620000, outflow: 380000 },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "act-1",
    title: "Purchase Order Approved",
    description: "PO-2025-0847 for medical supplies approved by Finance Manager",
    time: new Date(Date.now() - 2 * 60000).toISOString(),
    type: "purchase_order",
  },
  {
    id: "act-2",
    title: "Invoice Matched",
    description: "Invoice INV-4521 matched to PO-2025-0832 for WASH supplies",
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    type: "invoice",
  },
  {
    id: "act-3",
    title: "Payment Completed",
    description: "Payment PV-2025-0312 of $24,500 processed to Al-Nour Trading",
    time: new Date(Date.now() - 3600000).toISOString(),
    type: "payment",
  },
  {
    id: "act-4",
    title: "Goods Received",
    description: "GRN-2025-0198: 500 hygiene kits received at Central Warehouse",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    type: "goods",
  },
  {
    id: "act-5",
    title: "New Purchase Requisition",
    description: "PR-2025-0156 submitted for office equipment under EFSR grant",
    time: new Date(Date.now() - 3 * 3600000).toISOString(),
    type: "requisition",
  },
];

export const notifications = [
  {
    id: "n-1",
    title: "PR Approval Required",
    message: "PR-2025-0158 requires your approval",
    time: "5 min ago",
    read: false,
    type: "warning" as const,
  },
  {
    id: "n-2",
    title: "Payment Processed",
    message: "PV-2025-0312 has been paid successfully",
    time: "1 hour ago",
    read: false,
    type: "success" as const,
  },
  {
    id: "n-3",
    title: "Grant Report Due",
    message: "WASH-2025 quarterly report due in 5 days",
    time: "2 hours ago",
    read: false,
    type: "info" as const,
  },
  {
    id: "n-4",
    title: "Budget Alert",
    message: "PHC-2024 grant at 85% utilization",
    time: "1 day ago",
    read: true,
    type: "warning" as const,
  },
];
