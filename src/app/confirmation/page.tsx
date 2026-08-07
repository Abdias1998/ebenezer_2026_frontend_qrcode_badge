import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationPageClient } from "./ConfirmationPageClient";
import { LoadingState } from "@/components/shared/LoadingState";

export const metadata: Metadata = {
  title: "Inscription confirmée — EBENEZER",
  description: "Votre inscription à EBENEZER a été confirmée avec succès.",
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingState message="Chargement de votre confirmation..." size="lg" />
        </div>
      }
    >
      <ConfirmationPageClient />
    </Suspense>
  );
}
