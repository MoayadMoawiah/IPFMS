import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donor Portal | Gaderon G-GPFMS",
  description: "Read-only donor portal for grant monitoring and reporting",
};

export default function DonorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              G
            </div>
            <div>
              <p className="font-semibold text-sm">Gaderon G-GPFMS</p>
              <p className="text-xs text-muted-foreground">Donor Portal</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Read-only access</div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
