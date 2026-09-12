"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Download,
  LogOut,
  Mail,
  Phone,
  Ticket,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { registrationService } from "@/services/registration.service";
import { downloadImage, formatDate } from "@/lib/utils";
import type { AdminRegistration } from "@/types/registration.types";

const JDJ_EVENT_ID = process.env.NEXT_PUBLIC_JDJ_EVENT_ID || "";

const NETWORK_LABELS: Record<string, string> = {
  mtn: "MTN",
  moov: "Moov",
  celtiis_bj: "Celtiis",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "warning" | "success" | "royal" | "destructive" }
> = {
  pending: { label: "En attente", variant: "warning" },
  confirmed: { label: "Confirmé", variant: "success" },
  "checked-in": { label: "Présent", variant: "royal" },
  cancelled: { label: "Annulé", variant: "destructive" },
};

function formatAmount(amount?: number): string {
  if (amount == null) return "";
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function AdminJeunesClient() {
  const { user, isChecking, logout } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminRegistration | null>(null);

  const hasEventId = JDJ_EVENT_ID.length > 0;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jeunes-paid-registrations", page],
    queryFn: () =>
      registrationService.list({
        eventId: hasEventId ? JDJ_EVENT_ID : undefined,
        paid: true,
        page,
        limit: 20,
      }),
    enabled: !isChecking && !!user,
  });

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Vérification de la session..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-royal-600" />
              Payements — Jeûne des Jeunes
            </h1>
            {user && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 mr-2">
              <Link
                href="/admin/suggestions"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Suggestions
              </Link>
              <Link
                href="/admin/recruitments"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Recrutements
              </Link>
              <Link
                href="/admin/jeunes"
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-royal-100 text-royal-700"
              >
                Jeûne des Jeunes
              </Link>
            </nav>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {!hasEventId && (
          <div className="form-section text-center py-6 text-sm text-amber-700 border border-amber-200 bg-amber-50">
            Configuration requise : renseignez{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_JDJ_EVENT_ID</code>{" "}
            (identifiant de l'événement) pour filtrer les paiements.
          </div>
        )}

        {data && (
          <p className="text-sm text-gray-500">
            {data.meta.total} personne
            {data.meta.total > 1 ? "s" : ""} a
            {data.meta.total > 1 ? "ont" : ""} payé pour le Jeûne des Jeunes.
          </p>
        )}

        {isLoading && <LoadingState message="Chargement des paiements..." />}

        {isError && (
          <ErrorState
            type="network"
            onRetry={() => refetch()}
            message="Impossible de charger les paiements."
          />
        )}

        {data && data.items.length === 0 && (
          <div className="form-section text-center py-16 text-gray-500">
            Aucun paiement enregistré pour le moment.
          </div>
        )}

        {data?.items.map((registration) => (
          <RegistrationCard
            key={registration._id}
            registration={registration}
            onSelect={() => setSelected(registration)}
          />
        ))}

        {data && data.meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-500">
              Page {data.meta.page} / {data.meta.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>

      <QrDialog
        registration={selected}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

function RegistrationCard({
  registration,
  onSelect,
}: {
  registration: AdminRegistration;
  onSelect: () => void;
}) {
  const statusCfg = STATUS_CONFIG[registration.status] ?? STATUS_CONFIG.pending;
  const fullName = `${registration.participant?.firstName ?? ""} ${
    registration.participant?.lastName ?? ""
  }`.trim();
  const network = registration.paymentNetwork
    ? NETWORK_LABELS[registration.paymentNetwork] ??
      registration.paymentNetwork
    : null;
  const amount = formatAmount(registration.paymentAmount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="form-section"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 truncate">
              {fullName || "Participant"}
            </span>
            <Badge variant={statusCfg.variant} className="shrink-0">
              {statusCfg.label}
            </Badge>
          </div>

          <p className="text-xs font-mono text-gray-500 mb-2">
            {registration.registrationNumber}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {registration.participant?.email && (
              <span className="flex items-center gap-1 min-w-0">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{registration.participant.email}</span>
              </span>
            )}
            {registration.participant?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {registration.participant.phone}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {network && (
              <span>
                Réseau : <span className="font-medium text-gray-700">{network}</span>
              </span>
            )}
            {registration.paymentPhone && (
              <span>
                Numéro Mobile Money :{" "}
                <span className="font-medium text-gray-700">
                  {registration.paymentPhone}
                </span>
              </span>
            )}
            {amount && (
              <span>
                Montant :{" "}
                <span className="font-medium text-gray-700">{amount}</span>
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Payé le {formatDate(registration.createdAt)}
          </p>
        </div>

        {registration.qrCode && (
          <button
            type="button"
            onClick={onSelect}
            aria-label={`Voir le QR code ${registration.registrationNumber}`}
            className="shrink-0 rounded-xl border border-gray-200 bg-white p-1 hover:border-royal-300 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={registration.qrCode}
              alt="QR code"
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function QrDialog({
  registration,
  onClose,
}: {
  registration: AdminRegistration | null;
  onClose: () => void;
}) {
  if (!registration) return null;

  const fullName = `${registration.participant?.firstName ?? ""} ${
    registration.participant?.lastName ?? ""
  }`.trim();

  const downloadQr = () => {
    if (!registration.qrCode) return;
    downloadImage(registration.qrCode, `${registration.registrationNumber}.png`);
    toast.success("QR code téléchargé.");
  };

  return (
    <Dialog open={!!registration} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-royal-600" />
            {registration.registrationNumber}
          </DialogTitle>
          <DialogDescription>{fullName || "Participant"}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 pt-2">
          {registration.qrCode && (
            <div className="rounded-2xl border border-gray-200 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={registration.qrCode}
                alt={`QR ${registration.registrationNumber}`}
                className="w-64 h-64"
              />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={downloadQr}
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger le QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}