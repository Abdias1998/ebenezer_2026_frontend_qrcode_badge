"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  Lightbulb,
  MapPin,
  Ticket,
  TicketCheck,
  UserCheck,
} from "lucide-react";
import { GoogleFormCard } from "@/features/mission/components/GoogleFormCard";
import { missionSerif } from "@/features/mission/fonts";
import {
  ContactsCard,
  KeyFactsBar,
  MissionFooter,
  MissionHeader,
  PosterShareCard,
  SectionHeading,
  SiblingEventBanner,
  StepsList,
  fadeUp,
} from "@/features/mission/components/MissionLanding";
import {
  CONFERENCE_CITY,
  CONFERENCE_CONTACTS,
  CONFERENCE_DATE_LABEL,
  CONFERENCE_FULL_TITLE,
  CONFERENCE_GOOGLE_FORM_URL,
  CONFERENCE_GUEST,
  CONFERENCE_INVITATION_URL,
  CONFERENCE_LOCATION_LABEL,
  CONFERENCE_ORGANIZERS,
  CONFERENCE_THEME,
  CONFERENCE_TIME_LABEL,
} from "@/features/conference/constants";
import {
  SEMINAIRE_DATE_LABEL,
  SEMINAIRE_EVENT_NAME,
  SEMINAIRE_LOCATION_LABEL,
  SEMINAIRE_MISSION,
  SEMINAIRE_THEME,
} from "@/features/seminaire/constants";

const INVITATION_DOWNLOAD_NAME = "invitation-conference-des-professionnels.jpg";

const AUDIENCES = [
  {
    icon: <Briefcase />,
    title: "Hommes & femmes d'affaires",
    text: "Commerçants, chefs d'entreprise, investisseurs.",
  },
  {
    icon: <Building2 />,
    title: "Professionnels",
    text: "Cadres, salariés et indépendants de tous les secteurs.",
  },
  {
    icon: <Lightbulb />,
    title: "Porteurs de projets",
    text: "Celles et ceux qui ont un rêve à transformer en réalité.",
  },
];

const STEPS = [
  {
    icon: <ExternalLink />,
    title: "Ouvrez le formulaire Google",
    text: "Un clic suffit : le formulaire s'ouvre dans un nouvel onglet.",
  },
  {
    icon: <CheckCircle2 />,
    title: "Remplissez et envoyez",
    text: "Deux minutes suffisent. L'entrée est libre et gratuite.",
  },
  {
    icon: <UserCheck />,
    title: "Présentez-vous à l'entrée",
    text: "Votre inscription est confirmée à l'accueil de la salle le 21 novembre.",
  },
];

export function ConferencePageClient() {
  return (
    <main
      className={`${missionSerif.variable} min-h-screen bg-slate-50 text-gray-900`}
    >
      <Hero />
      <Invitation />
      <Audience />
      <Registration />
      <SiblingEventBanner
        href="/inscription/seminaire-pasteurs"
        kicker="Aussi pendant la mission"
        title={`${SEMINAIRE_EVENT_NAME} — ${SEMINAIRE_THEME.lead} ${SEMINAIRE_THEME.highlight}`}
        meta={`${SEMINAIRE_DATE_LABEL} · ${SEMINAIRE_LOCATION_LABEL}`}
      />
      <MissionFooter
        title={`${CONFERENCE_FULL_TITLE} · ${SEMINAIRE_MISSION}`}
        subtitle={`${CONFERENCE_DATE_LABEL}, ${CONFERENCE_TIME_LABEL} · ${CONFERENCE_LOCATION_LABEL}, ${CONFERENCE_CITY}`}
      />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy text-white">
      {/* Bande dorée en diagonale, reprise de l'invitation */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[140%] w-72 origin-top rotate-[28deg] bg-gradient-to-b from-gold-300/50 via-gold-500/25 to-transparent blur-[2px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[-10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(167,139,250,0.3),_transparent_65%)]"
      />

      <MissionHeader />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:pb-24 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gold-300 sm:text-sm">
            {SEMINAIRE_MISSION} · Invitation
          </p>

          <h1 className="mt-6 font-serif text-[2.4rem] font-bold leading-[1.08] tracking-tight text-balance sm:text-6xl">
            Conférence des Professionnels
            <span className="mt-2 block bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-[0.62em] italic leading-tight text-transparent">
              et Hommes &amp; Femmes d&apos;Affaires
            </span>
          </h1>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur lg:mx-0">
            <span className="inline-block rounded-full bg-red-600 px-3 py-0.5 font-serif text-xs font-bold italic">
              Thème
            </span>
            <p className="mt-2 font-serif text-xl font-bold leading-snug sm:text-2xl">
              {CONFERENCE_THEME.title}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
              <BookOpen className="h-4 w-4" />
              {CONFERENCE_THEME.reference}
            </p>
          </div>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={CONFERENCE_GOOGLE_FORM_URL || "#inscription"}
              target={CONFERENCE_GOOGLE_FORM_URL ? "_blank" : undefined}
              rel={
                CONFERENCE_GOOGLE_FORM_URL ? "noopener noreferrer" : undefined
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-bold text-navy-950 shadow-[0_12px_30px_-10px_rgba(245,158,11,0.7)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <Ticket className="h-4 w-4" />
              Je réserve ma place
            </a>
            <a
              href={CONFERENCE_INVITATION_URL}
              download={INVITATION_DOWNLOAD_NAME}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Télécharger l&apos;invitation
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-gold-300/60 via-transparent to-navy-400/40 blur-sm"
          />
          <div className="relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-white/20">
            <Image
              src={CONFERENCE_GUEST.photo}
              alt={CONFERENCE_GUEST.name}
              width={429}
              height={600}
              className="h-auto w-full"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/85 to-transparent px-6 pb-6 pt-24">
              <span className="inline-block rounded bg-red-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                Invité
              </span>
              <p className="mt-2 font-serif text-2xl font-bold">
                {CONFERENCE_GUEST.name}
              </p>
              <p className="text-sm text-navy-100">{CONFERENCE_GUEST.origin}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <KeyFactsBar
        facts={[
          {
            icon: <CalendarDays />,
            label: "Date",
            value: `${CONFERENCE_DATE_LABEL} · ${CONFERENCE_TIME_LABEL}`,
          },
          {
            icon: <MapPin />,
            label: "Lieu",
            value: `Le Majestic, Cadjehoun · ${CONFERENCE_CITY}`,
          },
          { icon: <TicketCheck />, label: "Entrée", value: "Libre et gratuite" },
        ]}
      />
    </section>
  );
}

function Invitation() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.article
          {...fadeUp}
          className="relative overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_70px_-40px_rgba(10,22,64,0.5)] ring-1 ring-gold-200 sm:p-12"
        >
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700" />
          <p className="font-serif text-3xl font-bold tracking-[0.2em] text-navy-950 sm:text-4xl">
            INVITATION
          </p>
          <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

          <p className="mt-8 text-gray-700">Salutations, bien-aimés dans le Seigneur,</p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-700">
            Le <strong className="text-navy-950">{CONFERENCE_ORGANIZERS}</strong>, a
            la joie de vous inviter à la{" "}
            <strong className="text-navy-950">{CONFERENCE_FULL_TITLE}</strong>.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Invité : <strong className="text-navy-950">{CONFERENCE_GUEST.name}</strong>
          </p>

          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-4 text-navy-950">
            <span className="flex-1 border-y border-navy-950/70 py-1.5 text-lg">Samedi</span>
            <span className="flex flex-col items-center leading-none">
              <span className="text-xs text-gray-600">Novembre</span>
              <span className="font-serif text-6xl font-bold text-[#4c1d63]">21</span>
              <span className="text-sm font-semibold">2026</span>
            </span>
            <span className="flex-1 border-y border-navy-950/70 py-1.5 text-lg">
              {CONFERENCE_TIME_LABEL}
            </span>
          </div>

          <p className="mx-auto mt-7 inline-flex max-w-full items-center gap-2 rounded-full border border-navy-950/70 px-5 py-2 text-sm font-bold uppercase text-navy-950">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {CONFERENCE_LOCATION_LABEL} – {CONFERENCE_CITY}
            </span>
          </p>

          <p className="mx-auto mt-7 max-w-md text-gray-700">
            Nous serons heureux de vous compter parmi nous pour ce moment spécial
            d&apos;inspiration, d&apos;édification et d&apos;impact.
          </p>
          <p className="mt-3 text-sm font-bold uppercase tracking-wider text-red-600">
            Entrée libre et gratuite
          </p>
          <p className="mt-4 font-serif text-xl italic text-navy-900">
            Venez nombreux et ne manquez pas cette opportunité !
          </p>
        </motion.article>

        <motion.aside
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-navy-950 p-8 text-white sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.3),_transparent_70%)]"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
              Le thème
            </p>
            <p className="mt-4 font-serif text-3xl font-bold leading-tight">
              {CONFERENCE_THEME.title}
            </p>
            <p className="mt-3 text-sm font-semibold text-gold-300">
              {CONFERENCE_THEME.reference}
            </p>
          </div>
          <blockquote className="relative mt-10 border-l-2 border-gold-400/70 pl-5">
            <p className="font-serif text-lg italic leading-relaxed text-navy-100">
              « {CONFERENCE_THEME.verse} »
            </p>
            <footer className="mt-2 text-sm font-semibold text-gold-300">
              {CONFERENCE_THEME.verseReference}
            </footer>
          </blockquote>
        </motion.aside>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,_rgba(59,98,234,0.35),_transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading kicker="Pour qui ?" title="Une matinée pour ceux qui bâtissent" dark />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((item, index) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300 [&>svg]:h-6 [&>svg]:w-6">
                {item.icon}
              </span>
              <p className="mt-5 font-serif text-xl font-bold">{item.title}</p>
              <p className="mt-2 text-sm text-navy-200">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Registration() {
  return (
    <section
      id="inscription"
      className="scroll-mt-6 bg-gradient-to-b from-slate-50 to-navy-50/60 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading kicker="Inscription" title="Réservez votre place" />

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1 lg:sticky lg:top-8">
            <motion.div {...fadeUp} className="space-y-6">
              <StepsList steps={STEPS} />
              <PosterShareCard
                src={CONFERENCE_INVITATION_URL}
                width={96}
                height={68}
                downloadName={INVITATION_DOWNLOAD_NAME}
                title="Partagez l'invitation"
                text="Invitez vos collègues, partenaires et amis entrepreneurs."
              />
              <ContactsCard contacts={CONFERENCE_CONTACTS} />
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <GoogleFormCard
              url={CONFERENCE_GOOGLE_FORM_URL}
              title="Inscription à la conférence"
              description="L'inscription se fait directement via notre formulaire Google. Cliquez sur le bouton ci-dessous pour ouvrir le formulaire et réserver votre place."
              ctaLabel="Ouvrir le formulaire d'inscription"
              note="Vos informations servent uniquement à l'organisation de la conférence."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
