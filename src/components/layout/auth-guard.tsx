"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { apiGetMe } from "@/lib/api/auth";
import { getAccessToken } from "@/lib/api/client";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        logout();
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      try {
        const user = await apiGetMe();
        setUser(user);
      } catch {
        logout();
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [logout, router, setUser]);

  if (isChecking) {
    return <LoadingSkeleton variant="page" className="p-8" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
