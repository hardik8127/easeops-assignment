import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { Note } from "@/types/book";
import { formatDate } from "@/lib/utils";

interface Props {
  notes: Note[];
  currentPage: number;
  bookId: number;
  onAdd: (text: string) => void;
  onDelete: (id: number) => void;
}

export function NotesPanel({ notes, currentPage, bookId, onAdd, onDelete }: Props) {
  const [text, setText] = useState("");

  const pageNotes = notes.filter((n) => n.book_id === bookId);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-foreground">Notes</h3>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add a note for page ${currentPage}…`}
          rows={3}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="self-end p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {pageNotes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
        {pageNotes.map((note) => (
          <div key={note.id} className="flex items-start gap-2 p-3 rounded-lg bg-secondary">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Page {note.page_number} · {formatDate(note.created_at)}
              </p>
              <p className="text-sm text-foreground">{note.text}</p>
            </div>
            <button
              onClick={() => onDelete(note.id)}
              className="text-muted-foreground hover:text-red-500 mt-0.5 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
