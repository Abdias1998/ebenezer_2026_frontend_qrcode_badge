"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, PartyPopper, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/utils";
import type { RegistrationResponse } from "@/types/registration.types";

interface Props {
  result: RegistrationResponse;
  /** Infos complémentaires affichées sous le QR code (libellé → valeur). */
  details?: { label: string; value?: string }[];
  note?: ReactNode;
  onNewRegistration?: () => void;
  /** Couleur d'accent du billet, assortie à la page d'inscription. */
  tone?: "royal" | "navy";
}

const TONES = {
  royal: {
    badge: "bg-royal-50 border-royal-100",
    icon: "text-royal-600",
    text: "text-royal-700",
  },
  navy: {
    badge: "bg-navy-50 border-navy-100",
    icon: "text-navy-600",
    text: "text-navy-800",
  },
} as const;

/** Billet affiché après une inscription : numéro, QR code téléchargeable, récapitulatif. */
export function RegistrationTicket({
  result,
  details = [],
  note,
  onNewRegistration,
  tone = "royal",
}: Props) {
  const colors = TONES[tone];
  const fullName = `${result.participant.firstName} ${result.participant.lastName}`;
  const visibleDetails = details.filter((d) => !!d.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl"
    >
      <div className="form-section text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Inscription confirmée !
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {fullName}, votre place est réservée pour « {result.event.name} ».
        </p>

        <div className={`mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-2 ${colors.badge}`}>
          <PartyPopper className={`w-4 h-4 ${colors.icon}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>
            {result.registrationNumber}
          </span>
        </div>

        {result.qrCode && (
          <>
            <div className="mt-6 mx-auto max-w-[240px] p-4 bg-white rounded-2xl border border-gray-100 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qrCode}
                alt="QR code d'accès"
                className="w-full h-auto"
              />
            </div>
            <Button
              type="button"
              variant={tone}
              size="sm"
              className="mt-4 gap-2 rounded-full"
              onClick={() =>
                downloadImage(result.qrCode, `${result.registrationNumber}.png`)
              }
            >
              <Download className="w-4 h-4" />
              Télécharger mon QR code
            </Button>
          </>
        )}

        {visibleDetails.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {visibleDetails.map((detail) => (
              <div
                key={detail.label}
                className="p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {detail.label}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500">
          {note ??
            "Faites une capture d'écran ou téléchargez votre QR code : il vous sera demandé à l'entrée."}
        </p>

        {onNewRegistration && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4 gap-2"
            onClick={onNewRegistration}
          >
            <UserPlus className="w-4 h-4" />
            Inscrire une autre personne
          </Button>
        )}
      </div>
    </motion.div>
  );
}
