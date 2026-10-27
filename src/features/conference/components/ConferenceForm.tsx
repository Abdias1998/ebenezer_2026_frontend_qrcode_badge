"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/shared/FormField";
import { RegistrationTicket } from "@/components/shared/RegistrationTicket";
import { useSavedTicket } from "@/hooks/useSavedTicket";
import {
  conferenceRegistrationSchema,
  type ConferenceSchemaType,
} from "@/lib/validations/free-registration.schema";
import { BUSINESS_SECTORS } from "@/features/conference/constants";
import { registrationService } from "@/services/registration.service";
import { scrollToFirstError } from "@/lib/utils";

interface Props {
  eventId: string;
}

export function ConferenceForm({ eventId }: Props) {
  const { ticket, save, clear } = useSavedTicket(eventId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ConferenceSchemaType>({
    resolver: zodResolver(conferenceRegistrationSchema),
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
            ...data,
            whatsapp: data.phone,
            email: data.email || undefined,
            company: data.company || undefined,
            church: data.church || undefined,
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
          { label: "Secteur d'activité", value: ticket.participant.profession },
          { label: "Entreprise / organisation", value: ticket.participant.company },
          { label: "Ville", value: ticket.participant.city },
          { label: "Téléphone", value: ticket.participant.phone },
        ]}
        note="Présentez ce QR code à l'entrée de la salle le jour de la conférence."
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
        <h2 className="text-2xl font-serif font-bold text-navy-950">
          Inscription à la conférence
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Entrée libre et gratuite. Votre QR code d&apos;accès s&apos;affiche
          dès la validation du formulaire.
        </p>
      </div>

      {submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="conf-lastName"
            label="Nom"
            required
            error={errors.lastName?.message}
          >
            <Input
              id="conf-lastName"
              {...register("lastName")}
              placeholder="Ex : Dupont"
              error={!!errors.lastName}
              autoComplete="family-name"
            />
          </FormField>
          <FormField
            id="conf-firstName"
            label="Prénom(s)"
            required
            error={errors.firstName?.message}
          >
            <Input
              id="conf-firstName"
              {...register("firstName")}
              placeholder="Ex : Jean-Marc"
              error={!!errors.firstName}
              autoComplete="given-name"
            />
          </FormField>
        </div>

        <FormField
          id="conf-gender"
          label="Sexe"
          required
          error={errors.gender?.message}
        >
          <Select
            value={watch("gender")}
            onValueChange={(v) =>
              setValue("gender", v as ConferenceSchemaType["gender"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="conf-gender" error={!!errors.gender}>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="conf-phone"
            label="Téléphone (WhatsApp)"
            required
            error={errors.phone?.message}
          >
            <Input
              id="conf-phone"
              type="tel"
              inputMode="tel"
              {...register("phone")}
              placeholder="+229 01 97 00 00 00"
              error={!!errors.phone}
              autoComplete="tel"
            />
          </FormField>
          <FormField
            id="conf-email"
            label="Email"
            optional
            error={errors.email?.message}
          >
            <Input
              id="conf-email"
              type="email"
              {...register("email")}
              placeholder="vous@exemple.com"
              error={!!errors.email}
              autoComplete="email"
            />
          </FormField>
        </div>

        <div className="pt-3 mt-1 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
            Votre activité
          </p>
          <div className="space-y-4">
            <FormField
              id="conf-profession"
              label="Secteur d'activité"
              required
              error={errors.profession?.message}
            >
              <Select
                value={watch("profession")}
                onValueChange={(v) =>
                  setValue(
                    "profession",
                    v as ConferenceSchemaType["profession"],
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger id="conf-profession" error={!!errors.profession}>
                  <SelectValue placeholder="Sélectionnez votre secteur" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {BUSINESS_SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="conf-company"
              label="Entreprise / organisation"
              optional
              error={errors.company?.message}
            >
              <Input
                id="conf-company"
                {...register("company")}
                placeholder="Ex : Ets Dupont & Fils"
                error={!!errors.company}
                autoComplete="organization"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="conf-city"
                label="Ville"
                required
                error={errors.city?.message}
              >
                <Input
                  id="conf-city"
                  {...register("city")}
                  placeholder="Ex : Cotonou"
                  error={!!errors.city}
                  autoComplete="address-level2"
                />
              </FormField>
              <FormField
                id="conf-church"
                label="Église"
                optional
                error={errors.church?.message}
              >
                <Input
                  id="conf-church"
                  {...register("church")}
                  placeholder="Votre église"
                  error={!!errors.church}
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="navy"
        size="lg"
        loading={isSubmitting}
        className="mt-7 w-full gap-2 rounded-full"
      >
        Je m&apos;inscris et je reçois mon QR code
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.form>
  );
}
