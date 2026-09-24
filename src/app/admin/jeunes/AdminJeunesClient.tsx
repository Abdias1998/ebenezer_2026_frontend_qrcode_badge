"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Church,
  Download,
  FileDown,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  Shirt,
  Ticket,
  User,
  UserPlus,
  Wallet,
  X,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { registrationService } from "@/services/registration.service";
import { downloadFile, downloadImage, formatDate } from "@/lib/utils";
import type {
  AdminRegistration,
  RegistrationListParams,
} from "@/types/registration.types";
import {
  TSHIRT_SIZES,
  PICKUP_LOCATIONS,
  PAYMENT_NETWORKS,
  JDJ_REGISTRATION_FEE,
} from "@/features/jeunes/constants";

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

function StatChips({
  title,
  icon,
  items,
  activeValue,
  filterKey,
  onToggle,
}: {
  title: string;
  icon: ReactNode;
  items: { value: string; count: number }[];
  activeValue: string;
  filterKey: keyof RegistrationListParams;
  onToggle: (key: keyof RegistrationListParams, value: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
        {icon}
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = activeValue === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(filterKey, item.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-royal-600 text-white border-royal-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-royal-300 hover:text-royal-700"
              }`}
            >
              {item.value} · {item.count}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminJeunesClient() {
  const { user, isChecking, logout } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminRegistration | null>(null);
  const [showRattrapage, setShowRattrapage] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<RegistrationListParams>({});

  const hasEventId = JDJ_EVENT_ID.length > 0;

  const appliedFilters = {
    eventId: hasEventId ? JDJ_EVENT_ID : undefined,
    paid: true,
    tshirtSize: filters.tshirtSize || undefined,
    pickupLocation: filters.pickupLocation || undefined,
    city: filters.city || undefined,
    church: filters.church || undefined,
    paymentNetwork: filters.paymentNetwork || undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jeunes-paid-registrations", page, appliedFilters],
    queryFn: () => registrationService.list({ ...appliedFilters, page, limit: 20 }),
    enabled: !isChecking && !!user,
  });

  const {
    data: stats,
    isError: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["jeunes-registrations-stats", JDJ_EVENT_ID],
    queryFn: () =>
      registrationService.stats({
        eventId: hasEventId ? JDJ_EVENT_ID : undefined,
        paid: true,
      }),
    enabled: !isChecking && !!user,
  });

  const setFilter = (key: keyof RegistrationListParams, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
    setPage(1);
  };

  const toggleFilter = (key: keyof RegistrationListParams, value: string) => {
    const isActive = filters[key] === value;
    setFilter(key, isActive ? "" : value);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleExport = async () => {
    if (!hasEventId) {
      toast.error("Identifiant d'événement manquant.");
      return;
    }
    setExporting(true);
    try {
      const blob = await registrationService.exportListToPdf({
        eventId: JDJ_EVENT_ID,
        paid: true,
      });
      const url = URL.createObjectURL(blob);
      downloadFile(url, "inscrits-jeunes-des-jeunes.pdf");
      URL.revokeObjectURL(url);
      toast.success("PDF généré avec succès.");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de générer le PDF.");
    } finally {
      setExporting(false);
    }
  };

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
              disabled={!hasEventId}
              onClick={() => setShowRattrapage(true)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Rattrapage
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={exporting}
              onClick={handleExport}
            >
              <FileDown className="w-3.5 h-3.5" />
              {exporting ? "Génération..." : "Exporter le PDF"}
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
            <code className="font-mono text-xs">NEXT_PUBLIC_JDJ_EVENT_ID</code>{" "}
            (identifiant de l'événement) pour filtrer les paiements.
          </div>
        )}

        {hasEventId && (
          <div className="form-section space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Rechercher (nom, prénom, email, téléphone)"
                  value={filters.search ?? ""}
                  onChange={(e) => setFilter("search", e.target.value)}
                />
              </div>
              <div>
                <Select
                  value={filters.paymentNetwork ?? ""}
                  onValueChange={(v) => setFilter("paymentNetwork", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Réseau de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_NETWORKS.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.status ?? ""}
                  onValueChange={(v) => setFilter("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                      <SelectItem key={value} value={value}>
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {stats && (
              <div className="space-y-3">
                <StatChips
                  title="Taille de t-shirt"
                  icon={<Shirt className="w-3.5 h-3.5" />}
                  items={stats.byTshirtSize}
                  activeValue={filters.tshirtSize ?? ""}
                  filterKey="tshirtSize"
                  onToggle={toggleFilter}
                />
                <StatChips
                  title="Lieu de prise en charge"
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  items={stats.byPickupLocation}
                  activeValue={filters.pickupLocation ?? ""}
                  filterKey="pickupLocation"
                  onToggle={toggleFilter}
                />
                <StatChips
                  title="Ville"
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  items={stats.byCity}
                  activeValue={filters.city ?? ""}
                  filterKey="city"
                  onToggle={toggleFilter}
                />
                <StatChips
                  title="Église / organisation"
                  icon={<Church className="w-3.5 h-3.5" />}
                  items={stats.byChurch}
                  activeValue={filters.church ?? ""}
                  filterKey="church"
                  onToggle={toggleFilter}
                />
              </div>
            )}

            {Object.values(filters).some((v) => !!v) && !statsError && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-gray-600"
                onClick={resetFilters}
              >
                <X className="w-3.5 h-3.5" />
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        )}

        {statsError && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <span>
              Impossible de charger les compteurs (lieux, tailles). Assurez-vous
              que le backend a été redémarré avec les dernières modifications.
            </span>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => refetchStats()}
            >
              Réessayer
            </Button>
          </div>
        )}

        {data && (
          <p className="text-sm text-gray-500">
            Nombre d'inscrits :{" "}
            <span className="font-semibold text-gray-700">
              {stats?.total ?? data.meta.total}
            </span>{" "}
            personne
            {(stats?.total ?? data.meta.total) > 1 ? "s" : ""} ont payé pour
            le Jeûne des Jeunes.
            {stats && data.meta.total !== stats.total && (
              <span className="text-gray-400">
                {" "}
                — {data.meta.total} résultat
                {data.meta.total > 1 ? "s" : ""} correspondant
                {data.meta.total > 1 ? "s" : ""} aux filtres.
              </span>
            )}
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

      <RattrapageDialog
        eventId={JDJ_EVENT_ID}
        open={showRattrapage}
        onClose={() => setShowRattrapage(false)}
        onCreated={() => {
          setShowRattrapage(false);
          refetch();
          refetchStats();
        }}
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

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            {registration.participant?.tshirtSize && (
              <span className="flex items-center gap-1">
                <Shirt className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                T-shirt :{" "}
                <span className="font-medium text-gray-700">
                  {registration.participant.tshirtSize}
                </span>
              </span>
            )}
            {registration.participant?.pickupLocation && (
              <span className="flex items-center gap-1 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Prise en charge :{" "}
                <span className="font-medium text-gray-700 truncate">
                  {registration.participant.pickupLocation}
                </span>
              </span>
            )}
            {registration.participant?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Ville :{" "}
                <span className="font-medium text-gray-700">
                  {registration.participant.city}
                </span>
              </span>
            )}
            {registration.participant?.country && (
              <span className="flex items-center gap-1">
                Pays :{" "}
                <span className="font-medium text-gray-700">
                  {registration.participant.country}
                </span>
              </span>
            )}
            {registration.participant?.church && (
              <span className="flex items-center gap-1 sm:col-span-2">
                <Church className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Église :{" "}
                <span className="font-medium text-gray-700 truncate">
                  {registration.participant.church}
                </span>
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {network && (
              <span>
                Réseau :{" "}
                <span className="font-medium text-gray-700">{network}</span>
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

const EMPTY_RATTRAPAGE_FORM = {
  paymentRef: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  country: "Bénin",
  church: "",
  tshirtSize: "",
  pickupLocation: "",
  paymentNetwork: "",
  paymentPhone: "",
  paymentAmount: JDJ_REGISTRATION_FEE,
};

type RattrapageStringField = Exclude<
  keyof typeof EMPTY_RATTRAPAGE_FORM,
  "paymentAmount"
>;

function RattrapageDialog({
  eventId,
  open,
  onClose,
  onCreated,
}: {
  eventId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState(EMPTY_RATTRAPAGE_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm(EMPTY_RATTRAPAGE_FORM);
  }, [open]);

  const set =
    (key: RattrapageStringField) =>
    (value: string) =>
      setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    const required: Array<[RattrapageStringField, string]> = [
      ["paymentRef", "la référence de paiement"],
      ["firstName", "le prénom"],
      ["lastName", "le nom"],
      ["phone", "le numéro de téléphone"],
      ["city", "la ville"],
    ];
    for (const [key, label] of required) {
      if (!form[key].trim()) {
        toast.error(`Veuillez renseigner ${label}.`);
        return;
      }
    }
    if (!eventId) {
      toast.error(
        "Identifiant d'événement manquant (NEXT_PUBLIC_JDJ_EVENT_ID).",
      );
      return;
    }

    setSubmitting(true);
    try {
      const registration = await registrationService.rattrapage({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || undefined,
        phone: form.phone,
        city: form.city,
        country: form.country,
        church: form.church || undefined,
        tshirtSize: form.tshirtSize || undefined,
        pickupLocation: form.pickupLocation || undefined,
        eventId,
        paymentRef: form.paymentRef,
        paymentNetwork: form.paymentNetwork || undefined,
        paymentPhone: form.paymentPhone || undefined,
        paymentAmount: Number(form.paymentAmount) || undefined,
      });
      toast.success(
        `Inscription ${registration.registrationNumber} créée avec succès.`,
      );
      onCreated();
    } catch (error: any) {
      const message = error?.message || "Impossible de créer l'inscription.";
      toast.error(message);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-royal-600" />
            Rattrapage d'un paiement
          </DialogTitle>
          <DialogDescription>
            Créez une inscription à partir d'une référence de paiement FeexPay
            déjà confirmée (ex. paiement Celtiis non enregistré).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div>
            <Label htmlFor="rt-paymentRef" className="field-label">
              Référence de paiement FeexPay{" "}
              <span className="required-star">*</span>
            </Label>
            <Input
              id="rt-paymentRef"
              className="font-mono text-xs"
              placeholder="AG_20260917_..."
              value={form.paymentRef}
              onChange={(e) => set("paymentRef")(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rt-lastName" className="field-label">
                Nom <span className="required-star">*</span>
              </Label>
              <Input
                id="rt-lastName"
                value={form.lastName}
                onChange={(e) => set("lastName")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rt-firstName" className="field-label">
                Prénom(s) <span className="required-star">*</span>
              </Label>
              <Input
                id="rt-firstName"
                value={form.firstName}
                onChange={(e) => set("firstName")(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rt-email" className="field-label">
                Email
              </Label>
              <Input
                id="rt-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rt-phone" className="field-label">
                Téléphone <span className="required-star">*</span>
              </Label>
              <Input
                id="rt-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rt-city" className="field-label">
                Ville <span className="required-star">*</span>
              </Label>
              <Input
                id="rt-city"
                value={form.city}
                onChange={(e) => set("city")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rt-country" className="field-label">
                Pays
              </Label>
              <Input
                id="rt-country"
                value={form.country}
                onChange={(e) => set("country")(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rt-church" className="field-label">
              Église / Organisation
            </Label>
            <Input
              id="rt-church"
              value={form.church}
              onChange={(e) => set("church")(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rt-tshirt" className="field-label">
                Taille de t-shirt
              </Label>
              <Select value={form.tshirtSize} onValueChange={set("tshirtSize")}>
                <SelectTrigger id="rt-tshirt">
                  <SelectValue placeholder="Choisir la taille" />
                </SelectTrigger>
                <SelectContent>
                  {TSHIRT_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rt-pickup" className="field-label">
                Lieu de prise en charge
              </Label>
              <Select
                value={form.pickupLocation}
                onValueChange={set("pickupLocation")}
              >
                <SelectTrigger id="rt-pickup">
                  <SelectValue placeholder="Choisir le lieu" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {PICKUP_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rt-network" className="field-label">
                Réseau de paiement
              </Label>
              <Select
                value={form.paymentNetwork}
                onValueChange={set("paymentNetwork")}
              >
                <SelectTrigger id="rt-network">
                  <SelectValue placeholder="Choisir le réseau" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_NETWORKS.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rt-paymentPhone" className="field-label">
                Numéro Mobile Money
              </Label>
              <Input
                id="rt-paymentPhone"
                type="tel"
                value={form.paymentPhone}
                onChange={(e) => set("paymentPhone")(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rt-amount" className="field-label">
              Montant payé (FCFA)
            </Label>
            <Input
              id="rt-amount"
              type="number"
              min={0}
              value={form.paymentAmount}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  paymentAmount: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button
              variant="royal"
              loading={submitting}
              className="gap-1.5"
              onClick={handleSubmit}
            >
              <UserPlus className="w-4 h-4" />
              Créer l'inscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}