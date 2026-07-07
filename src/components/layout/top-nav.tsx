"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Globe,
  Moon,
  Sun,
  Menu,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { currentUser } from "@/lib/mock-data/users";
import { notifications } from "@/lib/mock-data/dashboard";
import { MobileSidebarContent } from "@/components/layout/app-sidebar";
import { clearAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { organization } from "@/lib/mock-data/users";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const { toggle } = useSidebar();
  const router = useRouter();
  const {
    currentGrantId,
    setCurrentGrantId,
    currentFiscalYear,
    setCurrentFiscalYear,
    grants,
    fiscalYears,
  } = useGrantContext();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

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
          {organization.name}
        </span>
      </div>

      <div className="relative mx-auto hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
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
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.message}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
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
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
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
