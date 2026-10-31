"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Ticket,
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
  CONFERENCE_DATE_LABEL,
  CONFERENCE_FULL_TITLE,
  CONFERENCE_LOCATION_LABEL,
  CONFERENCE_TIME_LABEL,
} from "@/features/conference/constants";
import {
  SEMINAIRE_COORDINATOR,
  SEMINAIRE_DATE_LABEL,
  SEMINAIRE_EVENT_NAME,
  SEMINAIRE_GOOGLE_FORM_URL,
  SEMINAIRE_HOST,
  SEMINAIRE_LOCATION_LABEL,
  SEMINAIRE_MISSION,
  SEMINAIRE_POSTER_URL,
  SEMINAIRE_PROGRAMME,
  SEMINAIRE_SPEAKERS,
  SEMINAIRE_THEME,
} from "@/features/seminaire/constants";

const POSTER_DOWNLOAD_NAME = "affiche-seminaire-des-pasteurs.jpg";

const STEPS = [
  {
    icon: <ExternalLink />,
    title: "Ouvrez le formulaire Google",
    text: "Un clic suffit : le formulaire s'ouvre dans un nouvel onglet.",
  },
  {
    icon: <CheckCircle2 />,
    title: "Remplissez et envoyez",
    text: "Deux minutes suffisent. L'inscription est gratuite.",
  },
  {
    icon: <UserCheck />,
    title: "Présentez-vous à l'accueil",
    text: "Votre inscription est confirmée à l'entrée du séminaire.",
  },
];

const CONTACTS = [
  {
    name: "Équipe d'organisation",
    phoneLabel: "+229 01 49 87 28 28",
    phoneIntl: "2290149872828",
  },
];

export function SeminairePageClient() {
  return (
    <main
      className={`${missionSerif.variable} min-h-screen bg-slate-50 text-gray-900`}
    >
      <Hero />
      <Programme />
      <Speakers />
      <Registration />
      <SiblingEventBanner
        href="/inscription/conference-professionnels"
        kicker="Aussi pendant la mission"
        title={CONFERENCE_FULL_TITLE}
        meta={`${CONFERENCE_DATE_LABEL} · ${CONFERENCE_TIME_LABEL} · ${CONFERENCE_LOCATION_LABEL}`}
      />
      <MissionFooter
        title={`${SEMINAIRE_EVENT_NAME} · ${SEMINAIRE_MISSION}`}
        subtitle={`${SEMINAIRE_DATE_LABEL} · ${SEMINAIRE_LOCATION_LABEL}`}
      />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy text-white">
      {/* Halo violet et anneau, comme sur l'affiche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,_rgba(167,139,250,0.35),_transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-60 top-1/4 h-[44rem] w-[44rem] rounded-full border-[40px] border-navy-400/10"
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
            {SEMINAIRE_MISSION}
          </p>
          <p className="mt-3 text-sm text-navy-100">
            {SEMINAIRE_EVENT_NAME} · Serviteurs de Dieu de toutes les nations
          </p>

          <span className="mt-8 inline-block rounded-full bg-red-600 px-4 py-1 font-serif text-sm font-bold italic shadow-lg">
            Thème
          </span>
          <h1 className="mt-4 font-serif text-[2.6rem] font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {SEMINAIRE_THEME.lead}{" "}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text italic text-transparent">
              {SEMINAIRE_THEME.highlight}
            </span>
          </h1>

          <blockquote className="mx-auto mt-6 max-w-xl text-navy-100 lg:mx-0 lg:border-l-2 lg:border-gold-400/70 lg:pl-5">
            <p className="font-serif text-base italic leading-relaxed sm:text-lg">
              « {SEMINAIRE_THEME.verse} »
            </p>
            <footer className="mt-2 text-sm font-semibold text-gold-300">
              {SEMINAIRE_THEME.reference}
            </footer>
          </blockquote>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={SEMINAIRE_GOOGLE_FORM_URL || "#inscription"}
              target={SEMINAIRE_GOOGLE_FORM_URL ? "_blank" : undefined}
              rel={SEMINAIRE_GOOGLE_FORM_URL ? "noopener noreferrer" : undefined}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-bold text-navy-950 shadow-[0_12px_30px_-10px_rgba(245,158,11,0.7)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <Ticket className="h-4 w-4" />
              Je m&apos;inscris gratuitement
            </a>
            <a
              href={SEMINAIRE_POSTER_URL}
              download={POSTER_DOWNLOAD_NAME}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Télécharger l&apos;affiche
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
          <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-white/20">
            <Image
              src="/seminaire/samuel-dalum.jpg"
              alt={SEMINAIRE_HOST}
              width={640}
              height={800}
              className="h-auto w-full"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent px-6 pb-6 pt-24">
              <span className="inline-block rounded bg-red-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                L&apos;hôte
              </span>
              <p className="mt-2 font-serif text-2xl font-bold">
                {SEMINAIRE_HOST}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <KeyFactsBar
        facts={[
          { icon: <CalendarDays />, label: "Dates", value: SEMINAIRE_DATE_LABEL },
          { icon: <MapPin />, label: "Lieu", value: SEMINAIRE_LOCATION_LABEL },
          {
            icon: <ShieldCheck />,
            label: "Participation",
            value: "Gratuite, sur inscription",
          },
        ]}
      />
    </section>
  );
}

function Programme() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading kicker="Programme" title="Quatre jours dans la présence de Dieu" />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SEMINAIRE_PROGRAMME.map((item, index) => (
          <motion.article
            key={item.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(10,22,64,0.45)] ring-1 ring-navy-100 transition-transform hover:-translate-y-1"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600" />
            <span className="font-serif text-5xl font-bold text-navy-100 transition-colors group-hover:text-gold-200">
              0{index + 1}
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-navy-950">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {item.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-gold-800 ring-1 ring-gold-200">
                <CalendarDays className="h-3.5 w-3.5" />
                {item.days}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1.5 text-navy-800 ring-1 ring-navy-100">
                <Clock className="h-3.5 w-3.5" />
                {item.time}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Speakers() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,_rgba(59,98,234,0.35),_transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading kicker="Orateurs" title="Des voix venues des nations" dark />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEMINAIRE_SPEAKERS.map((speaker, index) => (
            <motion.figure
              key={speaker.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white ring-1 ring-white/10 ${
                index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Image
                src={speaker.photo}
                alt={speaker.name}
                width={429}
                height={600}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/85 to-transparent px-6 pb-6 pt-20">
                <p className="font-serif text-xl font-bold">{speaker.name}</p>
                <p className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-sky-400/90 px-3 py-0.5 text-xs font-semibold text-navy-950">
                  <span aria-hidden>{speaker.flag}</span>
                  {speaker.country}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          className="mx-auto mt-12 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4"
        >
          <UserCheck className="h-5 w-5 shrink-0 text-gold-300" />
          <p className="text-sm text-navy-100">
            Coordinateur :{" "}
            <span className="font-semibold text-white">{SEMINAIRE_COORDINATOR}</span>
          </p>
        </motion.div>
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
                src={SEMINAIRE_POSTER_URL}
                width={96}
                height={136}
                downloadName={POSTER_DOWNLOAD_NAME}
                title="Partagez l'affiche"
                text="Invitez d'autres serviteurs de Dieu à s'inscrire."
              />
              <ContactsCard contacts={CONTACTS} />
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <GoogleFormCard
              url={SEMINAIRE_GOOGLE_FORM_URL}
              title="Inscription au séminaire"
              description="L'inscription se fait directement via notre formulaire Google. Cliquez sur le bouton ci-dessous pour ouvrir le formulaire et réserver votre place."
              ctaLabel="Ouvrir le formulaire d'inscription"
              note="Vos informations servent uniquement à l'organisation du séminaire."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
