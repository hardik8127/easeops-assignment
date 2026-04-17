import apiClient from "@/lib/apiClient";
import type { Bookmark, Note } from "@/types/book";

export const readerApi = {
  getBookmarks: () =>
    apiClient.get<Bookmark[]>("/api/bookmarks/").then((r) => r.data),

  addBookmark: (data: { book_id: number; page_number: number; label?: string }) =>
    apiClient.post<Bookmark>("/api/bookmarks/", data).then((r) => r.data),

  deleteBookmark: (id: number) =>
    apiClient.delete(`/api/bookmarks/${id}`),

  getNotes: () =>
    apiClient.get<Note[]>("/api/notes/").then((r) => r.data),

  addNote: (data: { book_id: number; page_number: number; text: string }) =>
    apiClient.post<Note>("/api/notes/", data).then((r) => r.data),

  deleteNote: (id: number) =>
    apiClient.delete(`/api/notes/${id}`),
};
