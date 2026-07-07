"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/motion";

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  href?: string;
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  href,
  iconClassName,
  className,
}: StatCardProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] || Icons.Circle) as LucideIcon;

  const content = (
    <Card className={cn("transition-shadow hover:shadow-card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subtext}</p>
          </div>
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10",
              iconClassName
            )}
          >
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View details
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return href ? (
    <motion.div {...cardHover}>
      <Link href={href} className="block">
        {content}
      </Link>
    </motion.div>
  ) : (
    <motion.div {...cardHover}>{content}</motion.div>
  );
}
