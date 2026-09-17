"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  PartyPopper,
  Phone,
  XCircle,
} from "lucide-react";
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
  PAYMENT_NETWORKS,
  JDJ_REGISTRATION_FEE,
} from "@/features/jeunes/constants";
import { jeunesService } from "@/services/jeunes.service";
import { feexpayService } from "@/services/feexpay.service";
import { scrollToFirstError, COUNTRIES } from "@/lib/utils";
import type { RegistrationResponse } from "@/types/registration.types";

const POLL_INTERVAL_MS = 15_000;
const PAYMENT_TIMEOUT_MS = 300_000;

const PAYMENT_REASON_LABELS: Record<string, string> = {
  LOW_BALANCE_OR_PAYEE_LIMIT_REACHED_OR_NOT_ALLOWED:
    "Solde insuffisant ou limite de paiement de votre compte atteinte.",
  EXCEEDED_LIMIT: "Vous avez dépassé la limite de paiement autorisée.",
  TRANSACTION_FAILED: "La transaction a échoué chez l'opérateur.",
  INSUFFICIENT_FUNDS: "Solde insuffisant pour effectuer ce paiement.",
  OPERATION_TIMED_OUT:
    "L'opération a expiré. Vous n'avez pas confirmé le paiement à temps.",
  PAYEE_NOT_REACHABLE: "Le numéro indiqué n'est pas joignable.",
  INVALID_PHONE_NUMBER:
    "Le numéro Mobile Money est invalide pour ce réseau.",
};

function paymentFailureMessage(reason?: string): string {
  if (!reason) {
    return "Le paiement a échoué. Veuillez réessayer.";
  }
  return PAYMENT_REASON_LABELS[reason] ?? `Le paiement a échoué. Motif : ${reason}.`;
}

interface Props {
  eventId: string;
  eventName?: string;
}

export function JeunesForm({ eventId, eventName }: Props) {
  const [step, setStep] = useState<"form" | "pending" | "done">("form");
  const [result, setResult] = useState<RegistrationResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    watch,
    formState: { errors },
  } = form;

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const pollPaymentStatus = useCallback(
    async (reference: string, formData: JeunesSchemaType) => {
      pollRef.current = setInterval(async () => {
        let status;
        try {
          status = await feexpayService.getStatus(reference);
        } catch {
          return;
        }

        if (status.status === "SUCCESSFUL") {
          stopPolling();
          try {
            const registration = await jeunesService.submit(
              formData,
              eventId,
              { paymentRef: reference, paymentAmount: JDJ_REGISTRATION_FEE },
            );
            setResult(registration);
            setStep("done");
          } catch (error: any) {
            const message = error?.message || "Une erreur est survenue";
            setStep("form");
            setSubmitError(
              message.toLowerCase().includes("déjà") ||
                error?.statusCode === 409
                ? "Vous êtes déjà inscrit(e) à cet événement."
                : message,
            );
          }
        } else if (status.status === "FAILED") {
          stopPolling();
          setStep("form");
          setSubmitError(paymentFailureMessage(status.reason));
        }
      }, POLL_INTERVAL_MS);

      timeoutRef.current = setTimeout(() => {
        stopPolling();
        setStep("form");
        setSubmitError(
          "Le délai de confirmation du paiement est expiré. Veuillez réessayer.",
        );
      }, PAYMENT_TIMEOUT_MS);
    },
    [eventId, stopPolling],
  );

  const onSubmit = handleSubmit(
    async (data) => {
      setSubmitError(null);
      setIsPending(true);
      try {
        const payment = await feexpayService.initiate({
          network: data.paymentNetwork as "mtn" | "moov" | "celtiis_bj",
          phoneNumber: data.paymentPhone,
          amount: JDJ_REGISTRATION_FEE,
          firstName: data.firstName,
          lastName: data.lastName,
          callbackInfo: {
            eventId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            city: data.city,
            country: data.country,
            church: data.church ?? "",
            tshirtSize: data.tshirtSize,
            pickupLocation: data.pickupLocation,
            paymentNetwork: data.paymentNetwork,
            paymentPhone: data.paymentPhone,
          },
        });

        const isMoov = data.paymentNetwork === "moov";

        if (isMoov && payment.status === "SUCCESSFUL") {
          // Moov renvoie SUCCESSFUL directement, pas de polling
          const registration = await jeunesService.submit(data, eventId, {
            paymentRef: payment.reference,
            paymentAmount: JDJ_REGISTRATION_FEE,
          });
          setResult(registration);
          setStep("done");
        } else if (isMoov && payment.status === "FAILED") {
          setSubmitError(paymentFailureMessage(payment.reason));
        } else {
          setStep("pending");
          await pollPaymentStatus(payment.reference, data);
        }
      } catch (error: any) {
        const message = error?.message || "Une erreur est survenue";
        setSubmitError(message);
      } finally {
        setIsPending(false);
      }
    },
    () => {
      scrollToFirstError(form.formState.errors);
    },
  );

  const paymentNetworkLabel = watch("paymentNetwork")
    ? PAYMENT_NETWORKS.find((n) => n.value === watch("paymentNetwork"))?.label
    : null;

  const paymentPhoneValue = watch("paymentPhone");

  if (step === "pending") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl"
      >
        <div className="form-section text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-royal-100 flex items-center justify-center">
            <Phone className="w-7 h-7 text-royal-600 animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Paiement en cours…
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Validez la demande de{" "}
            <strong className="text-gray-800">
              {JDJ_REGISTRATION_FEE.toLocaleString("fr-FR")} FCFA
            </strong>{" "}
            sur votre téléphone.
          </p>

          {paymentNetworkLabel && (
            <div className="mt-5 grid grid-cols-2 gap-3 text-left max-w-xs mx-auto">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Réseau
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {paymentNetworkLabel}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Numéro
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {paymentPhoneValue}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-6 h-6 text-royal-600 animate-spin" />
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              En attente de confirmation (vérification toutes les 15
              secondes)…
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                stopPolling();
                setStep("form");
                setSubmitError("Paiement annulé.");
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

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
          {eventName
            ? `Rendez-vous spirituel « ${eventName} »`
            : "Remplissez ce formulaire pour réserver votre place."}
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
            Numéro (WhatsApp de préférence){" "}
            <span className="required-star">*</span>
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
              onValueChange={(v) =>
                setValue("country", v, { shouldValidate: true })
              }
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
            Église / Organisation d&apos;appartenance{" "}
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
                setValue(
                  "tshirtSize",
                  v as JeunesSchemaType["tshirtSize"],
                  { shouldValidate: true },
                )
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
                setValue(
                  "pickupLocation",
                  v as JeunesSchemaType["pickupLocation"],
                  { shouldValidate: true },
                )
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

        {/* ───────── Paiement Mobile Money ───────── */}
        <div className="pt-3 mt-1 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
            Paiement Mobile Money —{" "}
            <span className="text-royal-600">
              {JDJ_REGISTRATION_FEE.toLocaleString("fr-FR")} FCFA
            </span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jdj-paymentNetwork" className="field-label">
                Réseau <span className="required-star">*</span>
              </Label>
              <Select
                value={form.watch("paymentNetwork")}
                onValueChange={(v) =>
                  setValue("paymentNetwork", v, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="jdj-paymentNetwork"
                  error={!!errors.paymentNetwork}
                >
                  <SelectValue placeholder="Choisir le réseau" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_NETWORKS.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentNetwork && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.paymentNetwork?.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="jdj-paymentPhone" className="field-label">
                Numéro Mobile Money <span className="required-star">*</span>
              </Label>
              <Input
                id="jdj-paymentPhone"
                type="tel"
                inputMode="tel"
                {...register("paymentPhone")}
                placeholder="0167919100"
                error={!!errors.paymentPhone}
              />
              {errors.paymentPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.paymentPhone?.message as string}
                </p>
              )}
            </div>
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
        Je paie {JDJ_REGISTRATION_FEE.toLocaleString("fr-FR")} FCFA et je
        reçois mon billet
        <ArrowRight className="w-4 h-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Validez la demande de paiement sur votre téléphone. Votre billet
        (QR code) s&apos;affiche dès confirmation.
      </p>
    </motion.form>
  );
}
