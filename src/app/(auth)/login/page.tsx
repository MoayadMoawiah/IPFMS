"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeIn } from "@/lib/motion";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import { getAccessToken } from "@/lib/api/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { login, isLoading, error } = useAuth();

  useEffect(() => {
    // Only redirect if there is a real token — guards against stale persisted isAuthenticated
    if (isAuthenticated && getAccessToken()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@gaderon.org",
      password: "Admin@Gaderon2026!",
      remember: true,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    await login({ email: data.email, password: data.password }, data.remember ?? true);
  };

  return (
    <div className="flex min-h-screen">
      <motion.div
        {...fadeIn}
        className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16 xl:px-24"
      >
        <div className="mx-auto w-full max-w-md">
          <Image
            src="/brand/gaderon-logo.png"
            alt="Gaderon Organization for Development"
            width={200}
            height={80}
            className="mb-8 h-16 w-auto"
            priority
            onError={() => {/* ignore missing logo in dev */}}
          />

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to Gaderon G-GPFMS ERP
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@gaderon.org"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={watch("remember")}
                  onCheckedChange={(checked) =>
                    setValue("remember", checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            Powered by Gaderon &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl font-bold text-primary mb-4">G-GPFMS</div>
            <div className="text-xl text-muted-foreground">
              Grants, Procurement &amp; Financial Management
            </div>
            <div className="text-muted-foreground mt-2">
              Enterprise ERP for Humanitarian Organizations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
