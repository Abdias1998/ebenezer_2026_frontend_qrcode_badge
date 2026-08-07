import type { Metadata } from "next";
import { AdminSuggestionsClient } from "./AdminSuggestionsClient";

export const metadata: Metadata = {
  title: "Suggestions — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminSuggestionsPage() {
  return <AdminSuggestionsClient />;
}
