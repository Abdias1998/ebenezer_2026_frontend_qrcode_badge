"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PersonalInformation } from "./PersonalInformation";
import { fullRegistrationSchema } from "@/lib/validations/registration.schema";
import type { RegistrationSchemaType } from "@/lib/validations/registration.schema";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useRegistration } from "@/hooks/useRegistration";
import { scrollToFirstError } from "@/lib/utils";
import type { EventInfo } from "@/types/registration.types";

interface Props {
  event?: EventInfo;
}

export function ParticipantForm({ event }: Props) {
  const eventId = event?.id || process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID || "default";
  const { mutate: submitRegistration, isPending } = useRegistration(eventId);

  const form = useForm<RegistrationSchemaType>({
    resolver: zodResolver(fullRegistrationSchema),
    defaultValues: {
      gender: undefined,
      acceptTerms: undefined,
    },
    mode: "onTouched",
  });

  const {
    watch,
    setValue,
    formState: { isDirty, errors },
  } = form;
  useFormPersistence(form);
  useBeforeUnload(isDirty && !isPending);

  const acceptTerms = watch("acceptTerms");

  const onSubmit = form.handleSubmit(
    (data) => submitRegistration(data as any),
    () => scrollToFirstError(form.formState.errors),
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PersonalInformation form={form} />
          </motion.div>

          {/* Terms */}
          <div
            className={cn(
              "form-section",
              errors.acceptTerms ? "border-2 border-red-300 bg-red-50/30" : "",
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms === true}
                onCheckedChange={(v) =>
                  setValue("acceptTerms", v === true ? true : (undefined as any), {
                    shouldValidate: true,
                  })
                }
                className="mt-0.5"
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                J'accepte les{" "}
                <a href="#" className="text-royal-600 hover:underline font-medium">
                  conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a href="#" className="text-royal-600 hover:underline font-medium">
                  politique de confidentialité
                </a>{" "}
                de la plateforme EBENEZER. Je confirme que les informations fournies sont exactes.
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500 mt-2 ml-8">{errors.acceptTerms?.message as string}</p>
            )}

            <div className="mt-4 flex items-start gap-2 p-3 bg-royal-50 rounded-xl border border-royal-100">
              <CheckCircle2 className="w-4 h-4 text-royal-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-royal-700">
                Après validation, votre badge et votre QR code seront générés immédiatement.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="royal"
              size="lg"
              loading={isPending}
              className="gap-2 min-w-[220px]"
            >
              <Send className="w-4 h-4" />
              Générer mon badge
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
