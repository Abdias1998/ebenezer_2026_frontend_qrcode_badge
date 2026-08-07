"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: "error" | "network" | "full";
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  type = "error",
  className,
}: ErrorStateProps) {
  const config = {
    error: {
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
      defaultTitle: "Une erreur est survenue",
      defaultMessage: "Veuillez réessayer ou contacter le support.",
    },
    network: {
      icon: WifiOff,
      color: "text-orange-500",
      bg: "bg-orange-50",
      defaultTitle: "Connexion impossible",
      defaultMessage:
        "Vérifiez votre connexion internet puis réessayez.",
    },
    full: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50",
      defaultTitle: "Événement complet",
      defaultMessage: "Il n'y a plus de places disponibles pour cet événement.",
    },
  };

  const { icon: Icon, color, bg, defaultTitle, defaultMessage } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-20 gap-5 text-center",
        className,
      )}
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", bg)}>
        <Icon className={cn("w-8 h-8", color)} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {title || defaultTitle}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {message || defaultMessage}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Button>
      )}
    </motion.div>
  );
}
