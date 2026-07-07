"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { AuthGuard } from "@/components/layout/auth-guard";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { GrantProvider } from "@/hooks/use-grant-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <GrantProvider>
          <div className="flex h-screen overflow-hidden bg-background">
            <div className="hidden lg:block">
              <AppSidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopNav />
              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </GrantProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
