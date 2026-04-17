import type { Book } from "@/types/book";
import { BookCard } from "./BookCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Props {
  books: Book[];
  isLoading: boolean;
}

export function BookGrid({ books, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No eBooks found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
