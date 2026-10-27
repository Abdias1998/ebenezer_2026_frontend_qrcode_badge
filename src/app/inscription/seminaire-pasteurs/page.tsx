import type { Metadata, Viewport } from "next";
import { SeminairePageClient } from "./SeminairePageClient";

const TITLE =
  "Séminaire des Pasteurs — Marcher dans les réalités du Royaume";
const DESCRIPTION =
  "Mission au Bénin, du 17 au 20 novembre 2026 au Centre La Grâce Parle, Jéricho, avec le Prophète Samuel Dalum. Inscription gratuite des pasteurs et serviteurs de Dieu, QR code d'accès immédiat.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/seminaire/affiche.jpg", width: 1200, height: 1698 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/seminaire/affiche.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1640",
};

export default function SeminairePage() {
  return <SeminairePageClient />;
}
