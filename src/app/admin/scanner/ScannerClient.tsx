"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Html5Qrcode } from "html5-qrcode";
import {
  AlertTriangle,
  CameraOff,
  CheckCircle2,
  LogOut,
  ScanLine,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { AdminNav } from "@/components/shared/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { attendanceService } from "@/services/attendance.service";
import { CAMP_EVENT_ID, CAMP_EVENT_NAME } from "@/features/camp/constants";
import {
  SEMINAIRE_EVENT_ID,
  SEMINAIRE_EVENT_NAME,
} from "@/features/seminaire/constants";
import {
  CONFERENCE_EVENT_ID,
  CONFERENCE_EVENT_NAME,
} from "@/features/conference/constants";
import { JDJ_EVENT_NAME } from "@/features/jeunes/constants";
import type { CheckInResult } from "@/types/registration.types";

const READER_ELEMENT_ID = "qr-reader";
/** Le même QR reste souvent devant la caméra : on l'ignore pendant ce délai. */
const SAME_CODE_COOLDOWN_MS = 5_000;

const EVENT_OPTIONS = [
  { id: CAMP_EVENT_ID, name: CAMP_EVENT_NAME },
  { id: SEMINAIRE_EVENT_ID, name: SEMINAIRE_EVENT_NAME },
  { id: CONFERENCE_EVENT_ID, name: CONFERENCE_EVENT_NAME },
  { id: process.env.NEXT_PUBLIC_JDJ_EVENT_ID || "", name: JDJ_EVENT_NAME },
].filter((option) => option.id);

type ScanOutcome =
  | { kind: "ok" | "already"; data: CheckInResult }
  | { kind: "error"; message: string };

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScannerClient() {
  const { user, isChecking, logout } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") || EVENT_OPTIONS[0]?.id || "";

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  const busyRef = useRef(false);
  const lastCodeRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });
  const handleDecodedRef = useRef<(text: string) => void>(() => {});

  handleDecodedRef.current = async (text: string) => {
    const now = Date.now();
    if (busyRef.current) return;
    if (
      text === lastCodeRef.current.text &&
      now - lastCodeRef.current.at < SAME_CODE_COOLDOWN_MS
    ) {
      return;
    }
    busyRef.current = true;
    lastCodeRef.current = { text, at: now };

    try {
      const result = await attendanceService.scan(text, eventId);
      setOutcome({ kind: result.alreadyCheckedIn ? "already" : "ok", data: result });
      if (!result.alreadyCheckedIn) setSessionCount((c) => c + 1);
      navigator.vibrate?.(result.alreadyCheckedIn ? [80, 60, 80] : 120);
    } catch (error: any) {
      setOutcome({
        kind: "error",
        message: error?.message || "QR code non reconnu.",
      });
      navigator.vibrate?.([200, 80, 200]);
    } finally {
      busyRef.current = false;
    }
  };

  const ready = !isChecking && !!user && !!eventId;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    let scanner: Html5Qrcode | null = null;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      scanner = new Html5Qrcode(READER_ELEMENT_ID);
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (text) => handleDecodedRef.current(text),
          () => {},
        );
        if (cancelled) await scanner.stop().catch(() => {});
      } catch (error) {
        if (!cancelled) {
          setCameraError(
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      if (scanner?.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, [ready]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Vérification de la session..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-royal-600" />
              Scanner les arrivées
            </h1>
            {user && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminNav active="/admin/scanner" />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {EVENT_OPTIONS.length === 0 ? (
          <div className="form-section text-center py-6 text-sm text-amber-700 border border-amber-200 bg-amber-50">
            Configuration requise : renseignez{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_CAMP_EVENT_ID</code>{" "}
            ou <code className="font-mono text-xs">NEXT_PUBLIC_SEMINAIRE_EVENT_ID</code>{" "}
            ou <code className="font-mono text-xs">NEXT_PUBLIC_CONFERENCE_EVENT_ID</code>.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {EVENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setOutcome(null);
                  router.replace(`/admin/scanner?event=${option.id}`);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  option.id === eventId
                    ? "bg-royal-600 text-white border-royal-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-royal-300"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-black">
          <div id={READER_ELEMENT_ID} className="w-full" />
        </div>

        {cameraError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <CameraOff className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Impossible d&apos;accéder à la caméra. Autorisez la caméra pour
              ce site (la page doit être ouverte en HTTPS).
              <span className="block text-xs text-red-500 mt-1">
                {cameraError}
              </span>
            </span>
          </div>
        )}

        {outcome && <OutcomeCard outcome={outcome} />}

        <p className="text-center text-xs text-gray-500">
          {sessionCount} arrivée{sessionCount > 1 ? "s" : ""} enregistrée
          {sessionCount > 1 ? "s" : ""} depuis l&apos;ouverture du scanner.
        </p>
      </div>
    </main>
  );
}

function OutcomeCard({ outcome }: { outcome: ScanOutcome }) {
  if (outcome.kind === "error") {
    return (
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-center">
        <XCircle className="w-10 h-10 mx-auto text-red-500" />
        <p className="mt-2 text-lg font-bold text-red-800">Accès refusé</p>
        <p className="mt-1 text-sm text-red-700">{outcome.message}</p>
      </div>
    );
  }

  const { data } = outcome;
  const ok = outcome.kind === "ok";
  const fullName = `${data.participant.firstName ?? ""} ${data.participant.lastName ?? ""}`.trim();
  const subtitle = [
    data.participant.title,
    data.participant.profession,
    data.participant.company,
    data.participant.church,
    data.participant.city,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={`rounded-2xl border-2 p-5 text-center ${
        ok ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="w-10 h-10 mx-auto text-green-600" />
      ) : (
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
      )}
      <p
        className={`mt-2 text-lg font-bold ${ok ? "text-green-800" : "text-amber-800"}`}
      >
        {ok ? "Bienvenue !" : `Déjà pointé à ${formatTime(data.checkedInAt)}`}
      </p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{fullName}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      <p className="mt-2 text-xs font-mono text-gray-500">
        {data.registration.registrationNumber}
      </p>
    </div>
  );
}
