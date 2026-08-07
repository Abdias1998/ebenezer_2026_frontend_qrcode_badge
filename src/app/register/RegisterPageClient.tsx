"use client";

import { useRef } from "react";
import { useEventInfo } from "@/hooks/useEventInfo";
import { HeroSection } from "@/features/registration/components/HeroSection";
import { ParticipantForm } from "@/features/registration/components/ParticipantForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";

export function RegisterPageClient() {
  const formRef = useRef<HTMLDivElement>(null);
  const { data: event, isLoading, isError, refetch } = useEventInfo();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-72 bg-gradient-hero animate-pulse" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <LoadingState message="Chargement de l'événement..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          type="network"
          onRetry={() => refetch()}
          message="Impossible de charger les informations de l'événement."
        />
      </div>
    );
  }

  if (event?.status === "closed" || event?.remainingSlots === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          type="full"
          title="Inscriptions fermées"
          message="Les inscriptions pour cet événement sont actuellement fermées."
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroSection event={event} onScrollToForm={scrollToForm} />

      {/* Form */}
      <div ref={formRef}>
        <ParticipantForm event={event} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p className="font-medium text-white mb-1">EBENEZER {new Date().getFullYear()}</p>
        <p>Plateforme d'inscription officielle</p>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </main>
  );
}
