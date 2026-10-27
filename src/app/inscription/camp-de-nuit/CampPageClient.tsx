"use client";

import { CalendarDays, MapPin, MoonStar, QrCode } from "lucide-react";
import { EventLanding } from "@/components/shared/EventLanding";
import { CampForm } from "@/features/camp/components/CampForm";
import {
  CAMP_DATE_LABEL,
  CAMP_EVENT_ID,
  CAMP_EVENT_NAME,
  CAMP_LOCATION_LABEL,
} from "@/features/camp/constants";

export function CampPageClient() {
  return (
    <EventLanding
      kicker={{ icon: <MoonStar className="w-3.5 h-3.5" />, label: "Événement jeunesse" }}
      title={CAMP_EVENT_NAME}
      description="Une nuit entière de prière, d'adoration et de communion. Inscris-toi gratuitement : ton QR code sera scanné à ton arrivée au camp."
      chips={[
        { icon: <CalendarDays className="w-4 h-4 text-gold-300" />, label: CAMP_DATE_LABEL },
        { icon: <MapPin className="w-4 h-4 text-gold-300" />, label: CAMP_LOCATION_LABEL },
        { icon: <QrCode className="w-4 h-4 text-gold-300" />, label: "Entrée sur QR code" },
      ]}
      footerTitle={`${CAMP_EVENT_NAME} ${new Date().getFullYear()}`}
    >
      <CampForm eventId={CAMP_EVENT_ID} />
    </EventLanding>
  );
}
