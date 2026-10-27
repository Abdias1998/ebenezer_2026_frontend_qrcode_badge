import type { ReactNode } from "react";
import { Send } from "lucide-react";

interface Props {
  kicker: { icon: ReactNode; label: string };
  title: string;
  description: ReactNode;
  chips: { icon: ReactNode; label: string }[];
  footerTitle: string;
  children: ReactNode;
}

export const WHATSAPP_NUMBER_LABEL = "+229 01 49 87 28 28";
export const WHATSAPP_URL = "https://wa.me/2290149872828";

/** Mise en page commune des pages d'inscription : hero, formulaire, contact, pied de page. */
export function EventLanding({
  kicker,
  title,
  description,
  chips,
  footerTitle,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-royal-50/50">
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,0.35),_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 py-14 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
            {kicker.icon}
            {kicker.label}
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-display font-bold tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-royal-100/90 leading-relaxed">
            {description}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2"
              >
                {chip.icon}
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative -mb-6 flex justify-center" aria-hidden>
          <div className="h-6 sm:h-8 w-full max-w-3xl bg-royal-50/50 rounded-t-[2rem] mx-4" />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16 pt-16 sm:pt-20">
        {children}

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-gray-500 max-w-sm">
            Des questions ? Écrivez-nous au{" "}
            <strong>{WHATSAPP_NUMBER_LABEL}</strong> sur WhatsApp.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold text-white px-5 py-2.5 text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Nous écrire sur WhatsApp
          </a>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p className="font-medium text-white mb-1">{footerTitle}</p>
        <p>Plateforme d&apos;inscription officielle</p>
      </footer>
    </main>
  );
}
