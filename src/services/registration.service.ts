import apiClient from "@/lib/axios";
import type { RegistrationFormData, RegistrationResponse } from "@/types/registration.types";

export const registrationService = {
  async createRegistration(
    data: RegistrationFormData,
    eventId: string,
  ): Promise<RegistrationResponse> {
    // The photo never leaves the browser: it's only used locally to render
    // the badge, so it's excluded from the payload sent to the backend.
    const { photo: _photo, acceptTerms, ...rest } = data;

    const response = await apiClient.post<{ data: RegistrationResponse }>(
      "/registrations/public",
      { ...rest, acceptTerms: String(acceptTerms), eventId },
    );

    return response.data.data;
  },

  async getRegistration(id: string): Promise<RegistrationResponse> {
    const response = await apiClient.get<{ data: RegistrationResponse }>(
      `/registrations/${id}`,
    );
    return response.data.data;
  },

  async getRegistrationByNumber(
    number: string,
  ): Promise<RegistrationResponse> {
    const response = await apiClient.get<{ data: RegistrationResponse }>(
      `/registrations/number/${number}`,
    );
    return response.data.data;
  },

  async checkDuplicate(email: string, eventId: string): Promise<boolean> {
    try {
      await apiClient.get(
        `/registrations/check?email=${encodeURIComponent(email)}&eventId=${eventId}`,
      );
      return true;
    } catch {
      return false;
    }
  },
};
