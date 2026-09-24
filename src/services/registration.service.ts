import apiClient from "@/lib/axios";
import type {
  AdminRegistration,
  PaginatedAdminRegistrations,
  RattrapagePayload,
  RegistrationFormData,
  RegistrationListParams,
  RegistrationResponse,
  RegistrationStats,
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

  async list(params: RegistrationListParams = {}): Promise<PaginatedAdminRegistrations> {
    const response = await apiClient.get<{
      data: PaginatedAdminRegistrations["items"];
      meta: PaginatedAdminRegistrations["meta"];
    }>("/registrations", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        event: params.eventId,
        paid: params.paid === true ? "true" : undefined,
        tshirtSize: params.tshirtSize || undefined,
        pickupLocation: params.pickupLocation || undefined,
        city: params.city || undefined,
        church: params.church || undefined,
        paymentNetwork: params.paymentNetwork || undefined,
        status: params.status || undefined,
        search: params.search || undefined,
      },
    });
    return { items: response.data.data, meta: response.data.meta };
  },

  async stats(params: {
    eventId?: string;
    paid?: boolean;
  } = {}): Promise<RegistrationStats> {
    const response = await apiClient.get<{ data: RegistrationStats }>(
      "/registrations/stats",
      {
        params: {
          event: params.eventId,
          paid: params.paid === true ? "true" : undefined,
        },
      },
    );
    return response.data.data;
  },

  async exportListToPdf(params: {
    eventId?: string;
    paid?: boolean;
  } = {}): Promise<Blob> {
    const response = await apiClient.get<Blob>("/registrations/export", {
      params: {
        event: params.eventId,
        paid: params.paid === true ? "true" : undefined,
      },
      responseType: "blob",
    });
    return response.data;
  },

  async rattrapage(data: RattrapagePayload): Promise<RegistrationResponse> {
    const response = await apiClient.post<{ data: RegistrationResponse }>(
      "/registrations/rattrapage",
      data,
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
