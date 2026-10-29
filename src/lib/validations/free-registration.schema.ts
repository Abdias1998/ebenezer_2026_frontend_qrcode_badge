import { z } from "zod";
import { MINISTRY_TITLES } from "@/features/seminaire/constants";
import { BUSINESS_SECTORS } from "@/features/conference/constants";

const isValidPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `Le ${label} doit contenir au moins 2 caractères`)
    .max(50, `Le ${label} est trop long`)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides");

const phone = z
  .string()
  .trim()
  .min(8, "Numéro invalide")
  .refine(isValidPhone, "Format de téléphone invalide");

const gender = z.enum(["male", "female"], {
  required_error: "Veuillez indiquer votre sexe",
});

export const seminaireRegistrationSchema = z.object({
  title: z.enum(MINISTRY_TITLES, {
    required_error: "Veuillez indiquer votre titre",
  }),
  lastName: name("nom"),
  firstName: name("prénom"),
  gender,
  email: z.string().trim().email("Adresse email invalide"),
  phone,
  country: z.string().min(1, "Veuillez sélectionner votre pays"),
  city: z.string().trim().min(2, "Veuillez indiquer votre ville"),
  church: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre église ou ministère"),
});

export type SeminaireSchemaType = z.infer<typeof seminaireRegistrationSchema>;

export const campRegistrationSchema = z.object({
  lastName: name("nom"),
  firstName: name("prénom"),
  phone,
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),
  church: z.string().trim().optional(),
  emergencyContactName: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer le nom de la personne à contacter"),
  emergencyContactPhone: phone,
  acceptRules: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter le règlement du camp" }),
  }),
  dataConsent: z.literal(true, {
    errorMap: () => ({
      message: "Votre consentement est nécessaire pour traiter l'inscription",
    }),
  }),
});

export type CampSchemaType = z.infer<typeof campRegistrationSchema>;

export const conferenceRegistrationSchema = z.object({
  lastName: name("nom"),
  firstName: name("prénom"),
  gender,
  phone,
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),
  profession: z.enum(BUSINESS_SECTORS, {
    required_error: "Veuillez indiquer votre secteur d'activité",
  }),
  company: z.string().trim().max(100, "Nom trop long").optional(),
  city: z.string().trim().min(2, "Veuillez indiquer votre ville"),
  church: z.string().trim().optional(),
});

export type ConferenceSchemaType = z.infer<typeof conferenceRegistrationSchema>;
