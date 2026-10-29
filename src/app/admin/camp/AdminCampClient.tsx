"use client";

import type { ReactNode } from "react";
import { CalendarDays, Church, MoonStar, ShieldAlert } from "lucide-react";
import {
  EventRegistrationsDashboard,
  formatSessionDate,
  type ExportColumn,
} from "@/features/admin/components/EventRegistrationsDashboard";
import { CAMP_EVENT_ID, CAMP_EVENT_NAME } from "@/features/camp/constants";
import type { AdminRegistration } from "@/types/registration.types";

const STATUS_LABELS: Record<string, string> = {
  "checked-in": "Déjà venu",
  confirmed: "Inscrit (pas encore venu)",
  pending: "En attente",
  cancelled: "Annulé",
};

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const formatSessions = (dates?: string[]) =>
  (dates ?? []).map(formatSessionDate).join(", ");

const EXPORT_COLUMNS: ExportColumn[] = [
  { header: "N° inscription", value: (r) => r.registrationNumber },
  { header: "Nom", value: (r) => r.participant?.lastName },
  { header: "Prénom", value: (r) => r.participant?.firstName },
  { header: "Téléphone", value: (r) => r.participant?.phone },
  { header: "E-mail", value: (r) => r.participant?.email },
  { header: "Église", value: (r) => r.participant?.church },
  { header: "Contact d'urgence", value: (r) => r.participant?.emergencyContactName },
  { header: "Tél. urgence", value: (r) => r.participant?.emergencyContactPhone },
  { header: "Statut", value: (r) => STATUS_LABELS[r.status] ?? r.status },
  { header: "Nb séances", value: (r) => r.attendanceDates?.length ?? 0 },
  { header: "Séances suivies", value: (r) => formatSessions(r.attendanceDates) },
  { header: "Première venue", value: (r) => formatDateTime(r.checkedInAt) },
  { header: "Inscrit le", value: (r) => formatDateTime(r.createdAt) },
];

export function AdminCampClient() {
  return (
    <EventRegistrationsDashboard
      eventId={CAMP_EVENT_ID}
      envVarName="NEXT_PUBLIC_CAMP_EVENT_ID"
      section="/admin/camp"
      title={`${CAMP_EVENT_NAME} — Présences par séance`}
      icon={<MoonStar className="w-5 h-5 text-royal-600" />}
      audienceLabel="jeunes"
      exportColumns={EXPORT_COLUMNS}
      exportFileName="camp-sagesse-de-batir"
      perSession
      renderProfile={(registration) => <CampProfile registration={registration} />}
      statFilters={[
        {
          title: "Église",
          icon: <Church className="w-3.5 h-3.5" />,
          statsKey: "byChurch",
          filterKey: "church",
        },
      ]}
      renderDetails={(registration) => {
        const p = registration.participant;
        return (
          <>
            {p?.church && (
              <span className="flex items-center gap-1">
                <Church className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{p.church}</span>
              </span>
            )}
            {p?.emergencyContactName && (
              <span className="flex items-center gap-1 sm:col-span-2">
                <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                Urgence :{" "}
                <span className="font-medium text-gray-700">
                  {p.emergencyContactName}
                </span>
                {p.emergencyContactPhone && (
                  <a
                    href={`tel:${p.emergencyContactPhone}`}
                    className="text-royal-700 hover:underline"
                  >
                    {p.emergencyContactPhone}
                  </a>
                )}
              </span>
            )}
          </>
        );
      }}
    />
  );
}

function CampProfile({ registration }: { registration: AdminRegistration }) {
  const p = registration.participant;
  const sessions = registration.attendanceDates ?? [];

  return (
    <div className="space-y-5 text-sm">
      <ProfileSection title="Participant">
        <Field label="Téléphone" value={p?.phone} href={p?.phone && `tel:${p.phone}`} />
        <Field label="E-mail" value={p?.email} href={p?.email && `mailto:${p.email}`} />
        <Field label="Église" value={p?.church} />
      </ProfileSection>

      <ProfileSection title="En cas d'urgence">
        <Field label="Contact" value={p?.emergencyContactName} />
        <Field
          label="Téléphone"
          value={p?.emergencyContactPhone}
          href={p?.emergencyContactPhone && `tel:${p.emergencyContactPhone}`}
        />
      </ProfileSection>

      <ProfileSection title={`Séances suivies (${sessions.length})`}>
        {sessions.length > 0 ? (
          sessions.map((date) => (
            <div key={date} className="flex items-center gap-2 px-3 py-2">
              <CalendarDays className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span className="font-medium text-gray-900 capitalize">
                {formatSessionDate(date)}
              </span>
            </div>
          ))
        ) : (
          <p className="px-3 py-2 text-gray-400">Aucune séance pour le moment.</p>
        )}
      </ProfileSection>

      <ProfileSection title="Inscription">
        <Field label="Statut" value={STATUS_LABELS[registration.status] ?? registration.status} />
        <Field label="Inscrit le" value={formatDateTime(registration.createdAt)} />
        <Field
          label="Règlement"
          value={
            p?.rulesAcceptedAt
              ? `Accepté le ${formatDateTime(p.rulesAcceptedAt)}`
              : "Non renseigné"
          }
        />
        <Field
          label="Données"
          value={
            p?.dataConsentAt
              ? `Consentement le ${formatDateTime(p.dataConsentAt)}`
              : "Non renseigné"
          }
        />
      </ProfileSection>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <dl className="divide-y divide-gray-100 rounded-xl border border-gray-100">
        {children}
      </dl>
    </section>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3 px-3 py-2">
      <dt className="w-28 shrink-0 text-gray-500">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-gray-900">
        {value ? (
          href ? (
            <a href={href} className="text-royal-700 hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </dd>
    </div>
  );
}
