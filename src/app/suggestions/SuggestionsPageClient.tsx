"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareHeart, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { suggestionService } from "@/services/suggestion.service";
import {
  suggestionSchema,
  type SuggestionFormData,
} from "@/lib/validations/suggestion.schema";

export function SuggestionsPageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
  });

  const onSubmit = async (data: SuggestionFormData) => {
    try {
      await suggestionService.submit(data);
      reset();
      setIsSubmitted(true);
    } catch {
      toast.error("Impossible d'envoyer votre message. Réessayez.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="hero-gradient py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-400/20 border-4 border-gold-400/40 mb-5">
            <MessageSquareHeart className="w-8 h-8 text-gold-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Tes suggestions
          </h1>
          <p className="text-blue-200">
            Propositions, suggestions, remarques : partage-les avec l'équipe EBENEZER.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-section text-center py-10"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Message envoyé !</h2>
            <p className="text-sm text-gray-500 mb-6">
              Merci, ton message a bien été transmis à l'équipe.
            </p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Envoyer un autre message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="form-section space-y-5"
          >
            <div>
              <Label htmlFor="name" className="field-label">
                Nom
              </Label>
              <Input id="name" {...register("name")} placeholder="Ex : Jean Dupont" />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact" className="field-label">
                Téléphone, WhatsApp ou email
              </Label>
              <Input
                id="contact"
                {...register("contact")}
                placeholder="Pour qu'on puisse te répondre (facultatif)"
              />
              {errors.contact && (
                <p className="text-xs text-red-500 mt-1">{errors.contact.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="message" className="field-label">
                Ton message <span className="required-star">*</span>
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                error={!!errors.message}
                placeholder="Tes propositions, suggestions et remarques..."
                rows={6}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" variant="gold" className="w-full gap-2" loading={isSubmitting}>
              <Send className="w-4 h-4" />
              Envoyer
            </Button>
          </motion.form>
        )}
      </div>
    </main>
  );
}
