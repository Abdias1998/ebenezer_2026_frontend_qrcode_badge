import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: {
    default: "EBENEZER — Inscription",
    template: "%s | EBENEZER",
  },
  description:
    "Inscrivez-vous à l'événement EBENEZER — Cinq jours de restauration, d'enseignement et d'adoration.",
  keywords: ["EBENEZER", "événement chrétien", "inscription", "conférence", "adoration"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "JEÛNE DES JEUNES — Inscription",
    description: "La Grâce Parle",
    siteName: "EBENEZER",
  },
  twitter: {
    card: "summary_large_image",
    title: "EBENEZER — Inscription",
    description: "Réservez votre place pour cinq jours de restauration et d'adoration.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6e1712",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
