import type { Metadata } from "next";
import { AdminRecruitmentsClient } from "./AdminRecruitmentsClient";

export const metadata: Metadata = {
  title: "Recrutements — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function AdminRecruitmentsPage() {
  return <AdminRecruitmentsClient />;
}
