import type { Metadata, Viewport } from "next";
import { ConferencePageClient } from "./ConferencePageClient";

const TITLE =
  "Conférence des Professionnels et Hommes & Femmes d'Affaires — Inscription";
const DESCRIPTION =
  "Samedi 21 novembre 2026 à 09h00, salle des fêtes Le Majestic, Cadjehoun (Cotonou), avec le Pr Musoke Paddy Blessed. Thème : Les 7 étapes pour transformer votre rêve en fortune. Entrée libre et gratuite, QR code d'accès immédiat.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/conference/invitation.jpg", width: 1280, height: 901 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/conference/invitation.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1640",
};

export default function ConferencePage() {
  return <ConferencePageClient />;
}
