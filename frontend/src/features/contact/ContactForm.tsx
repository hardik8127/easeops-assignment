import { useState } from "react";
import apiClient from "@/lib/apiClient";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiClient.post("/api/contact/", form);
      setDone(true);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-foreground">Message sent!</p>
        <p className="text-sm text-muted-foreground mt-1">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {(["name", "email", "subject"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-foreground mb-1 capitalize">{field}</label>
          <input
            type={field === "email" ? "email" : "text"}
            required={field !== "subject"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-primary-foreground font-semibold rounded-lg py-2 px-5 hover:opacity-90 disabled:opacity-60 transition"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
