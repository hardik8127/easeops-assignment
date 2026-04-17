import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryApi } from "@/features/library/libraryApi";
import { readerApi } from "@/features/reader/readerApi";
import { PdfViewer } from "@/features/reader/PdfViewer";
import { BookmarkBar } from "@/features/reader/BookmarkBar";
import { NotesPanel } from "@/features/reader/NotesPanel";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/features/auth/authStore";
import { BookOpen, SidebarOpen, SidebarClose } from "lucide-react";

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [reading, setReading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"bookmarks" | "notes">("bookmarks");

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => libraryApi.getBook(bookId),
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: readerApi.getBookmarks,
    enabled: isAuthenticated(),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: readerApi.getNotes,
    enabled: isAuthenticated(),
  });

  const addBookmark = useMutation({
    mutationFn: (page: number) => readerApi.addBookmark({ book_id: bookId, page_number: page }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const deleteBookmark = useMutation({
    mutationFn: readerApi.deleteBookmark,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const addNote = useMutation({
    mutationFn: (text: string) => readerApi.addNote({ book_id: bookId, page_number: 1, text }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: readerApi.deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  if (!book) return <div className="text-center py-20 text-muted-foreground">Book not found.</div>;

  if (!reading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-48 h-64 shrink-0 rounded-xl overflow-hidden bg-muted flex items-center justify-center shadow">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-16 h-16 text-muted-foreground opacity-40" />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{book.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">{book.author}</p>
            </div>
            {book.category && (
              <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                {book.category.name}
              </span>
            )}
            {book.description && (
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            )}
            <button
              onClick={() => setReading(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg py-2.5 px-6 hover:opacity-90 transition"
            >
              <BookOpen className="w-5 h-5" />
              Read eBook
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <PdfViewer
          url={book.cloudinary_url}
          bookId={bookId}
          onBookmark={(page) => addBookmark.mutate(page)}
        />
      </div>

      {isAuthenticated() && (
        <>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="fixed right-4 top-20 z-50 p-2 bg-card border border-border rounded-lg shadow-md hover:bg-accent transition"
          >
            {sidebarOpen ? <SidebarClose className="w-5 h-5" /> : <SidebarOpen className="w-5 h-5" />}
          </button>

          {sidebarOpen && (
            <aside className="w-80 border-l border-border bg-card overflow-y-auto p-4 space-y-4">
              <div className="flex gap-2">
                {(["bookmarks", "notes"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarTab(tab)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      sidebarTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {sidebarTab === "bookmarks" ? (
                <BookmarkBar
                  bookmarks={bookmarks}
                  bookId={bookId}
                  onDelete={(id) => deleteBookmark.mutate(id)}
                  onNavigate={() => {}}
                />
              ) : (
                <NotesPanel
                  notes={notes}
                  currentPage={1}
                  bookId={bookId}
                  onAdd={(text) => addNote.mutate(text)}
                  onDelete={(id) => deleteNote.mutate(id)}
                />
              )}
            </aside>
          )}
        </>
      )}
    </div>
  );
}
