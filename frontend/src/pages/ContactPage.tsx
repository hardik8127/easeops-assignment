import { ContactForm } from "@/features/contact/ContactForm";

export function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
        <p className="text-muted-foreground text-sm mt-1">Have a question? Send us a message.</p>
      </div>
      <ContactForm />
    </main>
  );
}
