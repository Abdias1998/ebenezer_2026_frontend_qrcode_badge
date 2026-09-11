import apiClient from "@/lib/axios";
import type {
  InitiatePaymentPayload,
  InitiatedPayment,
  PaymentStatus,
} from "@/types/registration.types";

export const feexpayService = {
  async initiate(payload: InitiatePaymentPayload): Promise<InitiatedPayment> {
    const response = await apiClient.post<{ data: InitiatedPayment }>(
      "/payments/initiate",
      payload,
    );
    return response.data.data;
  },

  async getStatus(reference: string): Promise<PaymentStatus> {
    const response = await apiClient.get<{ data: PaymentStatus }>(
      `/payments/status/${reference}`,
    );
    return response.data.data;
  },
};