"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FilePlus,
  Receipt,
  PackageCheck,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "Create PR",
    href: "/procurement/requisitions/new",
    icon: FilePlus,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Create Payment",
    href: "/finance/payment-vouchers",
    icon: Receipt,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    title: "Receive Goods",
    href: "/procurement/goods-receipt",
    icon: PackageCheck,
    color: "bg-success/10 text-success",
  },
  {
    title: "Generate Report",
    href: "/reports",
    icon: BarChart3,
    color: "bg-warning/10 text-warning",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-title">Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <motion.div key={action.title} whileHover={{ scale: 1.02 }}>
              <Link
                href={action.href}
                className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-4 text-center transition-shadow hover:shadow-card-hover"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    action.color
                  )}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
