import { apiRequest, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: payload });
  },

  login(payload: LoginPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload });
  },

  forgotPassword(email: string): Promise<{ ok: boolean }> {
    return apiRequest("/auth/forgot-password", { method: "POST", body: { email } });
  },

  resetPassword(token: string, password: string): Promise<{ ok: boolean }> {
    return apiRequest("/auth/reset-password", { method: "POST", body: { token, password } });
  },

  logout() {
    setToken(null);
  },
};
