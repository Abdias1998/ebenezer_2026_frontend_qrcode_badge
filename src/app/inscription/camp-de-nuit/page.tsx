import type { Metadata } from "next";
import { CampPageClient } from "./CampPageClient";

export const metadata: Metadata = {
  title: "Inscription — Camp de Nuit des Jeunes",
  description:
    "Inscris-toi gratuitement au camp de nuit des jeunes et reçois ton QR code d'accès.",
};

export default function CampPage() {
  return <CampPageClient />;
}
