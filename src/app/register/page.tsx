import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterPageClient } from "./RegisterPageClient";
import { SkeletonCard } from "@/components/shared/LoadingState";

export const metadata: Metadata = {
  title: "Inscription — EBENEZER",
  description: "Inscrivez-vous à l'événement EBENEZER et réservez votre place dès maintenant.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="h-64 bg-gradient-hero animate-pulse" />
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      }
    >
      <RegisterPageClient />
    </Suspense>
  );
}
