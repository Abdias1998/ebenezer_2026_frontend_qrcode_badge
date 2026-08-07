import apiClient from "@/lib/axios";
import type { SuggestionFormData } from "@/lib/validations/suggestion.schema";
import type { PaginatedSuggestions } from "@/types/suggestion.types";

export const suggestionService = {
  async submit(data: SuggestionFormData): Promise<void> {
    await apiClient.post("/suggestions", data);
  },

  async list(page = 1, limit = 20): Promise<PaginatedSuggestions> {
    const response = await apiClient.get<{
      data: PaginatedSuggestions["items"];
      meta: PaginatedSuggestions["meta"];
    }>("/suggestions", { params: { page, limit } });
    return { items: response.data.data, meta: response.data.meta };
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/suggestions/${id}/read`);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/suggestions/${id}`);
  },
};
