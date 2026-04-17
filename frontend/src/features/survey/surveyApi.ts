import apiClient from "@/lib/apiClient";
import type { Survey } from "@/types/user";

export const surveyApi = {
  getSurveys: () => apiClient.get<Survey[]>("/api/surveys/").then((r) => r.data),
  respond: (id: number, answers: Record<string, unknown>) =>
    apiClient.post(`/api/surveys/${id}/respond`, { answers }).then((r) => r.data),
};
