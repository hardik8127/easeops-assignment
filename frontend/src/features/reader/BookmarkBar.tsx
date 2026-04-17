import { Trash2 } from "lucide-react";
import type { Bookmark } from "@/types/book";
import { formatDate } from "@/lib/utils";

interface Props {
  bookmarks: Bookmark[];
  bookId: number;
  onDelete: (id: number) => void;
  onNavigate: (page: number) => void;
}

export function BookmarkBar({ bookmarks, bookId, onDelete, onNavigate }: Props) {
  const bookBookmarks = bookmarks.filter((b) => b.book_id === bookId);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-foreground">Bookmarks</h3>
      {bookBookmarks.length === 0 && (
        <p className="text-sm text-muted-foreground">No bookmarks yet. Click the bookmark icon in the toolbar.</p>
      )}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {bookBookmarks.map((bm) => (
          <div
            key={bm.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent cursor-pointer group"
          >
            <button
              className="flex-1 text-left"
              onClick={() => onNavigate(bm.page_number)}
            >
              <p className="text-sm font-medium text-foreground">
                {bm.label ?? `Page ${bm.page_number}`}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(bm.created_at)}</p>
            </button>
            <button
              onClick={() => onDelete(bm.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
