import type { Metadata, Viewport } from "next";
import { CampPageClient } from "./CampPageClient";

const TITLE = "Camp La Sagesse de Bâtir — Inscription gratuite";
const DESCRIPTION =
  "Chaque vendredi, une nuit de louange, de prière et de Parole pour les jeunes. Inscription 100 % gratuite en ligne : ton QR code d'accès est généré immédiatement.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#030820",
};

export default function CampPage() {
  return <CampPageClient />;
}
