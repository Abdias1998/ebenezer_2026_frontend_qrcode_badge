"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardList, ShieldCheck } from "lucide-react";
import { fadeUp } from "./MissionLanding";

export function GoogleFormCard({
  url,
  title,
  description,
  ctaLabel,
  note,
}: {
  url: string;
  title: string;
  description: string;
  ctaLabel: string;
  note: string;
}) {
  const ready = Boolean(url);

  return (
    <motion.div
      {...fadeUp}
      className="relative overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_70px_-40px_rgba(10,22,64,0.5)] ring-1 ring-gold-200 sm:p-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.18),_transparent_70%)]"
      />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600" />

      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
        <ClipboardList className="h-7 w-7" />
      </span>

      <h3 className="mt-5 font-serif text-2xl font-bold text-navy-950 sm:text-3xl">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      <a
        href={ready ? url : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready}
        className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-4 text-sm font-bold text-navy-950 shadow-[0_12px_30px_-10px_rgba(245,158,11,0.7)] transition-transform sm:w-auto ${
          ready ? "hover:-translate-y-0.5" : "pointer-events-none opacity-50"
        }`}
      >
        {ctaLabel}
        <ArrowUpRight className="h-4 w-4" />
      </a>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <ShieldCheck className="h-3.5 w-3.5" />
        {ready ? note : "Le lien d'inscription sera disponible prochainement."}
      </p>
    </motion.div>
  );
}
