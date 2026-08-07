"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Chargement...",
  className,
  size = "md",
}: LoadingStateProps) {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };

  return (
    <div className={cn("flex flex-col items-center justify-center py-20 gap-4", className)}>
      <motion.div
        className={cn("rounded-full border-4 border-royal-200 border-t-royal-600", sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-sm text-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="form-section space-y-4 animate-pulse">
      <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
      <div className="space-y-3">
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
