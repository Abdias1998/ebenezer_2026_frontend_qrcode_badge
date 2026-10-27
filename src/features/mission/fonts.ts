import { Playfair_Display } from "next/font/google";

/** Serif de titrage, proche de celle des affiches de la Mission au Bénin. */
export const missionSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-mission-serif",
  display: "swap",
});
