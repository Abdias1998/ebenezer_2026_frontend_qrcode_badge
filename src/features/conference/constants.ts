import type { MissionContact } from "@/features/mission/components/MissionLanding";

export const CONFERENCE_EVENT_ID =
  process.env.NEXT_PUBLIC_CONFERENCE_EVENT_ID || "";

export const CONFERENCE_EVENT_NAME = "Conférence des Professionnels";

export const CONFERENCE_FULL_TITLE =
  "Conférence des Professionnels et Hommes & Femmes d'Affaires";

export const CONFERENCE_THEME = {
  title: "Les 7 étapes pour transformer votre rêve en fortune",
  reference: "2 Rois 4:1-7",
  verse:
    "Va vendre l'huile, et paie ta dette ; et tu vivras, toi et tes fils, de ce qui restera.",
  verseReference: "2 Rois 4:7",
};

export const CONFERENCE_GUEST = {
  name: "Pr Musoke Paddy Blessed",
  origin: "Trinity Tabernacle Ministries · Rwanda",
  photo: "/seminaire/paddy-musoke.jpg",
};

export const CONFERENCE_ORGANIZERS =
  "Trinity Tabernacle Ministries (Burundi/Rwanda), en collaboration avec le Corps de Christ au Bénin";

export const CONFERENCE_DATE_LABEL = "Samedi 21 novembre 2026";
export const CONFERENCE_TIME_LABEL = "09h00";
export const CONFERENCE_LOCATION_LABEL = "Salle des fêtes Le Majestic, Cadjehoun";
export const CONFERENCE_CITY = "Cotonou";

export const CONFERENCE_INVITATION_URL = "/conference/invitation.jpg";

export const CONFERENCE_CONTACTS: MissionContact[] = [
  { name: "MOG Isaac", phoneLabel: "01 98 17 29 33", phoneIntl: "2290198172933" },
  { name: "Pastor Espoir", phoneLabel: "01 67 92 15 26", phoneIntl: "2290167921526" },
];

export const BUSINESS_SECTORS = [
  "Commerce & distribution",
  "Agriculture & agroalimentaire",
  "BTP & immobilier",
  "Banque, finance & assurance",
  "Technologies & digital",
  "Santé",
  "Éducation & formation",
  "Transport & logistique",
  "Industrie & artisanat",
  "Hôtellerie & restauration",
  "Communication & médias",
  "Droit & conseil",
  "Administration & fonction publique",
  "Étudiant",
  "Autre",
] as const;
