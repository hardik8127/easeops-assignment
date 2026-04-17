import apiClient from "@/lib/apiClient";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types/auth";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<TokenResponse>("/api/auth/register", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/api/auth/login", data).then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post("/api/auth/logout", { refresh_token: refreshToken }),

  getMe: () => apiClient.get<User>("/api/users/me").then((r) => r.data),

  updateMe: (data: Partial<Pick<User, "name" | "dark_mode">>) =>
    apiClient.put<User>("/api/users/me", data).then((r) => r.data),
};
