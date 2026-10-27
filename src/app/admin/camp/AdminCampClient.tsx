"use client";

import { Cake, Church, MapPin, MoonStar, ShieldAlert, Users } from "lucide-react";
import { EventRegistrationsDashboard } from "@/features/admin/components/EventRegistrationsDashboard";
import { CAMP_EVENT_ID } from "@/features/camp/constants";

const GENDER_LABELS: Record<string, string> = { M: "Garçons", F: "Filles" };

function ageFrom(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function AdminCampClient() {
  return (
    <EventRegistrationsDashboard
      eventId={CAMP_EVENT_ID}
      envVarName="NEXT_PUBLIC_CAMP_EVENT_ID"
      section="/admin/camp"
      title="Camp de Nuit — Suivi des présences"
      icon={<MoonStar className="w-5 h-5 text-royal-600" />}
      audienceLabel="jeunes"
      statFilters={[
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
        {
          title: "Église",
          icon: <Church className="w-3.5 h-3.5" />,
          statsKey: "byChurch",
          filterKey: "church",
        },
      ]}
      renderDetails={(registration) => {
        const p = registration.participant;
        const age = ageFrom(p?.dob);
        return (
          <>
            {age != null && (
              <span className="flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{age} ans</span>
              </span>
            )}
            {p?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700">{p.city}</span>
              </span>
            )}
            {p?.church && (
              <span className="flex items-center gap-1">
                <Church className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 truncate">
                  {p.church}
                </span>
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
