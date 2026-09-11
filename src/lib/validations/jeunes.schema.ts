import { z } from "zod";
import { TSHIRT_SIZES, PICKUP_LOCATIONS } from "@/features/jeunes/constants";

const isValidPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

export const jeunesRegistrationSchema = z.object({
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
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .min(8, "Numéro invalide")
    .refine(isValidPhone, "Format de téléphone invalide"),
  city: z.string().min(2, "Veuillez indiquer votre ville"),
  country: z.string().min(1, "Veuillez sélectionner votre pays"),
  church: z.string().optional(),
  tshirtSize: z.enum(TSHIRT_SIZES, {
    required_error: "Veuillez sélectionner votre taille de t-shirt",
  }),
  pickupLocation: z.enum(PICKUP_LOCATIONS, {
    required_error: "Veuillez sélectionner votre lieu de prise en charge",
  }),
});

export type JeunesSchemaType = z.infer<typeof jeunesRegistrationSchema>;