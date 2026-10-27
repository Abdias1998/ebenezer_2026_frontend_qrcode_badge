import type { Metadata } from "next";
import { AdminSeminaireClient } from "./AdminSeminaireClient";

export const metadata: Metadata = {
  title: "Séminaire des Pasteurs — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminSeminairePage() {
  return <AdminSeminaireClient />;
}
