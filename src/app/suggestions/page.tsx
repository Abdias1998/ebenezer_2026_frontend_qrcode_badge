import type { Metadata } from "next";
import { SuggestionsPageClient } from "./SuggestionsPageClient";

export const metadata: Metadata = {
  title: "Suggestions — EBENEZER",
  description: "Envoie tes propositions, suggestions et remarques à l'équipe EBENEZER.",
};

export default function SuggestionsPage() {
  return <SuggestionsPageClient />;
}
