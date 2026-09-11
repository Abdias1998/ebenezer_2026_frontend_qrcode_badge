import apiClient from "@/lib/axios";
import type {
  JeunesRegistrationData,
  RegistrationResponse,
} from "@/types/registration.types";

export const jeunesService = {
  async submit(
    data: JeunesRegistrationData,
    eventId: string,
    payment?: { paymentRef: string; paymentAmount: number },
  ): Promise<RegistrationResponse> {
    const response = await apiClient.post<{ data: RegistrationResponse }>(
      "/registrations/public",
      {
        ...data,
        eventId,
        paymentRef: payment?.paymentRef,
        paymentAmount: payment?.paymentAmount,
      },
    );
    return response.data.data;
  },
};