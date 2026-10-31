export const SEMINAIRE_EVENT_ID =
  process.env.NEXT_PUBLIC_SEMINAIRE_EVENT_ID || "";

export const SEMINAIRE_GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_SEMINAIRE_GOOGLE_FORM_URL || "";

export const SEMINAIRE_EVENT_NAME = "Séminaire des Pasteurs";

export const SEMINAIRE_MISSION = "Mission au Bénin";

export const SEMINAIRE_THEME = {
  lead: "Marcher dans les réalités du",
  highlight: "Royaume",
  reference: "Marc 4:11",
  verse:
    "C'est à vous qu'a été donné le mystère du royaume de Dieu ; mais pour ceux qui sont dehors tout se passe en paraboles.",
};

export const SEMINAIRE_HOST = "Prophète Samuel Dalum";

export const SEMINAIRE_COORDINATOR = "Papa John Migan";

export const SEMINAIRE_DATE_LABEL = "17 – 20 novembre 2026";
export const SEMINAIRE_LOCATION_LABEL = "Centre La Grâce Parle, Jéricho";

export const SEMINAIRE_POSTER_URL = "/seminaire/affiche.jpg";

export const SEMINAIRE_SPEAKERS = [
  {
    name: "Pr Paddy Blessed Musoke",
    country: "Rwanda",
    flag: "🇷🇼",
    photo: "/seminaire/paddy-musoke.jpg",
  },
  {
    name: "Pr Dieudonné Nduwimana",
    country: "Burundi",
    flag: "🇧🇮",
    photo: "/seminaire/dieudonne-nduwimana.jpg",
  },
  {
    name: "Ev. Danny Kadigiri",
    country: "Burundi",
    flag: "🇧🇮",
    photo: "/seminaire/danny-kadigiri.jpg",
  },
] as const;

export const SEMINAIRE_PROGRAMME = [
  {
    title: "Intercession prophétique",
    days: "17 – 18 nov.",
    time: "09h00",
    description:
      "Deux matinées de prière et d'intercession pour les nations, les églises et les ministères.",
  },
  {
    title: "Séminaires sur le leadership",
    days: "19 – 20 nov.",
    time: "09h00",
    description:
      "Des enseignements pour les pasteurs et responsables : conduire l'œuvre selon les principes du Royaume.",
  },
  {
    title: "Conférences de réveil",
    days: "17 – 20 nov.",
    time: "17h00",
    description:
      "Chaque soir, des cultes de réveil avec les orateurs invités.",
  },
] as const;

export const MINISTRY_TITLES = [
  "Pasteur",
  "Pasteur principal",
  "Apôtre",
  "Évêque",
  "Prophète",
  "Évangéliste",
  "Docteur / Enseignant",
  "Révérend",
  "Ancien",
  "Diacre",
  "Autre serviteur de Dieu",
] as const;
