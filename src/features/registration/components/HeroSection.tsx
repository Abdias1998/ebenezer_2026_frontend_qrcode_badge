"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventInfo } from "@/types/registration.types";
import { formatDateRange } from "@/lib/utils";

interface Props {
  event?: EventInfo;
  onScrollToForm: () => void;
}

export function HeroSection({ event, onScrollToForm }: Props) {
  const remaining = event?.remainingSlots ?? 0;
  const urgency = remaining < 200;

  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-royal-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Inscriptions ouvertes
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance"
        >
          Inscription à{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
            {event?.name || "EBENEZER 2026"}
          </span>
        </motion.h1>

        {/* Theme */}
        {event?.theme && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gold-300 font-medium text-sm md:text-base mb-4 italic"
          >
            « {event.theme} »
          </motion.p>
        )}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance"
        >
          {/* Réservez votre place pour vivre cinq jours de restauration, d'enseignement et
          d'adoration. */}
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {event && (
            <div className="glass-card px-4 py-3 flex items-center gap-2.5 text-white">
              <Calendar className="w-4 h-4 text-gold-300" />
              <span className="text-sm font-medium">
                {formatDateRange(event.startDate, event.endDate)}
              </span>
            </div>
          )}

          {event?.location && (
            <div className="glass-card px-4 py-3 flex items-center gap-2.5 text-white">
              <MapPin className="w-4 h-4 text-gold-300" />
              <span className="text-sm font-medium">{event.location}</span>
            </div>
          )}

          <div
            className={`glass-card px-4 py-3 flex items-center gap-2.5 ${urgency ? "border-red-400/40" : ""}`}
          >
            <Users className={`w-4 h-4 ${urgency ? "text-red-400" : "text-gold-300"}`} />
            <span className={`text-sm font-medium ${urgency ? "text-red-300" : "text-white"}`}>
              {remaining > 0 ? (
                <>
                  <span className="font-bold">{remaining.toLocaleString()}</span> place
                  {remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
                  {urgency && " — Dépêchez-vous !"}
                </>
              ) : (
                <span className="text-red-300 font-semibold">Complet</span>
              )}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 text-white font-bold text-base shadow-glow-gold hover:from-gold-600 hover:to-gold-500 transition-all duration-200 active:scale-95"
          >
            Je m'inscris maintenant
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>

        {/* Progress bar */}
        {event && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 max-w-md mx-auto"
          >
            <div className="flex justify-between text-xs text-blue-300 mb-2">
              <span>{event.registeredCount.toLocaleString()} inscrits</span>
              <span>{event.totalSlots.toLocaleString()} places au total</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(event.registeredCount / event.totalSlots) * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <p className="text-xs text-blue-300 mt-1 text-right">
              {Math.round((event.registeredCount / event.totalSlots) * 100)}% des places occupées
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
