"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Bell,
  Globe,
  Moon,
  Sun,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSidebar } from "@/hooks/use-sidebar";
import { useGrantContext } from "@/hooks/use-grant-context";
import { MobileSidebarContent } from "@/components/layout/app-sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import { useUnreadNotificationCount, useMarkAllNotificationsRead } from "@/hooks/use-search";
import { GlobalSearch } from "@/components/shared/global-search";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { toggle } = useSidebar();
  const router = useRouter();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const {
    currentGrantId,
    setCurrentGrantId,
    currentFiscalYear,
    setCurrentFiscalYear,
    grants,
    fiscalYears,
  } = useGrantContext();

  const { data: notifCountData } = useUnreadNotificationCount();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const unreadCount = notifCountData?.count ?? 0;

  const handleLogout = async () => {
    await logout();
  };

  const userInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';
  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.roles?.[0] ?? 'Staff';

  return (
    <header className="no-print sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Image
              src="/brand/gaderon-logo.png"
              alt="Gaderon"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden items-center gap-2 sm:flex">
        <Image
          src="/brand/gaderon-logo.png"
          alt="Gaderon"
          width={100}
          height={32}
          className="h-7 w-auto lg:hidden"
        />
        <span className="hidden text-sm font-medium text-muted-foreground xl:inline">
          Gaderon Organization
        </span>
      </div>

      <div className="relative mx-auto hidden max-w-md flex-1 md:block">
        <GlobalSearch />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select value={currentGrantId} onValueChange={setCurrentGrantId}>
          <SelectTrigger className="hidden w-[160px] lg:flex">
            <SelectValue placeholder="Current Grant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grants</SelectItem>
            {grants
              .filter((g) => g.status === "active")
              .map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.code}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={currentFiscalYear} onValueChange={setCurrentFiscalYear}>
          <SelectTrigger className="hidden w-[100px] xl:flex">
            <SelectValue placeholder="FY" />
          </SelectTrigger>
          <SelectContent>
            {fiscalYears.map((fy) => (
              <SelectItem key={fy} value={fy}>
                FY {fy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={() => markAllRead()} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground">
              {unreadCount === 0 ? 'No new notifications' : `${unreadCount} unread notifications`}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" disabled title="Arabic — Coming soon">
          <Globe className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium">{userDisplayName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
