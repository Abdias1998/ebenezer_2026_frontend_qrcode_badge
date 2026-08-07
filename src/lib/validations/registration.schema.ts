import { z } from "zod";

const isValidPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom est trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides"),
  gender: z.enum(["male", "female"], {
    required_error: "Veuillez sélectionner votre sexe",
  }),
  phone: z
    .string()
    .min(8, "Numéro de téléphone invalide")
    .refine(isValidPhone, "Format de téléphone invalide"),
  whatsapp: z
    .string()
    .min(8, "Numéro WhatsApp invalide")
    .refine(isValidPhone, "Format WhatsApp invalide"),
  email: z.string().email("Adresse email invalide"),
  photo: z
    .any()
    .refine((val) => val instanceof File, "La photo est obligatoire pour générer votre badge"),
});

export const termsSchema = z.object({
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
});

export const fullRegistrationSchema = personalInfoSchema.merge(termsSchema);

export type RegistrationSchemaType = z.infer<typeof fullRegistrationSchema>;
