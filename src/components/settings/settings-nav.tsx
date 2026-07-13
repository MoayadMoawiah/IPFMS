"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "General", href: "/settings" },
  { title: "Donor Management", href: "/settings/donors" },
  { title: "User Management", href: "/settings/users" },
] as const;

function isTabActive(pathname: string, href: string): boolean {
  if (href === "/settings") return pathname === "/settings";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 border-b border-border">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isTabActive(pathname, tab.href)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
