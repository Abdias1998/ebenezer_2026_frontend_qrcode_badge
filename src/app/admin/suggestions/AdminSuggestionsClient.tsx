"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, LogOut, MessageSquareHeart, Phone, Trash2, User, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { suggestionService } from "@/services/suggestion.service";
import { formatDate } from "@/lib/utils";
import type { Suggestion } from "@/types/suggestion.types";

export function AdminSuggestionsClient() {
  const { user, isChecking, logout } = useAdminAuth();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["suggestions", page],
    queryFn: () => suggestionService.list(page, 20),
    enabled: !isChecking && !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => suggestionService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suggestions"] }),
    onError: () => toast.error("Impossible de marquer ce message comme lu."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => suggestionService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suggestions"] }),
    onError: () => toast.error("Impossible de supprimer ce message."),
  });

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Vérification de la session..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-royal-600" />
              Suggestions
            </h1>
            {user && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 mr-2">
              <Link
                href="/admin/suggestions"
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-royal-100 text-royal-700"
              >
                Suggestions
              </Link>
              <Link
                href="/admin/recruitments"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Recrutements
              </Link>
              <Link
                href="/admin/jeunes"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Jeûne des Jeunes
              </Link>
            </nav>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={logout}>
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {isLoading && <LoadingState message="Chargement des suggestions..." />}

        {isError && (
          <ErrorState
            type="network"
            onRetry={() => refetch()}
            message="Impossible de charger les suggestions."
          />
        )}

        {data && data.items.length === 0 && (
          <div className="form-section text-center py-16 text-gray-500">
            Aucune suggestion pour le moment.
          </div>
        )}

        {data?.items.map((suggestion) => (
          <SuggestionCard
            key={suggestion._id}
            suggestion={suggestion}
            onMarkAsRead={() => markAsReadMutation.mutate(suggestion._id)}
            onRemove={() => removeMutation.mutate(suggestion._id)}
          />
        ))}

        {data && data.meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-500">
              Page {data.meta.page} / {data.meta.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function SuggestionCard({
  suggestion,
  onMarkAsRead,
  onRemove,
}: {
  suggestion: Suggestion;
  onMarkAsRead: () => void;
  onRemove: () => void;
}) {
  const isNew = suggestion.status === "new";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`form-section ${isNew ? "border-royal-200 bg-royal-50/30" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="font-semibold text-gray-900 truncate">
            {suggestion.name || "Anonyme"}
          </span>
          {isNew && (
            <Badge variant="royal" className="shrink-0">
              Nouveau
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDate(suggestion.createdAt)}
        </span>
      </div>

      {suggestion.contact && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <Phone className="w-3.5 h-3.5" />
          {suggestion.contact}
        </div>
      )}

      <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{suggestion.message}</p>

      <div className="flex gap-2">
        {isNew && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onMarkAsRead}>
            <Check className="w-3.5 h-3.5" />
            Marquer comme lu
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-red-600 hover:bg-red-50"
          onClick={onRemove}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Supprimer
        </Button>
      </div>
    </motion.div>
  );
}
