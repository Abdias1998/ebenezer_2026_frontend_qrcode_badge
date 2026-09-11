import apiClient from "@/lib/axios";
import type {
  JeunesRegistrationData,
  RegistrationResponse,
} from "@/types/registration.types";

export const jeunesService = {
  async submit(
    data: JeunesRegistrationData,
    eventId: string,
  ): Promise<RegistrationResponse> {
    const response = await apiClient.post<{ data: RegistrationResponse }>(
      "/registrations/public",
      { ...data, eventId },
    );
    return response.data.data;
  },
};