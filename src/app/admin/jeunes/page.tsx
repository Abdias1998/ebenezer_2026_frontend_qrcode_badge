import type { Metadata } from "next";
import { AdminJeunesClient } from "./AdminJeunesClient";

export const metadata: Metadata = {
  title: "Payements Jeûne des Jeunes — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminJeunesPage() {
  return <AdminJeunesClient />;
}