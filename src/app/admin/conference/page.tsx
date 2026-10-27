import type { Metadata } from "next";
import { AdminConferenceClient } from "./AdminConferenceClient";

export const metadata: Metadata = {
  title: "Conférence des Professionnels — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminConferencePage() {
  return <AdminConferenceClient />;
}
