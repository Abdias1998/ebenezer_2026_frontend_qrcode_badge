import { z } from "zod";

export const suggestionSchema = z.object({
  name: z.string().max(100, "Le nom est trop long").optional().or(z.literal("")),
  contact: z.string().max(100, "Trop long").optional().or(z.literal("")),
  message: z
    .string()
    .min(3, "Le message doit contenir au moins 3 caractères")
    .max(2000, "Le message est trop long (2000 caractères max)"),
});

export type SuggestionFormData = z.infer<typeof suggestionSchema>;
