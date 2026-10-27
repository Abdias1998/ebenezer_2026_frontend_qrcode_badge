"use client";

import { Briefcase, Building2, MapPin, Users } from "lucide-react";
import { EventRegistrationsDashboard } from "@/features/admin/components/EventRegistrationsDashboard";
import { CONFERENCE_EVENT_ID } from "@/features/conference/constants";

const GENDER_LABELS: Record<string, string> = { M: "Hommes", F: "Femmes" };

export function AdminConferenceClient() {
  return (
    <EventRegistrationsDashboard
      eventId={CONFERENCE_EVENT_ID}
      envVarName="NEXT_PUBLIC_CONFERENCE_EVENT_ID"
      section="/admin/conference"
      title="Conférence des Professionnels"
      icon={<Briefcase className="w-5 h-5 text-royal-600" />}
      audienceLabel="participants"
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
