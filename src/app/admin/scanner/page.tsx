import type { Metadata } from "next";
import { Suspense } from "react";
import { ScannerClient } from "./ScannerClient";

export const metadata: Metadata = {
  title: "Scanner — Admin EBENEZER",
  robots: { index: false, follow: false },
};

export default function ScannerPage() {
  return (
    <Suspense>
      <ScannerClient />
    </Suspense>
  );
}
