"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, type AdminUser } from "@/services/auth.service";

/** Redirects to /admin/login if there's no stored session; otherwise exposes the current admin user. */
export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setUser(authService.getCurrentUser());
    setIsChecking(false);
  }, [router]);

  const logout = () => {
    authService.logout();
    router.replace("/admin/login");
  };

  return { user, isChecking, logout };
}
