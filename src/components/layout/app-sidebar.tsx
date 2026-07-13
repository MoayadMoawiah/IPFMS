"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Bookmark,
  Activity,
  ShoppingCart,
  Wallet,
  BarChart3,
  Shield,
  Settings,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  MessageSquareQuote,
  ClipboardCheck,
  FileCheck,
  PackageCheck,
  Package,
  Receipt,
  CreditCard,
  ArrowLeftRight,
  BookOpen,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/lib/mock-data/users";
import { useState } from "react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string; icon: React.ElementType }[];
}

function isChildNavActive(
  pathname: string,
  href: string,
  siblings: { href: string }[]
): boolean {
  if (pathname === href) return true;
  if (!pathname.startsWith(`${href}/`)) return false;

  const hasMoreSpecificMatch = siblings.some(
    (sibling) =>
      sibling.href !== href &&
      sibling.href.startsWith(href) &&
      (pathname === sibling.href || pathname.startsWith(`${sibling.href}/`))
  );

  return !hasMoreSpecificMatch;
}

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Grant Management", href: "/grants", icon: Bookmark },
  { title: "Activities", href: "/projects", icon: Activity },
  {
    title: "Procurement",
    icon: ShoppingCart,
    children: [
      { title: "Purchase Requisition", href: "/procurement/requisitions", icon: FileText },
      { title: "Annual Procurement Plan", href: "/procurement/annual-plan", icon: Calendar },
      { title: "RFQ", href: "/procurement/rfq", icon: MessageSquareQuote },
      { title: "Vendor Quotations", href: "/procurement/vendor-quotations", icon: ClipboardCheck },
      { title: "Evaluation Committee", href: "/procurement/evaluation", icon: FileCheck },
      { title: "Purchase Orders", href: "/procurement/purchase-orders", icon: ShoppingCart },
      { title: "Goods Receipt", href: "/procurement/goods-receipt", icon: PackageCheck },
      { title: "Inventory", href: "/procurement/inventory", icon: Package },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Payment Voucher", href: "/finance/payment-vouchers", icon: Receipt },
      { title: "Cheque Management", href: "/finance/cheques", icon: CreditCard },
      { title: "Bank Transfer", href: "/finance/bank-transfers", icon: ArrowLeftRight },
      { title: "Accounting", href: "/finance/accounting", icon: BookOpen },
      { title: "General Ledger", href: "/finance/general-ledger", icon: ScrollText },
    ],
  },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Audit", href: "/audit", icon: Shield },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "General", href: "/settings", icon: Settings },
      { title: "Donor Management", href: "/settings/donors", icon: Building2 },
      { title: "User Management", href: "/settings/users", icon: Users },
    ],
  },
];

function NavLink({
  item,
  isCollapsed,
}: {
  item: NavItem;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(
    item.children?.some((c) => pathname.startsWith(c.href)) ?? false
  );

  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : item.children?.some((c) => pathname.startsWith(c.href));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </>
          )}
        </button>
        <AnimatePresence>
          {isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 mt-1 space-y-1 overflow-hidden border-l border-border pl-3"
            >
              {item.children.map((child) => {
                const childActive = isChildNavActive(pathname, child.href, item.children!);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      childActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <child.icon className="h-4 w-4" />
                    {child.title}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
}

export function AppSidebar({ className }: { className?: string }) {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "no-print flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/brand/gaderon-logo.png"
              alt="Gaderon"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
        )}
        <button
          onClick={toggleCollapsed}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => (
          <NavLink key={item.title} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-primary p-3 text-primary-foreground",
            isCollapsed && "justify-center p-2"
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/20 text-xs text-primary-foreground">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs opacity-80">{currentUser.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebarContent() {
  return (
    <nav className="space-y-1 p-3">
      {navigation.map((item) => (
        <NavLink key={item.title} item={item} isCollapsed={false} />
      ))}
    </nav>
  );
}
