import apiClient from "@/lib/axios";
import type { EventInfo } from "@/types/registration.types";

export const eventService = {
  async getActiveEvent(): Promise<EventInfo> {
    const response = await apiClient.get<{ data: EventInfo }>(
      "/events/active",
    );
    return response.data.data;
  },

  async getEvent(id: string): Promise<EventInfo> {
    const response = await apiClient.get<{ data: EventInfo }>(
      `/events/${id}`,
    );
    return response.data.data;
  },

  async getEventStats(id: string): Promise<{
    totalSlots: number;
    registeredCount: number;
    remainingSlots: number;
  }> {
    const response = await apiClient.get<{
      data: { totalSlots: number; registeredCount: number; remainingSlots: number };
    }>(`/events/${id}/stats`);
    return response.data.data;
  },
};

// Mock fallback for development when backend is unavailable
export const mockEventInfo: EventInfo = {
  id: "ebenezer-2026",
  name: "EBENEZER 2026",
  theme: "Et jusqu'ici l'Éternel nous a secourus",
  description:
    "Cinq jours de restauration, d'enseignement prophétique et d'adoration profonde. Un rendez-vous spirituel unique pour toute la famille chrétienne.",
  startDate: "2026-08-20T00:00:00Z",
  endDate: "2026-08-24T00:00:00Z",
  location: "Cotonou, Bénin",
  totalSlots: 3000,
  registeredCount: 1847,
  remainingSlots: 1153,
  status: "active",
};
