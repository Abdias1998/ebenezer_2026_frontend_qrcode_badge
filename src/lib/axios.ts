import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ebenezer_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ERR_NETWORK") {
      throw new Error("Connexion impossible. Vérifiez votre connexion internet.");
    }

    if (error.response) {
      const data = error.response.data as any;
      const message = data?.message || "Une erreur est survenue";

      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ebenezer_token");
        }
      }

      throw {
        statusCode: error.response.status,
        message: Array.isArray(message) ? message.join(", ") : message,
        errors: data?.errors,
      };
    }

    throw new Error(error.message || "Erreur réseau");
  },
);

export default apiClient;
