"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.login(email, password);
      router.push("/admin/suggestions");
    } catch (err: any) {
      setError(err?.message || "Identifiants invalides.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-royal-100 mb-4">
            <ShieldCheck className="w-7 h-7 text-royal-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Espace admin</h1>
          <p className="text-sm text-gray-500 mt-1">EBENEZER 2026</p>
        </div>

        <form onSubmit={onSubmit} className="form-section space-y-4">
          <div>
            <Label htmlFor="email" className="field-label">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="field-label">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" variant="royal" className="w-full gap-2" loading={isSubmitting}>
            <LogIn className="w-4 h-4" />
            Se connecter
          </Button>
        </form>
      </div>
    </main>
  );
}
