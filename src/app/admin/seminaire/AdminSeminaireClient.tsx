"use client";

import { Church, Globe2, MapPin, Mic2, Users } from "lucide-react";
import { EventRegistrationsDashboard } from "@/features/admin/components/EventRegistrationsDashboard";
import { SEMINAIRE_EVENT_ID } from "@/features/seminaire/constants";

const GENDER_LABELS: Record<string, string> = { M: "Hommes", F: "Femmes" };

export function AdminSeminaireClient() {
  return (
    <EventRegistrationsDashboard
      eventId={SEMINAIRE_EVENT_ID}
      envVarName="NEXT_PUBLIC_SEMINAIRE_EVENT_ID"
      section="/admin/seminaire"
      title="Séminaire des Pasteurs"
      icon={<Mic2 className="w-5 h-5 text-royal-600" />}
      audienceLabel="pasteurs"
      statFilters={[
        {
          title: "Pays",
          icon: <Globe2 className="w-3.5 h-3.5" />,
          statsKey: "byCountry",
          filterKey: "country",
        },
        {
          title: "Titre",
          icon: <Mic2 className="w-3.5 h-3.5" />,
          statsKey: "byTitle",
          filterKey: "title",
        },
        {
          title: "Sexe",
          icon: <Users className="w-3.5 h-3.5" />,
          statsKey: "byGender",
          filterKey: "gender",
          formatLabel: (v) => GENDER_LABELS[v] ?? v,
        },
      ]}
      renderDetails={(registration) => {
        const p = registration.participant;
        return (
          <>
            {p?.title && (
              <span className="flex items-center gap-1">
                <Mic2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{p.title}</span>
              </span>
            )}
            {(p?.country || p?.city) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">
                  {[p?.city, p?.country].filter(Boolean).join(", ")}
                </span>
              </span>
            )}
            {p?.church && (
              <span className="flex items-center gap-1 sm:col-span-2">
                <Church className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 truncate">
                  {p.church}
                </span>
              </span>
            )}
          </>
        );
      }}
    />
  );
}
