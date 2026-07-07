"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Grant } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import { cardHover } from "@/lib/motion";

interface GrantCardProps {
  grant: Grant;
}

export function GrantCard({ grant }: GrantCardProps) {
  return (
    <motion.div {...cardHover}>
      <Link href={`/grants/${grant.id}`}>
        <Card className="h-full transition-shadow hover:shadow-card-hover">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-primary">{grant.code}</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">
                  {grant.name}
                </h3>
              </div>
              <StatusBadge status={grant.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {grant.donor}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(grant.startDate)} — {formatDate(grant.endDate)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="font-semibold">
                  {formatCurrency(grant.totalBudget, grant.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="font-semibold text-success">
                  {formatCurrency(grant.available, grant.currency)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Budget Utilization</span>
                <span className="font-medium">
                  {formatPercent(grant.utilizationPercent)}
                </span>
              </div>
              <Progress value={grant.utilizationPercent} className="h-2" />
            </div>

            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              View details
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
