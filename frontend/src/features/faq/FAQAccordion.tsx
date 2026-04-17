import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types/user";

interface Props {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
      {faqs.map((faq) => (
        <div key={faq.id}>
          <button
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent transition-colors"
          >
            <span className="font-medium text-foreground">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                open === faq.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === faq.id && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
