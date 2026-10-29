"use client";

import { motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarDays,
  Clock,
  Compass,
  Flame,
  HeartHandshake,
  MapPin,
  QrCode,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserCheck,
  Users,
} from "lucide-react";
import { CampForm } from "@/features/camp/components/CampForm";
import { CampRulesDialog } from "@/features/camp/components/CampDocuments";
import { missionSerif } from "@/features/mission/fonts";
import {
  ContactsCard,
  KeyFactsBar,
  MissionFooter,
  MissionHeader,
  SectionHeading,
  StepsList,
  fadeUp,
} from "@/features/mission/components/MissionLanding";
import {
  CAMP_ACTIVITIES,
  CAMP_CONTACTS,
  CAMP_DATE_LABEL,
  CAMP_EDITION,
  CAMP_EVENT_ID,
  CAMP_EVENT_NAME,
  CAMP_HOURS_LABEL,
  CAMP_LOCATION_LABEL,
  CAMP_OBJECTIVES,
  CAMP_PRACTICAL,
  CAMP_TAGLINE,
  CAMP_VISION,
} from "@/features/camp/constants";

const OBJECTIVE_ICONS = [
  <Flame key="flame" />,
  <BookOpenCheck key="book" />,
  <HeartHandshake key="heart" />,
  <Compass key="compass" />,
];
const PRACTICAL_ICONS = [
  <Sparkles key="sparkles" />,
  <ShieldCheck key="shield" />,
  <QrCode key="qr" />,
  <Users key="users" />,
];

const STEPS = [
  {
    icon: <Ticket />,
    title: "Inscris-toi en ligne",
    text: "Quelques minutes suffisent. C'est 100 % gratuit, aucun paiement.",
  },
  {
    icon: <QrCode />,
    title: "Reçois ton QR code",
    text: "Il s'affiche tout de suite : télécharge-le sur ton téléphone.",
  },
  {
    icon: <UserCheck />,
    title: "Présente-le à l'arrivée",
    text: "Il est scanné à l'accueil, à chaque séance, pour enregistrer ta présence.",
  },
];

/** Étoiles placées de façon déterministe (pas d'écart entre serveur et client). */
const STARS = Array.from({ length: 48 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: (i % 3) + 1,
  delay: (i % 7) * 0.6,
}));

export function CampPageClient() {
  return (
    <main
      className={`${missionSerif.variable} min-h-screen bg-slate-50 text-gray-900`}
    >
      <Hero />
      <Vision />
      <NightProgramme />
      <Practical />
      <Registration />
      <MissionFooter
        title={`${CAMP_EVENT_NAME} · ${CAMP_EDITION}`}
        subtitle={`${CAMP_DATE_LABEL} · ${CAMP_LOCATION_LABEL} · Inscription 100 % gratuite`}
      />
    </main>
  );
}

function StarField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: 0.35 + star.size * 0.15,
            animationDelay: `${star.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#030820_0%,#0a1640_55%,#1d2a7a_100%)] text-white">
      <StarField />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] max-w-[200%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,_rgba(139,92,246,0.35),_transparent_70%)]"
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
            Jeunesse · {CAMP_EDITION}
          </p>
          <h1 className="mt-6 font-serif text-[2.8rem] font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {CAMP_EVENT_NAME}
          </h1>
          <p className="mt-4 font-serif text-2xl italic text-gold-300 sm:text-3xl">
            {CAMP_TAGLINE}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-navy-100 lg:mx-0">
            Chaque vendredi, une nuit de louange, de prière et de Parole,
            pensée pour les jeunes. Inscris-toi en ligne et reçois ton QR code d&apos;accès.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#inscription"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-bold text-navy-950 shadow-[0_12px_30px_-10px_rgba(245,158,11,0.7)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <Ticket className="h-4 w-4" />
              Je m&apos;inscris
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-500/15 px-5 py-3 text-sm font-bold uppercase tracking-wide text-green-300">
              <ShieldCheck className="h-4 w-4" />
              100 % gratuit
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto flex aspect-square w-full max-w-xs items-end justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(252,211,77,0.3),_transparent_65%)]" />
          <div className="absolute inset-[16%] overflow-hidden rounded-full bg-gradient-to-br from-gold-200 via-gold-300 to-gold-500 shadow-[0_0_80px_20px_rgba(252,211,77,0.3)]">
            <div className="absolute -right-[22%] -top-[12%] h-full w-full rounded-full bg-[#0b1743]" />
          </div>
          <div className="relative grid w-full grid-cols-3 gap-2 text-center">
            {[
              { value: "Ven.", label: "chaque semaine" },
              { value: "11 h", label: "dans Sa présence" },
              { value: "0 F", label: "à payer" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-navy-950/60 px-2 py-3 backdrop-blur"
              >
                <p className="font-serif text-2xl font-bold">{item.value}</p>
                <p className="text-[11px] leading-tight text-navy-100">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <KeyFactsBar
        facts={[
          { icon: <CalendarDays />, label: "Date", value: CAMP_DATE_LABEL },
          { icon: <Clock />, label: "Horaires", value: CAMP_HOURS_LABEL },
          { icon: <MapPin />, label: "Lieu", value: CAMP_LOCATION_LABEL },
        ]}
      />
    </section>
  );
}

function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading kicker="La vision" title="Pourquoi ce camp ?" />
      <motion.p
        {...fadeUp}
        className="mx-auto mt-8 max-w-3xl text-center font-serif text-lg italic leading-relaxed text-navy-900 sm:text-xl"
      >
        {CAMP_VISION}
      </motion.p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CAMP_OBJECTIVES.map((objective, index) => (
          <motion.article
            key={objective.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_20px_50px_-30px_rgba(10,22,64,0.45)] ring-1 ring-navy-100"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600" />
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-gold-300 [&>svg]:h-5 [&>svg]:w-5">
              {OBJECTIVE_ICONS[index]}
            </span>
            <h3 className="mt-4 font-serif text-lg font-bold text-navy-950">
              {objective.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
              {objective.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function NightProgramme() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
      <StarField />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading kicker="Programme" title="Le déroulé de la nuit" dark />
        <ol className="relative mt-12 space-y-6 border-l border-white/15 pl-8">
          {CAMP_ACTIVITIES.map((activity, index) => (
            <motion.li
              key={activity.time}
              {...fadeUp}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[2.6rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950 ring-2 ring-gold-400">
                <span className="h-2 w-2 rounded-full bg-gold-400" />
              </span>
              <p className="text-sm font-bold tabular-nums text-gold-300">
                {activity.time}
              </p>
              <p className="mt-0.5 font-serif text-xl font-bold">{activity.title}</p>
              <p className="mt-1 text-sm text-navy-200">{activity.text}</p>
            </motion.li>
          ))}
        </ol>
        <p className="mt-10 text-center text-xs text-navy-300">
          Programme indicatif, susceptible d&apos;évoluer.
        </p>
      </div>
    </section>
  );
}

function Practical() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading kicker="Infos pratiques" title="Bien préparer ta nuit" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CAMP_PRACTICAL.map((item, index) => (
          <motion.div
            key={item.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="rounded-3xl bg-white p-6 ring-1 ring-navy-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-200 [&>svg]:h-5 [&>svg]:w-5">
              {PRACTICAL_ICONS[index]}
            </span>
            <p className="mt-4 font-semibold text-navy-950">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeUp} className="mt-8 flex justify-center">
        <CampRulesDialog
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              <ScrollText className="h-4 w-4" />
              Lire le règlement du camp
            </button>
          }
        />
      </motion.div>
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
        <SectionHeading kicker="Inscription" title="Réserve ta place, c'est gratuit" />

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1 lg:sticky lg:top-8">
            <motion.div {...fadeUp} className="space-y-6">
              <StepsList steps={STEPS} />
              <ContactsCard contacts={CAMP_CONTACTS} />
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <CampForm eventId={CAMP_EVENT_ID} />
          </div>
        </div>
      </div>
    </section>
  );
}
