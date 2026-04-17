import apiClient from "./apiClient";

export interface AdminBook {
  id: number;
  title: string;
  author: string;
  description: string | null;
  cloudinary_url: string;
  cloudinary_public_id: string;
  cover_url: string | null;
  total_pages: number | null;
  category_id: number | null;
}

export interface AdminCategory { id: number; name: string; }
export interface AdminTag { id: number; name: string; }
export interface AdminFAQ { id: number; question: string; answer: string; }
export interface AdminSurvey { id: number; title: string; questions: unknown[]; }
export interface AdminContact { id: number; name: string; email: string; subject: string | null; message: string; }
export interface AdminUser { id: number; name: string; email: string; is_admin: boolean; is_active: boolean; created_at: string; dark_mode: boolean; }

const g = <T>(url: string) => apiClient.get<T>(url).then(r => r.data);
const p = <T>(url: string, data: unknown) => apiClient.post<T>(url, data).then(r => r.data);
const d = (url: string) => apiClient.delete(url);
const put = <T>(url: string, data: unknown) => apiClient.put<T>(url, data).then(r => r.data);

export const adminApi = {
  // categories
  getCategories: () => g<AdminCategory[]>("/api/admin/categories"),
  createCategory: (name: string) => p<AdminCategory>("/api/admin/categories", { name }),
  deleteCategory: (id: number) => d(`/api/admin/categories/${id}`),

  // tags
  getTags: () => g<AdminTag[]>("/api/admin/tags"),
  createTag: (name: string) => p<AdminTag>("/api/admin/tags", { name }),
  deleteTag: (id: number) => d(`/api/admin/tags/${id}`),

  // books
  getBooks: () => g<AdminBook[]>("/api/admin/books"),
  createBook: (data: Omit<AdminBook, "id"> & { tag_ids: number[] }) => p<AdminBook>("/api/admin/books", data),
  updateBook: (id: number, data: Omit<AdminBook, "id"> & { tag_ids: number[] }) => put<AdminBook>(`/api/admin/books/${id}`, data),
  deleteBook: (id: number) => d(`/api/admin/books/${id}`),

  // faqs
  getFAQs: () => g<AdminFAQ[]>("/api/admin/faqs"),
  createFAQ: (q: string, a: string) => p<AdminFAQ>("/api/admin/faqs", { question: q, answer: a }),
  deleteFAQ: (id: number) => d(`/api/admin/faqs/${id}`),

  // surveys
  getSurveys: () => g<AdminSurvey[]>("/api/admin/surveys"),
  createSurvey: (title: string, questions: unknown[]) => p<AdminSurvey>("/api/admin/surveys", { title, questions }),
  deleteSurvey: (id: number) => d(`/api/admin/surveys/${id}`),

  // contacts
  getContacts: () => g<AdminContact[]>("/api/admin/contacts"),

  // users
  getUsers: () => g<AdminUser[]>("/api/admin/users"),
  toggleAdmin: (id: number) => apiClient.patch<AdminUser>(`/api/admin/users/${id}/toggle-admin`).then(r => r.data),
};
