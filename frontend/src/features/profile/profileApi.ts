import apiClient from "@/lib/apiClient";
import type { User } from "@/types/auth";

export const profileApi = {
  getMe: () => apiClient.get<User>("/api/users/me").then((r) => r.data),
  updateMe: (data: Partial<Pick<User, "name" | "dark_mode">>) =>
    apiClient.put<User>("/api/users/me", data).then((r) => r.data),
};
