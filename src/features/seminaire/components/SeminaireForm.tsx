"use client";

import { useMemo, useState } from "react";
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
  seminaireRegistrationSchema,
  type SeminaireSchemaType,
} from "@/lib/validations/free-registration.schema";
import { MINISTRY_TITLES } from "@/features/seminaire/constants";
import { registrationService } from "@/services/registration.service";
import { scrollToFirstError, COUNTRIES } from "@/lib/utils";

interface Props {
  eventId: string;
}

export function SeminaireForm({ eventId }: Props) {
  const { ticket, save, clear } = useSavedTicket(eventId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const countries = useMemo(() => COUNTRIES, []);

  const form = useForm<SeminaireSchemaType>({
    resolver: zodResolver(seminaireRegistrationSchema),
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
          { ...data, whatsapp: data.phone },
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
          { label: "Titre", value: ticket.participant.title },
          { label: "Église / Ministère", value: ticket.participant.church },
          { label: "Pays", value: ticket.participant.country },
          { label: "Ville", value: ticket.participant.city },
        ]}
        note="Présentez ce QR code à l'accueil du séminaire pour retirer votre badge."
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
          Inscription des pasteurs
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Inscription gratuite. Votre QR code d&apos;accès s&apos;affiche dès
          la validation du formulaire.
        </p>
      </div>

      {submitError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <FormField
          id="sem-title"
          label="Titre / fonction"
          required
          error={errors.title?.message}
        >
          <Select
            value={watch("title")}
            onValueChange={(v) =>
              setValue("title", v as SeminaireSchemaType["title"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="sem-title" error={!!errors.title}>
              <SelectValue placeholder="Ex : Pasteur" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {MINISTRY_TITLES.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="sem-lastName"
            label="Nom"
            required
            error={errors.lastName?.message}
          >
            <Input
              id="sem-lastName"
              {...register("lastName")}
              placeholder="Ex : Dupont"
              error={!!errors.lastName}
              autoComplete="family-name"
            />
          </FormField>
          <FormField
            id="sem-firstName"
            label="Prénom(s)"
            required
            error={errors.firstName?.message}
          >
            <Input
              id="sem-firstName"
              {...register("firstName")}
              placeholder="Ex : Jean-Marc"
              error={!!errors.firstName}
              autoComplete="given-name"
            />
          </FormField>
        </div>

        <FormField
          id="sem-gender"
          label="Sexe"
          required
          error={errors.gender?.message}
        >
          <Select
            value={watch("gender")}
            onValueChange={(v) =>
              setValue("gender", v as SeminaireSchemaType["gender"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="sem-gender" error={!!errors.gender}>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="sem-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            id="sem-email"
            type="email"
            {...register("email")}
            placeholder="vous@exemple.com"
            error={!!errors.email}
            autoComplete="email"
          />
        </FormField>

        <FormField
          id="sem-phone"
          label="Numéro WhatsApp (avec indicatif pays)"
          required
          error={errors.phone?.message}
        >
          <Input
            id="sem-phone"
            type="tel"
            inputMode="tel"
            {...register("phone")}
            placeholder="+229 01 97 00 00 00"
            error={!!errors.phone}
            autoComplete="tel"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="sem-country"
            label="Pays"
            required
            error={errors.country?.message}
          >
            <Select
              value={watch("country")}
              onValueChange={(v) =>
                setValue("country", v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="sem-country" error={!!errors.country}>
                <SelectValue placeholder="Sélectionnez votre pays" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="sem-city"
            label="Ville"
            required
            error={errors.city?.message}
          >
            <Input
              id="sem-city"
              {...register("city")}
              placeholder="Votre ville"
              error={!!errors.city}
              autoComplete="address-level2"
            />
          </FormField>
        </div>

        <FormField
          id="sem-church"
          label="Église / Ministère"
          required
          error={errors.church?.message}
        >
          <Input
            id="sem-church"
            {...register("church")}
            placeholder="Le nom de votre église ou ministère"
            error={!!errors.church}
          />
        </FormField>
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
