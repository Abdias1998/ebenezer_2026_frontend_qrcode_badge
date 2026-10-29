import type { MissionContact } from "@/features/mission/components/MissionLanding";

export const CAMP_EVENT_ID = process.env.NEXT_PUBLIC_CAMP_EVENT_ID || "";

export const CAMP_EVENT_NAME = "Camp La Sagesse de Bâtir";

/** Édition en cours : une édition = un événement (et un CAMP_EVENT_ID). */
export const CAMP_EDITION = "Édition 2026";

export const CAMP_TAGLINE = "Chaque vendredi dans Sa présence";

export const CAMP_DATE_LABEL = "Tous les vendredis";
export const CAMP_HOURS_LABEL = "De 19h00 à 06h00";
export const CAMP_LOCATION_LABEL = "Centre La Grâce Parle, Jéricho";

export const CAMP_VISION =
  "Rassembler la jeunesse chaque vendredi, le temps d'une nuit, pour chercher la face de Dieu, être fortifiée dans la foi et repartir avec une vision claire pour sa vie. Le camp est un temps à part : loin du bruit, ensemble, dans la prière, l'adoration et la Parole.";

export const CAMP_OBJECTIVES = [
  {
    title: "Rencontrer Dieu",
    text: "Vivre une nuit de prière et d'adoration qui transforme, seul et ensemble.",
  },
  {
    title: "Grandir dans la Parole",
    text: "Recevoir des enseignements adaptés aux réalités et aux défis des jeunes.",
  },
  {
    title: "Créer des liens",
    text: "Tisser une vraie communion fraternelle entre jeunes de différentes églises.",
  },
  {
    title: "Repartir avec une vision",
    text: "Prendre des décisions concrètes pour sa vie spirituelle, ses études et son avenir.",
  },
] as const;

export const CAMP_ACTIVITIES = [
  { time: "19h00", title: "Accueil et enregistrement", text: "Scan des QR codes à l'entrée, installation." },
  { time: "20h00", title: "Louange et adoration", text: "Un grand temps de célébration pour ouvrir la nuit." },
  { time: "21h30", title: "Enseignement", text: "Un message pour la jeunesse, suivi d'un temps d'échange." },
  { time: "23h00", title: "Ateliers et témoignages", text: "Groupes de partage, questions-réponses, témoignages." },
  { time: "00h30", title: "Veillée de prière", text: "Intercession, prière pour les nations et pour chaque jeune." },
  { time: "04h00", title: "Temps de consécration", text: "Engagements personnels et prière de bénédiction." },
  { time: "06h00", title: "Clôture", text: "Petit-déjeuner fraternel et départ encadré." },
] as const;

export const CAMP_PRACTICAL = [
  { title: "À apporter", text: "Une Bible, un carnet, une tenue correcte et chaude, une gourde, une lampe de poche." },
  { title: "Encadrement", text: "Des responsables et des secouristes sont présents toute la nuit." },
  { title: "Arrivée", text: "Présente ton QR code à l'accueil : il est scanné pour enregistrer ta présence." },
  { title: "Départ", text: "Aucune sortie n'est permise avant la clôture, sauf accord des responsables." },
] as const;

/** Règlement du camp, accepté lors de l'inscription. TODO : à valider par les responsables. */
export const CAMP_RULES = [
  "Le participant arrive à l'heure indiquée et se présente à l'accueil avec son QR code.",
  "Une fois entré, il ne quitte pas le site du camp avant la clôture sans l'accord d'un responsable.",
  "Une tenue correcte et décente est exigée pendant toute la durée du camp.",
  "L'alcool, le tabac, les drogues et tout objet dangereux sont strictement interdits.",
  "Le participant respecte les responsables, les autres participants, les lieux et le matériel.",
  "Garçons et filles sont accueillis dans des espaces de repos séparés.",
  "Tout comportement mettant en danger la sécurité ou le bon déroulement du camp peut entraîner l'exclusion ; les parents des mineurs sont alors prévenus.",
  "Le participant suit les consignes de sécurité données par l'équipe d'encadrement.",
  "Des photos et vidéos peuvent être prises pendant le camp pour la communication de l'église.",
] as const;

/** Notice d'information sur les données personnelles. TODO : à valider. */
export const CAMP_PRIVACY = [
  "Les informations recueillies servent uniquement à l'organisation du camp : gestion des inscriptions, vérification à l'entrée, sécurité des participants et contact en cas d'urgence.",
  "Elles sont accessibles aux seuls responsables du camp, via un espace d'administration protégé par mot de passe.",
  "Elles ne sont ni vendues ni transmises à des tiers.",
  "Le QR code ne contient aucune donnée personnelle lisible : uniquement ton numéro d'inscription.",
  "Tu peux demander à consulter, corriger ou supprimer tes données en contactant l'équipe d'organisation.",
] as const;

export const CAMP_CONTACTS: MissionContact[] = [
  {
    name: "Équipe d'organisation",
    phoneLabel: "+229 01 49 87 28 28",
    phoneIntl: "2290149872828",
  },
];
