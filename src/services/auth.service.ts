import apiClient from "@/lib/axios";

export interface AdminUser {
  userId: string;
  email: string;
  roleName: string;
  permissions: string[];
}

interface LoginResponse {
  accessToken: string;
  user: AdminUser;
}

const TOKEN_KEY = "ebenezer_token";
const USER_KEY = "ebenezer_admin_user";

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    const response = await apiClient.post<{ data: LoginResponse }>("/auth/login", {
      email,
      password,
    });
    const { accessToken, user } = response.data.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
