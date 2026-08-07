"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registrationService } from "@/services/registration.service";
import type { RegistrationFormData, RegistrationResponse } from "@/types/registration.types";
import { fileToBase64 } from "@/lib/utils";
import { toast } from "sonner";

export function useRegistration(eventId: string) {
  const router = useRouter();

  return useMutation<RegistrationResponse, any, RegistrationFormData>({
    mutationFn: (data) => registrationService.createRegistration(data, eventId),

    onSuccess: async (data, variables) => {
      // Store in sessionStorage for confirmation page. The photo is never
      // uploaded to the server, so it's embedded here as a data URL purely
      // for rendering the badge on the confirmation page.
      if (typeof window !== "undefined") {
        let toStore: RegistrationResponse = data;
        if (variables.photo instanceof File) {
          try {
            const photoDataUrl = await fileToBase64(variables.photo);
            toStore = { ...data, participant: { ...data.participant, photo: photoDataUrl } };
          } catch {
            // Badge preview will fall back to initials if this fails.
          }
        }
        sessionStorage.setItem("ebenezer_registration", JSON.stringify(toStore));
        // Clear persisted form data
        localStorage.removeItem("ebenezer_form_draft");
      }
      toast.success("Inscription réussie !");
      router.push(`/confirmation?id=${data.id}`);
    },

    onError: (error: any) => {
      const message = error?.message || "Une erreur est survenue lors de l'inscription";

      if (message.toLowerCase().includes("déjà") || error?.statusCode === 409) {
        toast.error("Vous êtes déjà inscrit(e) à cet événement.");
      } else if (error?.statusCode === 400) {
        toast.error("Données invalides. Veuillez vérifier le formulaire.");
      } else if (message.includes("complet") || error?.statusCode === 410) {
        toast.error("L'événement est complet. Il n'y a plus de places disponibles.");
      } else {
        toast.error(message);
      }
    },
  });
}
