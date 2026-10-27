"use client";

import { useCallback, useEffect, useState } from "react";
import type { RegistrationResponse } from "@/types/registration.types";

/**
 * Garde le dernier billet obtenu sur cet appareil pour un événement donné :
 * si le participant recharge la page, il retrouve son QR code.
 */
export function useSavedTicket(eventId: string) {
  const storageKey = `ticket:${eventId}`;
  const [ticket, setTicket] = useState<RegistrationResponse | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setTicket(JSON.parse(raw) as RegistrationResponse);
    } catch {
      // stockage indisponible ou corrompu : on affiche le formulaire
    }
  }, [storageKey]);

  const save = useCallback(
    (value: RegistrationResponse) => {
      setTicket(value);
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        // stockage indisponible : sans gravité
      }
    },
    [storageKey],
  );

  const clear = useCallback(() => {
    setTicket(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // stockage indisponible : sans gravité
    }
  }, [storageKey]);

  return { ticket, save, clear };
}
