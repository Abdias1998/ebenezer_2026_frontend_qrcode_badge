"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { RegistrationTicket } from "@/components/shared/RegistrationTicket";
import { useSavedTicket } from "@/hooks/useSavedTicket";
import {
  campRegistrationSchema,
  type CampSchemaType,
} from "@/lib/validations/free-registration.schema";
import {
  CampPrivacyDialog,
  CampRulesDialog,
} from "@/features/camp/components/CampDocuments";
import { registrationService } from "@/services/registration.service";
import { scrollToFirstError } from "@/lib/utils";

interface Props {
  eventId: string;
}

export function CampForm({ eventId }: Props) {
  const { ticket, save, clear } = useSavedTicket(eventId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CampSchemaType>({
    resolver: zodResolver(campRegistrationSchema),
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(
    async (data) => {
      setSubmitError(null);
      try {
        const registration = await registrationService.submitFree(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            whatsapp: data.phone,
            email: data.email || undefined,
            church: data.church || undefined,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            acceptRules: data.acceptRules,
            dataConsent: data.dataConsent,
          },
          eventId,
        );
        save(registration);
        reset();
      } catch (error: any) {
        setSubmitError(error?.message || "Une erreur est survenue");
      }
    },
    () => scrollToFirstError(form.formState.errors),
  );

  if (ticket) {
    return (
      <RegistrationTicket
        result={ticket}
        details={[
          {
            label: "Contact d'urgence",
            value: ticket.participant.emergencyContactName
              ? `${ticket.participant.emergencyContactName} · ${ticket.participant.emergencyContactPhone ?? ""}`
              : undefined,
          },
        ]}
        note={
          <>
            Télécharge ce QR code et présente-le à ton arrivée, à chaque
            séance du camp : il sera scanné pour enregistrer ta présence.
          </>
        }
        onNewRegistration={clear}
        tone="navy"
      />
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-xl rounded-[2rem] bg-white p-7 shadow-[0_30px_70px_-34px_rgba(10,22,64,0.55)] ring-1 ring-navy-100 sm:p-9"
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200">
          100 % gratuit · aucun paiement
        </span>
        <h2 className="mt-3 text-2xl font-serif font-bold text-navy-950">
          Inscription au camp
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ton QR code s&apos;affiche dès la validation : pense à le
          télécharger.
        </p>
      </div>

      {submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <FormSection title="Toi">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="camp-lastName" label="Nom" required error={errors.lastName?.message}>
              <Input
                id="camp-lastName"
                {...register("lastName")}
                placeholder="Ex : Dupont"
                error={!!errors.lastName}
                autoComplete="family-name"
              />
            </FormField>
            <FormField id="camp-firstName" label="Prénom(s)" required error={errors.firstName?.message}>
              <Input
                id="camp-firstName"
                {...register("firstName")}
                placeholder="Ex : Jean-Marc"
                error={!!errors.firstName}
                autoComplete="given-name"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="camp-phone"
              label="Téléphone (WhatsApp)"
              required
              error={errors.phone?.message}
            >
              <Input
                id="camp-phone"
                type="tel"
                inputMode="tel"
                {...register("phone")}
                placeholder="+229 01 97 00 00 00"
                error={!!errors.phone}
                autoComplete="tel"
              />
            </FormField>
            <FormField
              id="camp-email"
              label="E-mail"
              optional
              error={errors.email?.message}
            >
              <Input
                id="camp-email"
                type="email"
                {...register("email")}
                placeholder="toi@exemple.com"
                error={!!errors.email}
                autoComplete="email"
              />
            </FormField>
          </div>

          <FormField id="camp-church" label="Église" optional error={errors.church?.message}>
            <Input
              id="camp-church"
              {...register("church")}
              placeholder="Ton église"
              error={!!errors.church}
            />
          </FormField>
        </FormSection>

        <FormSection title="Personne à contacter en cas d'urgence">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="camp-emergencyName"
              label="Nom complet"
              required
              error={errors.emergencyContactName?.message}
            >
              <Input
                id="camp-emergencyName"
                {...register("emergencyContactName")}
                placeholder="Ex : Marie Dupont"
                error={!!errors.emergencyContactName}
              />
            </FormField>
            <FormField
              id="camp-emergencyPhone"
              label="Téléphone"
              required
              error={errors.emergencyContactPhone?.message}
            >
              <Input
                id="camp-emergencyPhone"
                type="tel"
                inputMode="tel"
                {...register("emergencyContactPhone")}
                placeholder="+229 01 97 00 00 00"
                error={!!errors.emergencyContactPhone}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Engagements">
          <ConsentCheckbox
            id="camp-acceptRules"
            field="acceptRules"
            checked={!!watch("acceptRules")}
            onChange={(v) =>
              setValue("acceptRules", v as true, { shouldValidate: true })
            }
            error={errors.acceptRules?.message}
          >
            J&apos;ai lu et j&apos;accepte le{" "}
            <CampRulesDialog
              trigger={
                <button type="button" className="font-semibold text-navy-700 underline underline-offset-2">
                  règlement du camp
                </button>
              }
            />
            .
          </ConsentCheckbox>
          <ConsentCheckbox
            id="camp-dataConsent"
            field="dataConsent"
            checked={!!watch("dataConsent")}
            onChange={(v) =>
              setValue("dataConsent", v as true, { shouldValidate: true })
            }
            error={errors.dataConsent?.message}
          >
            J&apos;accepte que mes informations soient collectées et traitées
            pour l&apos;organisation du camp (
            <CampPrivacyDialog
              trigger={
                <button type="button" className="font-semibold text-navy-700 underline underline-offset-2">
                  en savoir plus
                </button>
              }
            />
            ).
          </ConsentCheckbox>
        </FormSection>
      </div>

      <Button
        type="submit"
        variant="navy"
        size="lg"
        loading={isSubmitting}
        className="mt-7 w-full gap-2 rounded-full"
      >
        Je m&apos;inscris gratuitement
        <ArrowRight className="w-4 h-4" />
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <ShieldCheck className="h-3.5 w-3.5" />
        Tes données restent confidentielles et réservées aux responsables du camp.
      </p>
    </motion.form>
  );
}

function FormSection({
  title,
  subtitle,
  highlight,
  children,
}: {
  title: string;
  subtitle?: string;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset
      className={`space-y-4 border-t pt-4 first:border-t-0 first:pt-0 ${
        highlight
          ? "rounded-2xl border border-gold-200 bg-gold-50/60 p-4 first:pt-4"
          : "border-gray-100"
      }`}
    >
      <legend className="sr-only">{title}</legend>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </p>
        {subtitle && <p className="mt-1 text-xs text-gold-800">{subtitle}</p>}
      </div>
      {children}
    </fieldset>
  );
}

function ConsentCheckbox({
  id,
  field,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  /** Nom du champ : sert d'ancre pour défiler jusqu'à l'erreur. */
  field: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div id={field}>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5 border-navy-700 data-[state=checked]:bg-navy-700"
          aria-invalid={!!error}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-gray-700">
          {children}
        </label>
      </div>
      {error && <p className="ml-8 mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
