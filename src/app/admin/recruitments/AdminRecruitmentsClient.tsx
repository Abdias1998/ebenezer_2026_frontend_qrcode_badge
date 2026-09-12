"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  Users,
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
import { recruitmentService } from "@/services/recruitment.service";
import { formatDate } from "@/lib/utils";
import type { Recruitment, RecruitmentStatus } from "@/types/recruitment.types";

const STATUS_CONFIG: Record<
  RecruitmentStatus,
  { label: string; variant: "warning" | "royal" | "success" | "destructive" }
> = {
  pending: { label: "En attente", variant: "warning" },
  reviewed: { label: "Examiné", variant: "royal" },
  accepted: { label: "Accepté", variant: "success" },
  rejected: { label: "Refusé", variant: "destructive" },
};

const STATUS_OPTIONS: RecruitmentStatus[] = ["pending", "reviewed", "accepted", "rejected"];

export function AdminRecruitmentsClient() {
  const { user, isChecking, logout } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recruitments", page],
    queryFn: () => recruitmentService.list(page, 20),
    enabled: !isChecking && !!user,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      recruitmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitments"] });
      toast.success("Statut mis à jour.");
    },
    onError: () => toast.error("Impossible de modifier le statut."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => recruitmentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitments"] });
      setSelectedRecruitment(null);
      toast.success("Candidature supprimée.");
    },
    onError: () => toast.error("Impossible de supprimer cette candidature."),
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
              <Users className="w-5 h-5 text-royal-600" />
              Recrutements
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
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-royal-100 text-royal-700"
              >
                Recrutements
              </Link>
              <Link
                href="/admin/jeunes"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Jeûne des Jeunes
              </Link>
            </nav>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={logout}>
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {isLoading && <LoadingState message="Chargement des candidatures..." />}

        {isError && (
          <ErrorState
            type="network"
            onRetry={() => refetch()}
            message="Impossible de charger les candidatures."
          />
        )}

        {data && data.items.length === 0 && (
          <div className="form-section text-center py-16 text-gray-500">
            Aucune candidature pour le moment.
          </div>
        )}

        {data?.items.map((recruitment) => (
          <RecruitmentCard
            key={recruitment._id}
            recruitment={recruitment}
            onSelect={() => setSelectedRecruitment(recruitment)}
            onStatusChange={(status) =>
              statusMutation.mutate({ id: recruitment._id, status })
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

      <RecruitmentDetailDialog
        recruitment={selectedRecruitment}
        onClose={() => setSelectedRecruitment(null)}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
        onRemove={(id) => removeMutation.mutate(id)}
      />
    </main>
  );
}

function RecruitmentCard({
  recruitment,
  onSelect,
  onStatusChange,
}: {
  recruitment: Recruitment;
  onSelect: () => void;
  onStatusChange: (status: string) => void;
}) {
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const statusCfg = STATUS_CONFIG[recruitment.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="form-section cursor-pointer hover:border-gray-300 transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="font-semibold text-gray-900 truncate">
            {recruitment.firstName} {recruitment.lastName}
          </span>
          <Badge variant={statusCfg.variant} className="shrink-0">
            {statusCfg.label}
          </Badge>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDate(recruitment.createdAt)}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
        {recruitment.email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {recruitment.email}
          </span>
        )}
        {recruitment.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            {recruitment.phone}
          </span>
        )}
        {(recruitment.city || recruitment.country) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {[recruitment.city, recruitment.country].filter(Boolean).join(", ")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 truncate">
          Poste souhaité : <span className="font-medium">{recruitment.desiredPosition}</span>
        </p>
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div
            className="relative"
            onMouseEnter={() => setShowStatusSelect(true)}
            onMouseLeave={() => setShowStatusSelect(false)}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowStatusSelect(!showStatusSelect)}
            >
              Statut
              {showStatusSelect ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
            {showStatusSelect && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border rounded-xl shadow-lg p-1 min-w-[160px]">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                      recruitment.status === s ? "font-semibold bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      onStatusChange(s);
                      setShowStatusSelect(false);
                    }}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecruitmentDetailDialog({
  recruitment,
  onClose,
  onStatusChange,
  onRemove,
}: {
  recruitment: Recruitment | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onRemove: (id: string) => void;
}) {
  if (!recruitment) return null;

  const statusCfg = STATUS_CONFIG[recruitment.status];

  return (
    <Dialog open={!!recruitment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-royal-600" />
            {recruitment.firstName} {recruitment.lastName}
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </DialogTitle>
          <DialogDescription>
            Candidature reçue le {formatDate(recruitment.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <Section title="Informations personnelles">
            <InfoRow label="Nom" value={`${recruitment.firstName} ${recruitment.lastName}`} />
            <InfoRow label="Sexe" value={recruitment.gender === "M" ? "Masculin" : "Féminin"} />
            <InfoRow label="Date de naissance" value={formatDate(recruitment.dateOfBirth)} />
            <InfoRow label="Téléphone" value={recruitment.phone} />
            {recruitment.whatsapp && <InfoRow label="WhatsApp" value={recruitment.whatsapp} />}
            <InfoRow label="Email" value={recruitment.email} />
            {recruitment.address && <InfoRow label="Adresse" value={recruitment.address} />}
            {[recruitment.city, recruitment.country].filter(Boolean).length > 0 && (
              <InfoRow
                label="Ville / Pays"
                value={[recruitment.city, recruitment.country].filter(Boolean).join(", ")}
              />
            )}
          </Section>

          <Section title="Formation">
            <InfoRow label="Niveau d'études" value={recruitment.educationLevel} />
            {recruitment.school && <InfoRow label="École" value={recruitment.school} />}
            {recruitment.fieldOfStudy && (
              <InfoRow label="Domaine d'études" value={recruitment.fieldOfStudy} />
            )}
            {recruitment.graduationYear && (
              <InfoRow label="Année d'obtention" value={String(recruitment.graduationYear)} />
            )}
          </Section>

          <Section title="Expérience professionnelle">
            {recruitment.previousJob && (
              <InfoRow label="Poste précédent" value={recruitment.previousJob} />
            )}
            {recruitment.company && <InfoRow label="Entreprise" value={recruitment.company} />}
            {recruitment.duration && <InfoRow label="Durée" value={recruitment.duration} />}
            {recruitment.skills.length > 0 && (
              <InfoRow label="Compétences" value={recruitment.skills.join(", ")} />
            )}
          </Section>

          <Section title="Informations ecclésiales">
            <InfoRow label="Église" value={recruitment.churchName} />
            {recruitment.pastorName && <InfoRow label="Pasteur" value={recruitment.pastorName} />}
            {recruitment.yearsInChurch && (
              <InfoRow label="Années dans l'église" value={String(recruitment.yearsInChurch)} />
            )}
            {recruitment.currentMinistry && (
              <InfoRow label="Ministère actuel" value={recruitment.currentMinistry} />
            )}
          </Section>

          <Section title="Motivation & engagement">
            <InfoRow label="Poste souhaité" value={recruitment.desiredPosition} />
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Motivation</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{recruitment.motivation}</p>
            </div>
            {recruitment.availability && (
              <InfoRow label="Disponibilité" value={recruitment.availability} />
            )}
            {recruitment.additionalInfo && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Informations complémentaires</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {recruitment.additionalInfo}
                </p>
              </div>
            )}
          </Section>

          <Section title="Gestion">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Statut :</span>
                <Select
                  value={recruitment.status}
                  onValueChange={(value) => onStatusChange(recruitment._id, value)}
                >
                  <SelectTrigger className="w-[160px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-600 hover:bg-red-50"
              onClick={() => onRemove(recruitment._id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 mb-2">
      <span className="text-xs font-medium text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-700">{value}</span>
    </div>
  );
}
