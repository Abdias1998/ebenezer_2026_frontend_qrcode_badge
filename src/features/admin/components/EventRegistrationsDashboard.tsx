"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  LogOut,
  Mail,
  Phone,
  ScanLine,
  Search,
  Ticket,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { AdminNav, type AdminSection } from "@/components/shared/AdminNav";
import { StatChips } from "@/features/admin/components/StatChips";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { registrationService } from "@/services/registration.service";
import { attendanceService } from "@/services/attendance.service";
import { downloadImage, formatDate } from "@/lib/utils";
import type {
  AdminRegistration,
  RegistrationListParams,
  RegistrationStats,
} from "@/types/registration.types";

const REFRESH_INTERVAL_MS = 15_000;

type PresenceFilter = "" | "checked-in" | "confirmed";

export interface StatFilterConfig {
  title: string;
  icon: ReactNode;
  statsKey: keyof Omit<RegistrationStats, "total">;
  filterKey: keyof RegistrationListParams;
  formatLabel?: (value: string) => string;
}

interface Props {
  eventId: string;
  envVarName: string;
  section: AdminSection;
  title: string;
  icon: ReactNode;
  /** Libellé du public (« pasteurs », « jeunes »). */
  audienceLabel: string;
  statFilters: StatFilterConfig[];
  renderDetails: (registration: AdminRegistration) => ReactNode;
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Tableau de bord d'un événement gratuit : inscrits, présents (scannés à
 * l'arrivée) et absents, avec recherche, filtres et pointage manuel.
 */
export function EventRegistrationsDashboard({
  eventId,
  envVarName,
  section,
  title,
  icon,
  audienceLabel,
  statFilters,
  renderDetails,
}: Props) {
  const { user, isChecking, logout } = useAdminAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminRegistration | null>(null);
  const [filters, setFilters] = useState<RegistrationListParams>({});
  const [presence, setPresence] = useState<PresenceFilter>("");

  const hasEventId = eventId.length > 0;
  const enabled = !isChecking && !!user && hasEventId;

  const appliedFilters: RegistrationListParams = {
    ...filters,
    eventId,
    status: presence || undefined,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["event-registrations", eventId, page, appliedFilters],
    queryFn: () =>
      registrationService.list({ ...appliedFilters, page, limit: 20 }),
    enabled,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  const { data: stats } = useQuery({
    queryKey: ["event-registrations-stats", eventId],
    queryFn: () => registrationService.stats({ eventId }),
    enabled,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  const checkInMutation = useMutation({
    mutationFn: (registrationId: string) =>
      attendanceService.checkIn(registrationId, eventId),
    onSuccess: (result) => {
      const name = `${result.participant.firstName ?? ""} ${result.participant.lastName ?? ""}`.trim();
      toast.success(
        result.alreadyCheckedIn
          ? `${name} était déjà pointé(e) à ${formatTime(result.checkedInAt)}.`
          : `${name} est marqué(e) présent(e).`,
      );
      queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["event-registrations-stats"] });
    },
    onError: (error: any) =>
      toast.error(error?.message || "Impossible de pointer cette personne."),
  });

  const total = stats?.total ?? 0;
  const present =
    stats?.byStatus.find((s) => s.value === "checked-in")?.count ?? 0;
  const absent = Math.max(total - present, 0);

  const setFilter = (key: keyof RegistrationListParams, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
    setPage(1);
  };

  const toggleFilter = (key: keyof RegistrationListParams, value: string) => {
    setFilter(key, filters[key] === value ? "" : value);
  };

  const togglePresence = (value: PresenceFilter) => {
    setPresence((current) => (current === value ? "" : value));
    setPage(1);
  };

  const hasActiveFilters =
    !!presence || Object.values(filters).some((v) => !!v);

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
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {icon}
              {title}
            </h1>
            {user && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminNav active={section} />
            <Button asChild variant="royal" size="sm" className="gap-1.5">
              <Link href={`/admin/scanner?event=${eventId}`}>
                <ScanLine className="w-3.5 h-3.5" />
                Scanner les arrivées
              </Link>
            </Button>
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
            <code className="font-mono text-xs">{envVarName}</code>{" "}
            (identifiant de l&apos;événement).
          </div>
        )}

        {hasEventId && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <CounterTile
                label="Inscrits"
                value={total}
                icon={<Users className="w-4 h-4" />}
                active={presence === ""}
                onClick={() => togglePresence("")}
                tone="gray"
              />
              <CounterTile
                label="Présents"
                value={present}
                icon={<UserCheck className="w-4 h-4" />}
                active={presence === "checked-in"}
                onClick={() => togglePresence("checked-in")}
                tone="green"
              />
              <CounterTile
                label="Absents"
                value={absent}
                icon={<UserX className="w-4 h-4" />}
                active={presence === "confirmed"}
                onClick={() => togglePresence("confirmed")}
                tone="amber"
              />
            </div>

            {total > 0 && (
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.round((present / total) * 100)}%` }}
                />
              </div>
            )}

            <div className="form-section space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Rechercher (nom, prénom, email, téléphone)"
                  value={filters.search ?? ""}
                  onChange={(e) => setFilter("search", e.target.value)}
                />
              </div>

              {stats && (
                <div className="space-y-3">
                  {statFilters.map((cfg) => (
                    <StatChips
                      key={cfg.filterKey}
                      title={cfg.title}
                      icon={cfg.icon}
                      items={stats[cfg.statsKey] ?? []}
                      activeValue={(filters[cfg.filterKey] as string) ?? ""}
                      filterKey={cfg.filterKey}
                      onToggle={toggleFilter}
                      formatLabel={cfg.formatLabel}
                    />
                  ))}
                </div>
              )}

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-gray-600"
                  onClick={() => {
                    setFilters({});
                    setPresence("");
                    setPage(1);
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </>
        )}

        {data && (
          <p className="text-sm text-gray-500">
            {data.meta.total} {audienceLabel}
            {hasActiveFilters ? " correspondant aux filtres" : " inscrits"}.
            <span className="text-gray-400"> Actualisation automatique.</span>
          </p>
        )}

        {isLoading && <LoadingState message="Chargement des inscrits..." />}

        {isError && (
          <ErrorState
            type="network"
            onRetry={() => refetch()}
            message="Impossible de charger les inscrits."
          />
        )}

        {data && data.items.length === 0 && (
          <div className="form-section text-center py-16 text-gray-500">
            Aucun inscrit pour le moment.
          </div>
        )}

        {data?.items.map((registration) => (
          <RegistrationRow
            key={registration._id}
            registration={registration}
            details={renderDetails(registration)}
            onShowQr={() => setSelected(registration)}
            onCheckIn={() => checkInMutation.mutate(registration.id)}
            checkingIn={
              checkInMutation.isPending &&
              checkInMutation.variables === registration.id
            }
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

      <QrDialog registration={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

const TONES = {
  gray: "text-gray-700 bg-white border-gray-200",
  green: "text-green-700 bg-green-50 border-green-200",
  amber: "text-amber-700 bg-amber-50 border-amber-200",
};

function CounterTile({
  label,
  value,
  icon,
  active,
  onClick,
  tone,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  tone: keyof typeof TONES;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 sm:p-4 text-left transition-shadow ${TONES[tone]} ${
        active ? "ring-2 ring-royal-500" : "hover:shadow-sm"
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </span>
      <span className="mt-1 block text-2xl sm:text-3xl font-bold tabular-nums">
        {value}
      </span>
    </button>
  );
}

function RegistrationRow({
  registration,
  details,
  onShowQr,
  onCheckIn,
  checkingIn,
}: {
  registration: AdminRegistration;
  details: ReactNode;
  onShowQr: () => void;
  onCheckIn: () => void;
  checkingIn: boolean;
}) {
  const fullName = `${registration.participant?.firstName ?? ""} ${
    registration.participant?.lastName ?? ""
  }`.trim();
  const isPresent = registration.status === "checked-in";

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
            {isPresent ? (
              <Badge variant="success" className="shrink-0 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Présent
                {registration.checkedInAt &&
                  ` · ${formatTime(registration.checkedInAt)}`}
              </Badge>
            ) : registration.status === "cancelled" ? (
              <Badge variant="destructive" className="shrink-0">
                Annulé
              </Badge>
            ) : (
              <Badge variant="warning" className="shrink-0">
                Pas encore arrivé
              </Badge>
            )}
          </div>

          <p className="text-xs font-mono text-gray-500 mb-2">
            {registration.registrationNumber}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {registration.participant?.phone && (
              <a
                href={`tel:${registration.participant.phone}`}
                className="flex items-center gap-1 hover:text-royal-700"
              >
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {registration.participant.phone}
              </a>
            )}
            {registration.participant?.email && (
              <span className="flex items-center gap-1 min-w-0">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {registration.participant.email}
                </span>
              </span>
            )}
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            {details}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-xs text-gray-400">
              Inscrit le {formatDate(registration.createdAt)}
            </p>
            {!isPresent && registration.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                loading={checkingIn}
                onClick={onCheckIn}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Marquer présent
              </Button>
            )}
          </div>
        </div>

        {registration.qrCode && (
          <button
            type="button"
            onClick={onShowQr}
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
            onClick={() => {
              downloadImage(
                registration.qrCode,
                `${registration.registrationNumber}.png`,
              );
              toast.success("QR code téléchargé.");
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger le QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
