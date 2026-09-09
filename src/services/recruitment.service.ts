import apiClient from "@/lib/axios";
import type { Recruitment, PaginatedRecruitments } from "@/types/recruitment.types";

export const recruitmentService = {
  async list(page = 1, limit = 20): Promise<PaginatedRecruitments> {
    const response = await apiClient.get<{
      data: PaginatedRecruitments["items"];
      meta: PaginatedRecruitments["meta"];
    }>("/recruitments", { params: { page, limit } });
    return { items: response.data.data, meta: response.data.meta };
  },

  async getById(id: string): Promise<Recruitment> {
    const response = await apiClient.get<{ data: Recruitment }>(`/recruitments/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await apiClient.patch(`/recruitments/${id}/status`, { status });
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/recruitments/${id}`);
  },
};
