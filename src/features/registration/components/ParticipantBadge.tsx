"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ImageDown, Printer, Share2, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { downloadImage, resolveAssetUrl } from "@/lib/utils";
import { downloadBadgeBlob, generateBadgeBlob } from "@/lib/badge/generateBadgeImage";

interface Props {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  qrCodeUrl: string;
  registrationNumber: string;
  eventName?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventLocation?: string;
}

export function ParticipantBadge({
  firstName,
  lastName,
  photoUrl,
  qrCodeUrl,
  registrationNumber,
  eventName,
  eventStartDate,
  eventEndDate,
  eventLocation,
}: Props) {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const badgeBlobRef = useRef<Blob | null>(null);
  const resolvedPhoto = resolveAssetUrl(photoUrl);

  useEffect(() => {
    if (!eventStartDate || !eventEndDate || !eventLocation) {
      setIsGenerating(false);
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;
    setIsGenerating(true);
    generateBadgeBlob({
      firstName,
      lastName,
      photoUrl: resolvedPhoto,
      registrationNumber,
      eventName: eventName || "EBENEZER",
      startDate: eventStartDate,
      endDate: eventEndDate,
      location: eventLocation,
    })
      .then((blob) => {
        if (cancelled) return;
        badgeBlobRef.current = blob;
        objectUrl = URL.createObjectURL(blob);
        setBadgeUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de générer l'aperçu du badge.");
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    firstName,
    lastName,
    resolvedPhoto,
    registrationNumber,
    eventName,
    eventStartDate,
    eventEndDate,
    eventLocation,
  ]);

  const ensureBadgeBlob = async (): Promise<Blob | null> => {
    if (badgeBlobRef.current) return badgeBlobRef.current;
    if (!eventStartDate || !eventEndDate || !eventLocation) {
      toast.error("Informations de l'événement incomplètes pour générer le badge.");
      return null;
    }
    setIsGenerating(true);
    try {
      const blob = await generateBadgeBlob({
        firstName,
        lastName,
        photoUrl: resolvedPhoto,
        registrationNumber,
        eventName: eventName || "EBENEZER",
        startDate: eventStartDate,
        endDate: eventEndDate,
        location: eventLocation,
      });
      badgeBlobRef.current = blob;
      return blob;
    } catch {
      toast.error("Impossible de générer le badge. Réessayez.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadBadge = async () => {
    const blob = await ensureBadgeBlob();
    if (blob) {
      downloadBadgeBlob(blob, `Badge-${firstName}-${lastName}.png`.replace(/\s+/g, "-"));
    }
  };

  const handleShareBadge = async () => {
    const blob = await ensureBadgeBlob();
    if (!blob) return;

    const file = new File(
      [blob],
      `Badge-${firstName}-${lastName}.png`.replace(/\s+/g, "-"),
      { type: "image/png" },
    );

    if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Mon badge ${eventName || "EBENEZER"}`,
          text: `J'y serai ! ${eventName || "EBENEZER"} - N° ${registrationNumber}`,
        });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }

    downloadBadgeBlob(blob, `Badge-${firstName}-${lastName}.png`.replace(/\s+/g, "-"));
    toast.error(
      "Le partage direct n'est pas pris en charge sur cet appareil. Le badge a été téléchargé — partage-le manuellement.",
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {/* Lanyard clip */}
        <div className="flex flex-col items-center -mb-2 relative z-10">
          <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400" />
          <div className="w-14 h-5 rounded-md bg-gray-300 border border-gray-400 -mt-1" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          id="participant-badge"
          className="badge-print-area w-full max-w-[320px] aspect-square bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden relative"
        >
          {badgeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={badgeUrl}
              alt={`Badge J'y serai - ${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <LoadingState message="Génération de l'aperçu du badge..." size="sm" />
          )}
        </motion.div>

        {/* Primary action: downloadable badge image (excluded from print) */}
        <Button
          variant="gold"
          className="w-full max-w-[320px] gap-2 print:hidden"
          loading={isGenerating}
          onClick={handleDownloadBadge}
        >
          <ImageDown className="w-4 h-4" />
          Télécharger mon badge
        </Button>

        {/* Actions (excluded from print) */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-[320px] print:hidden">
          <Button
            variant="royal"
            size="sm"
            className="gap-1.5"
            loading={isGenerating}
            onClick={handleShareBadge}
          >
            <Share2 className="w-3.5 h-3.5" />
            Partager
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowFullscreen(true)}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Agrandir
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => downloadImage(qrCodeUrl, `QRCode-${registrationNumber}.png`)}
          >
            <Download className="w-3.5 h-3.5" />
            QR Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.print()}
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Fullscreen QR modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 print:hidden"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-bold text-gray-900">{registrationNumber}</p>
              <div className="relative w-64 h-64">
                <Image
                  src={qrCodeUrl}
                  alt={`QR Code - ${registrationNumber}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <Button
                variant="royal"
                className="w-full gap-2"
                onClick={() => downloadImage(qrCodeUrl, `QRCode-${registrationNumber}.png`)}
              >
                <Download className="w-4 h-4" />
                Télécharger le QR Code
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
