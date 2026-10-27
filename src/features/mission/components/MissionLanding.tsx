"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Phone, Send } from "lucide-react";

/** Briques communes aux pages d'inscription de la Mission au Bénin. */

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export function MissionHeader() {
  return (
    <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="La Grâce Parle"
          width={44}
          height={44}
          className="rounded-full bg-white ring-2 ring-gold-400/60"
          priority
        />
        <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-navy-100 sm:block">
          La Grâce Parle
        </span>
      </div>
      <a
        href="#inscription"
        className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/20 sm:text-sm"
      >
        S&apos;inscrire
      </a>
    </header>
  );
}

export function KeyFactsBar({
  facts,
}: {
  facts: { icon: ReactNode; label: string; value: string }[];
}) {
  return (
    <div className="relative border-t border-white/10 bg-navy-950/40 backdrop-blur">
      <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center gap-4 py-5 sm:justify-center sm:px-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 [&>svg]:h-5 [&>svg]:w-5">
              {fact.icon}
            </span>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-navy-200">
                {fact.label}
              </dt>
              <dd className="text-sm font-semibold sm:text-base">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  dark,
}: {
  kicker: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
      <p
        className={`text-xs font-semibold uppercase tracking-[0.35em] ${dark ? "text-gold-300" : "text-gold-600"}`}
      >
        {kicker}
      </p>
      <h2
        className={`mt-3 font-serif text-3xl font-bold text-balance sm:text-4xl ${dark ? "text-white" : "text-navy-950"}`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
    </motion.div>
  );
}

export function StepsList({
  steps,
}: {
  steps: { icon: ReactNode; title: string; text: string }[];
}) {
  return (
    <ol className="space-y-5">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-gold-300 [&>svg]:h-5 [&>svg]:w-5">
            {step.icon}
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-navy-950">
              {index + 1}
            </span>
          </span>
          <div>
            <p className="font-semibold text-navy-950">{step.title}</p>
            <p className="text-sm text-gray-600">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PosterShareCard({
  src,
  width,
  height,
  downloadName,
  title,
  text,
}: {
  src: string;
  width: number;
  height: number;
  downloadName: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_20px_50px_-35px_rgba(10,22,64,0.5)] ring-1 ring-navy-100">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 overflow-hidden rounded-xl ring-1 ring-navy-100"
      >
        <Image
          src={src}
          alt={title}
          width={width}
          height={height}
          className="h-auto w-24"
        />
      </a>
      <div className="text-sm">
        <p className="font-semibold text-navy-950">{title}</p>
        <p className="mt-1 text-gray-600">{text}</p>
        <a
          href={src}
          download={downloadName}
          className="mt-2 inline-flex items-center gap-1.5 font-semibold text-navy-700 hover:text-navy-900"
        >
          <Download className="h-3.5 w-3.5" />
          Télécharger
        </a>
      </div>
    </div>
  );
}

export interface MissionContact {
  name: string;
  /** Numéro affiché, ex. « 01 98 17 29 33 ». */
  phoneLabel: string;
  /** Numéro international sans « + », ex. « 2290198172933 ». */
  phoneIntl: string;
}

export function ContactsCard({ contacts }: { contacts: MissionContact[] }) {
  return (
    <div className="rounded-3xl bg-navy-900 p-5 text-white">
      <p className="font-semibold">Une question ?</p>
      <ul className="mt-3 space-y-3">
        {contacts.map((contact) => (
          <li
            key={contact.phoneIntl}
            className="flex flex-wrap items-center justify-between gap-2"
          >
            <span className="text-sm">
              <span className="block text-navy-200">{contact.name}</span>
              <span className="font-semibold">{contact.phoneLabel}</span>
            </span>
            <span className="flex gap-2">
              <a
                href={`tel:+${contact.phoneIntl}`}
                aria-label={`Appeler ${contact.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${contact.phoneIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Écrire à ${contact.name} sur WhatsApp`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 transition-colors hover:bg-green-600"
              >
                <Send className="h-4 w-4" />
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bandeau qui renvoie vers l'autre rendez-vous de la mission. */
export function SiblingEventBanner({
  href,
  kicker,
  title,
  meta,
}: {
  href: string;
  kicker: string;
  title: string;
  meta: string;
}) {
  return (
    <section className="bg-navy-50/60 pb-20">
      <motion.div {...fadeUp} className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href={href}
          className="group flex flex-col gap-4 rounded-3xl bg-gradient-navy p-7 text-white shadow-[0_30px_60px_-30px_rgba(10,22,64,0.7)] sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
              {kicker}
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-balance">{title}</p>
            <p className="mt-1 text-sm text-navy-100">{meta}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 transition-transform group-hover:translate-x-1 sm:self-auto">
            Voir et s&apos;inscrire
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

export function MissionFooter({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <footer className="bg-navy-950 px-4 py-10 text-center text-sm text-navy-200">
      <Image
        src="/logo.png"
        alt="La Grâce Parle"
        width={48}
        height={48}
        className="mx-auto rounded-full bg-white"
      />
      <p className="mt-4 font-serif text-lg font-bold text-white">{title}</p>
      <p className="mt-1">{subtitle}</p>
      <p className="mt-4 text-xs text-navy-300">Plateforme d&apos;inscription officielle</p>
    </footer>
  );
}
