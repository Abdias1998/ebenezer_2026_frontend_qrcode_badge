import apiClient from "@/lib/axios";
import type {
  AdminRegistration,
  PaginatedAdminRegistrations,
  RegistrationFormData,
  RegistrationResponse,
} from "@/types/registration.types";

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

  async list(params: {
    eventId?: string;
    paid?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedAdminRegistrations> {
    const response = await apiClient.get<{
      data: PaginatedAdminRegistrations["items"];
      meta: PaginatedAdminRegistrations["meta"];
    }>("/registrations", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        event: params.eventId,
        paid: params.paid === true ? "true" : undefined,
      },
    });
    return { items: response.data.data, meta: response.data.meta };
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
