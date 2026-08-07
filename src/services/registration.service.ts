import apiClient from "@/lib/axios";
import type { RegistrationFormData, RegistrationResponse } from "@/types/registration.types";

export const registrationService = {
  async createRegistration(
    data: RegistrationFormData,
    eventId: string,
  ): Promise<RegistrationResponse> {
    const formData = new FormData();

    // Flatten form data
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photo" && value instanceof File) {
        formData.append("photo", value);
      } else if (key === "participationDays" && Array.isArray(value)) {
        value.forEach((day) => formData.append("participationDays[]", day));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("eventId", eventId);

    const response = await apiClient.post<{ data: RegistrationResponse }>(
      "/registrations/public",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
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
