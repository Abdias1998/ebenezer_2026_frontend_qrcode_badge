import type { Metadata } from "next";
import { Suspense } from "react";
import { JeunesPageClient } from "./JeunesPageClient";
import { SkeletonCard } from "@/components/shared/LoadingState";

export const metadata: Metadata = {
  title: "Inscription — Jeûne des Jeunes",
  description:
    "Réserves ta place au Jeûne des Jeunes : choisis la taille de ton t-shirt et ton lieu de prise en charge.",
};

export default function JeunesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-royal-50/50">
          <div className="h-72 hero-gradient animate-pulse" />
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      }
    >
      <JeunesPageClient />
    </Suspense>
  );
}