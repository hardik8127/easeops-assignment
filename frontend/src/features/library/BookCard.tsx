import { Link } from "react-router-dom";
import { BookOpen, Tag } from "lucide-react";
import type { Book } from "@/types/book";
import { truncate } from "@/lib/utils";

interface Props {
  book: Book;
}

export function BookCard({ book }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-muted-foreground opacity-40" />
        )}
        {book.category && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {book.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {truncate(book.description, 100)}
          </p>
        )}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {book.tags.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-0.5 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
