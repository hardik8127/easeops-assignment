import apiClient from "@/lib/apiClient";
import type { BookDetail, BooksResponse, Category, Tag } from "@/types/book";

export const libraryApi = {
  getBooks: (params: {
    search?: string;
    category_id?: number;
    tag?: string;
    page?: number;
    page_size?: number;
  }) =>
    apiClient
      .get<BooksResponse>("/api/books/", { params })
      .then((r) => r.data),

  getBook: (id: number) =>
    apiClient.get<BookDetail>(`/api/books/${id}`).then((r) => r.data),

  getCategories: () =>
    apiClient.get<Category[]>("/api/books/categories").then((r) => r.data),

  getTags: () =>
    apiClient.get<Tag[]>("/api/books/tags").then((r) => r.data),
};
