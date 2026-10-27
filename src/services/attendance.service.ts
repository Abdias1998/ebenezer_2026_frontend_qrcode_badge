import apiClient from "@/lib/axios";
import type { CheckInResult } from "@/types/registration.types";

export const attendanceService = {
  async scan(qrContent: string, eventId?: string): Promise<CheckInResult> {
    const response = await apiClient.post<{ data: CheckInResult }>(
      "/attendance/scan",
      { qrContent, eventId: eventId || undefined },
    );
    return response.data.data;
  },

  /** Pointage manuel (QR code perdu) depuis le dashboard. */
  async checkIn(registrationId: string, eventId?: string): Promise<CheckInResult> {
    const response = await apiClient.post<{ data: CheckInResult }>(
      `/attendance/registrations/${registrationId}/check-in`,
      { eventId: eventId || undefined },
    );
    return response.data.data;
  },
};
