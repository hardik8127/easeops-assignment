import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface Props {
  url: string;
  bookId: number;
  onBookmark: (page: number) => void;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function proxiedUrl(raw: string): string {
  if (raw.startsWith("http://localhost") || raw.startsWith("http://127.0.0.1")) return raw;
  return `${API_BASE}/api/proxy/pdf?url=${encodeURIComponent(raw)}`;
}

export function PdfViewer({ url, bookId, onBookmark }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => { setNumPages(numPages); setLoadError(null); },
    []
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2 shadow-sm sticky top-16 z-10">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-1 rounded hover:bg-accent disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-foreground">
          Page {currentPage} of {numPages}
        </span>
        <button
          disabled={currentPage >= numPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-1 rounded hover:bg-accent disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          className="p-1 rounded hover:bg-accent"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-xs text-muted-foreground w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
          className="p-1 rounded hover:bg-accent"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button
          onClick={() => onBookmark(currentPage)}
          title="Bookmark this page"
          className="p-1 rounded hover:bg-accent text-primary"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {loadError && (
        <div className="w-full max-w-xl text-center py-10 text-red-500 text-sm border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20">
          Failed to load PDF: {loadError}
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden shadow">
        <Document
          file={proxiedUrl(url)}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => setLoadError(err.message)}
          loading={
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground text-sm">
              Loading PDF…
            </div>
          }
        >
          <Page pageNumber={currentPage} scale={scale} renderAnnotationLayer renderTextLayer />
        </Document>
      </div>
    </div>
  );
}
