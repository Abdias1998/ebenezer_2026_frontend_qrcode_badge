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
  campRegistrationSchema,
  type CampSchemaType,
} from "@/lib/validations/free-registration.schema";
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
            ...data,
            email: data.email || undefined,
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
          { label: "Ville", value: ticket.participant.city },
          { label: "Église", value: ticket.participant.church },
          {
            label: "Contact d'urgence",
            value: ticket.participant.emergencyContactName
              ? `${ticket.participant.emergencyContactName} · ${ticket.participant.emergencyContactPhone ?? ""}`
              : undefined,
          },
        ]}
        note="Présente ce QR code à ton arrivée au camp : il sera scanné pour confirmer ta présence."
        onNewRegistration={clear}
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
      className="mx-auto max-w-xl rounded-[2rem] bg-white p-7 shadow-[0_30px_70px_-34px_rgba(131,0,5,0.45)] ring-1 ring-royal-200/60 sm:p-9"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          Inscription au camp
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Inscription gratuite. Ton QR code s&apos;affiche dès la validation :
          garde-le, il sera scanné à ton arrivée.
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
            id="camp-lastName"
            label="Nom"
            required
            error={errors.lastName?.message}
          >
            <Input
              id="camp-lastName"
              {...register("lastName")}
              placeholder="Ex : Dupont"
              error={!!errors.lastName}
              autoComplete="family-name"
            />
          </FormField>
          <FormField
            id="camp-firstName"
            label="Prénom(s)"
            required
            error={errors.firstName?.message}
          >
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
            id="camp-gender"
            label="Sexe"
            required
            error={errors.gender?.message}
          >
            <Select
              value={watch("gender")}
              onValueChange={(v) =>
                setValue("gender", v as CampSchemaType["gender"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="camp-gender" error={!!errors.gender}>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Garçon</SelectItem>
                <SelectItem value="female">Fille</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="camp-dob"
            label="Date de naissance"
            required
            error={errors.dob?.message}
          >
            <Input
              id="camp-dob"
              type="date"
              {...register("dob")}
              error={!!errors.dob}
              autoComplete="bday"
            />
          </FormField>
        </div>

        <FormField
          id="camp-phone"
          label="Numéro (WhatsApp de préférence)"
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
          label="Email"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="camp-city"
            label="Ville / quartier"
            required
            error={errors.city?.message}
          >
            <Input
              id="camp-city"
              {...register("city")}
              placeholder="Ex : Cotonou, Akpakpa"
              error={!!errors.city}
              autoComplete="address-level2"
            />
          </FormField>
          <FormField
            id="camp-church"
            label="Église"
            optional
            error={errors.church?.message}
          >
            <Input
              id="camp-church"
              {...register("church")}
              placeholder="Ton église"
              error={!!errors.church}
            />
          </FormField>
        </div>

        <div className="pt-3 mt-1 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
            Parent / personne à prévenir
          </p>
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
        </div>
      </div>

      <Button
        type="submit"
        variant="royal"
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
