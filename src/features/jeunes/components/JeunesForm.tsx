"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PartyPopper, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jeunesRegistrationSchema } from "@/lib/validations/jeunes.schema";
import type { JeunesSchemaType } from "@/lib/validations/jeunes.schema";
import {
  TSHIRT_SIZES,
  PICKUP_LOCATIONS,
} from "@/features/jeunes/constants";
import { jeunesService } from "@/services/jeunes.service";
import { scrollToFirstError, COUNTRIES } from "@/lib/utils";
import type { RegistrationResponse } from "@/types/registration.types";

interface Props {
  eventId: string;
  eventName?: string;
}

export function JeunesForm({ eventId, eventName }: Props) {
  const [result, setResult] = useState<RegistrationResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const countries = useMemo(() => COUNTRIES, []);

  const form = useForm<JeunesSchemaType>({
    resolver: zodResolver(jeunesRegistrationSchema),
    defaultValues: {
      country: "Bénin",
    },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    setIsPending(true);
    try {
      const response = await jeunesService.submit(data, eventId);
      setResult(response);
    } catch (error: any) {
      const message = error?.message || "Une erreur est survenue";
      if (message.toLowerCase().includes("déjà") || error?.statusCode === 409) {
        setSubmitError("Vous êtes déjà inscrit(e) à cet événement.");
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsPending(false);
    }
  }, () => {
    scrollToFirstError(form.formState.errors);
  });

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl"
      >
        <div className="form-section text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Inscription réussie !
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {result.participant.firstName}, votre place est réservée. Un
            récapitulatif vous a été envoyé.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-royal-50 border border-royal-100 px-5 py-2">
            <PartyPopper className="w-4 h-4 text-royal-600" />
            <span className="text-sm font-semibold text-royal-700">
              {result.registrationNumber}
            </span>
          </div>

          {result.qrCode && (
            <div className="mt-6 mx-auto max-w-[220px] p-4 bg-white rounded-2xl border border-gray-100 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qrCode}
                alt="QR code d'accès"
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Taille de t-shirt
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {result.participant.tshirtSize}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Lieu de prise en charge
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {result.participant.pickupLocation}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Présentez votre QR code à l'entrée et au point de prise en charge.
          </p>
        </div>
      </motion.div>
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
          Inscription
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {eventName ? `Rendez-vous spirituel « ${eventName} »` : "Remplissez ce formulaire pour réserver votre place."}
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
          <div>
            <Label htmlFor="jdj-lastName" className="field-label">
              Nom <span className="required-star">*</span>
            </Label>
            <Input
              id="jdj-lastName"
              {...register("lastName")}
              placeholder="Ex : Dupont"
              error={!!errors.lastName}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName?.message as string}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="jdj-firstName" className="field-label">
              Prénom(s) <span className="required-star">*</span>
            </Label>
            <Input
              id="jdj-firstName"
              {...register("firstName")}
              placeholder="Ex : Jean-Marc"
              error={!!errors.firstName}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName?.message as string}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="jdj-email" className="field-label">
            Email <span className="required-star">*</span>
          </Label>
          <Input
            id="jdj-email"
            type="email"
            {...register("email")}
            placeholder="vous@exemple.com"
            error={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email?.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="jdj-phone" className="field-label">
            Numéro (WhatsApp de préférence) <span className="required-star">*</span>
          </Label>
          <Input
            id="jdj-phone"
            type="tel"
            inputMode="tel"
            {...register("phone")}
            placeholder="+229 97 00 00 00"
            error={!!errors.phone}
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone?.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jdj-city" className="field-label">
              Ville <span className="required-star">*</span>
            </Label>
            <Input
              id="jdj-city"
              {...register("city")}
              placeholder="Votre ville"
              error={!!errors.city}
              autoComplete="address-level2"
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">
                {errors.city?.message as string}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="jdj-country" className="field-label">
              Pays <span className="required-star">*</span>
            </Label>
            <Select
              value={form.watch("country")}
              onValueChange={(v) => setValue("country", v, { shouldValidate: true })}
            >
              <SelectTrigger id="jdj-country" error={!!errors.country}>
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
            {errors.country && (
              <p className="text-xs text-red-500 mt-1">
                {errors.country?.message as string}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="jdj-church" className="field-label">
            Église / Organisation d'appartenance{" "}
            <span className="text-gray-400 font-normal">(facultatif)</span>
          </Label>
          <Input
            id="jdj-church"
            {...register("church")}
            placeholder="Le nom de votre église ou organisation"
            error={!!errors.church}
          />
          {errors.church && (
            <p className="text-xs text-red-500 mt-1">
              {errors.church?.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <Label htmlFor="jdj-tshirt" className="field-label">
              Taille de t-shirt <span className="required-star">*</span>
            </Label>
            <Select
              value={form.watch("tshirtSize")}
              onValueChange={(v) =>
                setValue("tshirtSize", v as JeunesSchemaType["tshirtSize"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="jdj-tshirt" error={!!errors.tshirtSize}>
                <SelectValue placeholder="Choisissez votre taille" />
              </SelectTrigger>
              <SelectContent>
                {TSHIRT_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tshirtSize && (
              <p className="text-xs text-red-500 mt-1">
                {errors.tshirtSize?.message as string}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="jdj-pickup" className="field-label">
              Lieu de prise en charge <span className="required-star">*</span>
            </Label>
            <Select
              value={form.watch("pickupLocation")}
              onValueChange={(v) =>
                setValue("pickupLocation", v as JeunesSchemaType["pickupLocation"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="jdj-pickup" error={!!errors.pickupLocation}>
                <SelectValue placeholder="Où faut-il venir vous chercher ?" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {PICKUP_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pickupLocation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.pickupLocation?.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="royal"
        size="lg"
        loading={isPending}
        className="mt-7 w-full gap-2 rounded-full"
      >
        Je m'inscris et je reçois mon billet
        <ArrowRight className="w-4 h-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Votre billet (QR code) s'affiche aussitôt après l'inscription.
      </p>
    </motion.form>
  );
}