"use client";

import { useState } from "react";
import { CalendarDays, Lock, MapPin, Shirt, Send, Users } from "lucide-react";
import { JDJ_EVENT_NAME } from "@/features/jeunes/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function JeunesPageClient() {
  const [showClosed, setShowClosed] = useState(true);

  return (
    <main className="min-h-screen bg-royal-50/50">
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,0.35),_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 py-14 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            Événement jeunesse
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-display font-bold tracking-tight text-balance">
            {JDJ_EVENT_NAME}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-royal-100/90 leading-relaxed">
            Cinq voix, un même appel : rejoins-nous samedi 26 septembre 2026
            pour une journée de restauration, d'adoration et d'enseignement
            prophétique.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
              <CalendarDays className="w-4 h-4 text-gold-300" />
              Samedi 26 septembre 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
              <MapPin className="w-4 h-4 text-gold-300" />
              Lomé, Togo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
              <Shirt className="w-4 h-4 text-gold-300" />
              T-shirt
            </span>
          </div>
        </div>

        <div className="relative -mb-6 flex justify-center" aria-hidden>
          <div className="h-6 sm:h-8 w-full max-w-3xl bg-royal-50/50 rounded-t-[2rem] mx-4" />
        </div>
      </section>

      {/* Inscriptions fermées */}
      <section className="max-w-3xl mx-auto px-4 pb-16 pt-16 sm:pt-20">
        <div className="form-section py-12 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-royal-100 text-royal-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Inscriptions clôturées
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Les inscriptions et les paiements pour le {JDJ_EVENT_NAME} sont
            désormais fermés. Merci à toutes celles et ceux qui se sont déjà
            inscrits !
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-gray-500 max-w-sm">
            Des questions ? Écrivez-nous au{" "}
            <strong>+229 01 49 87 28 28</strong> sur WhatsApp.
          </p>
          <a
            href="https://wa.me/2290149872828"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold text-white px-5 py-2.5 text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Nous écrire sur WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p className="font-medium text-white mb-1">
          Jeûne des Jeunes {new Date().getFullYear()}
        </p>
        <p>Plateforme d'inscription officielle</p>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <a href="/inscription/jeune-des-jeunes" className="hover:text-white transition-colors">
            Jeûne des Jeunes
          </a>
          <span>·</span>
          <a href="https://wa.me/2290149872828" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </footer>

      {/* Modal d'arrivée : inscriptions clôturées */}
      <Dialog open={showClosed} onOpenChange={setShowClosed}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-royal-600" />
              Inscriptions clôturées
            </DialogTitle>
            <DialogDescription>
              Les inscriptions et les paiements pour le {JDJ_EVENT_NAME} sont
              désormais fermés. Plus aucune demande ne sera acceptée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="royal" onClick={() => setShowClosed(false)}>
              Compris
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}