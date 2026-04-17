import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { libraryApi } from "@/features/library/libraryApi";
import { BookGrid } from "@/features/library/BookGrid";
import { SearchBar } from "@/features/library/SearchBar";
import { CategoryFilter } from "@/features/library/CategoryFilter";

export function LibraryPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: libraryApi.getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["books", search, categoryId, page],
    queryFn: () => libraryApi.getBooks({ search, category_id: categoryId ?? undefined, page }),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Library</h1>
        <p className="text-muted-foreground">Browse and read our collection of eBooks</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      <CategoryFilter
        categories={categories}
        selected={categoryId}
        onChange={(id) => { setCategoryId(id); setPage(1); }}
      />

      <BookGrid books={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > data.page_size && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {Math.ceil(data.total / data.page_size)}
          </span>
          <button
            disabled={page >= Math.ceil(data.total / data.page_size)}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
