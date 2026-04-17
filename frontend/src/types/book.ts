export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  total_pages: number | null;
  created_at: string;
  category: Category | null;
  tags: Tag[];
}

export interface BookDetail extends Book {
  cloudinary_url: string;
}

export interface BooksResponse {
  items: Book[];
  total: number;
  page: number;
  page_size: number;
}

export interface Bookmark {
  id: number;
  book_id: number;
  page_number: number;
  label: string | null;
  created_at: string;
}

export interface Note {
  id: number;
  book_id: number;
  page_number: number;
  text: string;
  created_at: string;
}
