import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { FAQ } from "@/types/user";
import { FAQAccordion } from "@/features/faq/FAQAccordion";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function FAQPage() {
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => apiClient.get<FAQ[]>("/api/faqs/").then((r) => r.data),
  });

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-sm mt-1">Find answers to common questions</p>
      </div>
      {isLoading ? <LoadingSpinner /> : <FAQAccordion faqs={faqs} />}
    </main>
  );
}
