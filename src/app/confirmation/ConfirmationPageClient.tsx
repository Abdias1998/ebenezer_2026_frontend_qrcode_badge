"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Home,
  Calendar,
  MapPin,
  Hash,
  Clock,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticipantBadge } from "@/features/registration/components/ParticipantBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import type { RegistrationResponse } from "@/types/registration.types";
import { formatDate, downloadFile } from "@/lib/utils";

export function ConfirmationPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [registration, setRegistration] = useState<RegistrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Retrieve from sessionStorage (set by useRegistration hook)
    const stored = sessionStorage.getItem("ebenezer_registration");
    if (stored) {
      try {
        const data: RegistrationResponse = JSON.parse(stored);
        if (!id || data.id === id) {
          setRegistration(data);
          setIsLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    // If not in session, show error (would need backend fetch)
    setError(true);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Chargement de votre confirmation..." size="lg" />
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ErrorState
            title="Confirmation introuvable"
            message="Impossible de récupérer votre confirmation. Vérifiez votre email de confirmation."
          />
          <Button onClick={() => router.push("/register")} className="mt-4 gap-2">
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Mon inscription EBENEZER",
        text: `Je suis inscrit(e) à ${registration.event?.name} ! N° ${registration.registrationNumber}`,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header success banner */}
      <div className="hero-gradient py-16 px-4 print:hidden">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-400/20 border-4 border-green-400/40 mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Inscription confirmée !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-blue-200 text-lg"
          >
            Votre inscription a été enregistrée avec succès. À très bientôt !
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Badge */}
        {registration.qrCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ParticipantBadge
              firstName={registration.participant?.firstName}
              lastName={registration.participant?.lastName}
              photoUrl={registration.participant?.photo}
              qrCodeUrl={registration.qrCode}
              registrationNumber={registration.registrationNumber}
              eventName={registration.event?.name}
              eventStartDate={registration.event?.startDate}
              eventEndDate={registration.event?.endDate}
              eventLocation={registration.event?.location}
            />
          </motion.div>
        )}

        {/* Registration card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="form-section print:hidden"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Détails de l'inscription</h2>
              <p className="text-sm text-gray-500 mt-0.5">Conservez ces informations</p>
            </div>
            <Badge variant="success" className="gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              {registration.status === "confirmed" ? "Confirmé" : "En attente"}
            </Badge>
          </div>

          <div className="space-y-3">
            <InfoRow
              icon={<Hash className="w-4 h-4 text-royal-600" />}
              label="Numéro d'inscription"
              value={registration.registrationNumber}
              highlight
            />
            {registration.event && (
              <>
                <InfoRow
                  icon={<Calendar className="w-4 h-4 text-gray-500" />}
                  label="Événement"
                  value={registration.event.name}
                />
                <InfoRow
                  icon={<MapPin className="w-4 h-4 text-gray-500" />}
                  label="Lieu"
                  value={registration.event.location}
                />
              </>
            )}
            <InfoRow
              icon={<Clock className="w-4 h-4 text-gray-500" />}
              label="Date d'inscription"
              value={formatDate(registration.createdAt)}
            />
          </div>
        </motion.div>

        {/* Info notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-5 print:hidden"
        >
          <p className="text-sm text-blue-700 font-medium mb-2">
            📧 Un email de confirmation vous a été envoyé
          </p>
          <p className="text-xs text-blue-600">
            Vous recevrez vos détails d'inscription et votre QR code à l'adresse email fournie
            lors de l'inscription. Vérifiez également vos spams.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden"
        >
          {registration.badgePdf && (
            <Button
              variant="outline"
              className="gap-2 w-full"
              onClick={() =>
                downloadFile(
                  registration.badgePdf!,
                  `Badge-${registration.registrationNumber}.pdf`,
                )
              }
            >
              <Download className="w-4 h-4" />
              Mon badge PDF
            </Button>
          )}

          <Button
            variant="outline"
            className="gap-2 w-full"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>

          <Button
            variant="royal"
            className="gap-2 w-full"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 print:hidden"
        >
          <p className="text-2xl font-bold text-gray-900 mb-2">🙏</p>
          <p className="text-gray-500 text-sm">
            « Et jusqu'ici l'Éternel nous a secourus. »
          </p>
          <p className="text-xs text-gray-400 mt-1">1 Samuel 7:12</p>
        </motion.div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${highlight ? "bg-royal-50 border border-royal-100" : "bg-gray-50"}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={`text-sm font-semibold truncate ${highlight ? "text-royal-700" : "text-gray-800"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
