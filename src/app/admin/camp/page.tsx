import type { Metadata } from "next";
import { AdminCampClient } from "./AdminCampClient";

export const metadata: Metadata = {
  title: "Camp La Sagesse de Bâtir — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminCampPage() {
  return <AdminCampClient />;
}
