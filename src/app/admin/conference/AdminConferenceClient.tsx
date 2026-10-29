"use client";

import { Briefcase, Building2, MapPin, Users } from "lucide-react";
import {
  EventRegistrationsDashboard,
  type ExportColumn,
} from "@/features/admin/components/EventRegistrationsDashboard";
import { CONFERENCE_EVENT_ID } from "@/features/conference/constants";

const GENDER_LABELS: Record<string, string> = { M: "Hommes", F: "Femmes" };

const STATUS_LABELS: Record<string, string> = {
  "checked-in": "Présent",
  confirmed: "Inscrit",
  pending: "En attente",
  cancelled: "Annulé",
};

const arrivedAt = (value?: string) =>
  value ? new Date(value).toLocaleString("fr-FR") : "";

const EXPORT_COLUMNS: ExportColumn[] = [
  { header: "N° inscription", value: (r) => r.registrationNumber },
  { header: "Nom", value: (r) => r.participant?.lastName },
  { header: "Prénom", value: (r) => r.participant?.firstName },
  { header: "Sexe", value: (r) => r.participant?.gender },
  { header: "Téléphone", value: (r) => r.participant?.phone },
  { header: "E-mail", value: (r) => r.participant?.email },
  { header: "Secteur", value: (r) => r.participant?.profession },
  { header: "Entreprise", value: (r) => r.participant?.company },
  { header: "Ville", value: (r) => r.participant?.city },
  { header: "Église", value: (r) => r.participant?.church },
  { header: "Statut", value: (r) => STATUS_LABELS[r.status] ?? r.status },
  { header: "Arrivée", value: (r) => arrivedAt(r.checkedInAt) },
];

export function AdminConferenceClient() {
  return (
    <EventRegistrationsDashboard
      eventId={CONFERENCE_EVENT_ID}
      envVarName="NEXT_PUBLIC_CONFERENCE_EVENT_ID"
      section="/admin/conference"
      title="Conférence des Professionnels"
      icon={<Briefcase className="w-5 h-5 text-royal-600" />}
      audienceLabel="participants"
      exportColumns={EXPORT_COLUMNS}
      exportFileName="conference-professionnels"
      statFilters={[
        {
          title: "Secteur",
          icon: <Briefcase className="w-3.5 h-3.5" />,
          statsKey: "byProfession",
          filterKey: "profession",
        },
        {
          title: "Sexe",
          icon: <Users className="w-3.5 h-3.5" />,
          statsKey: "byGender",
          filterKey: "gender",
          formatLabel: (v) => GENDER_LABELS[v] ?? v,
        },
        {
          title: "Ville",
          icon: <MapPin className="w-3.5 h-3.5" />,
          statsKey: "byCity",
          filterKey: "city",
        },
      ]}
      renderDetails={(registration) => {
        const p = registration.participant;
        return (
          <>
            {p?.profession && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{p.profession}</span>
              </span>
            )}
            {p?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{p.city}</span>
              </span>
            )}
            {p?.company && (
              <span className="flex items-center gap-1 sm:col-span-2">
                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 truncate">
                  {p.company}
                </span>
              </span>
            )}
          </>
        );
      }}
    />
  );
}
