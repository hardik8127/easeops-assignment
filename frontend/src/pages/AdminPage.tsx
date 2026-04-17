import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Trash2, Plus, ShieldCheck, ShieldOff } from "lucide-react";

type Tab = "books" | "categories" | "tags" | "faqs" | "surveys" | "contacts" | "users";

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("books");
  const tabs: Tab[] = ["books", "categories", "tags", "faqs", "surveys", "contacts", "users"];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>

      <div className="flex gap-2 flex-wrap border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {tab === "books" && <BooksTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "tags" && <TagsTab />}
        {tab === "faqs" && <FAQsTab />}
        {tab === "surveys" && <SurveysTab />}
        {tab === "contacts" && <ContactsTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </main>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>;
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// ── Books Tab ──────────────────────────────────────────────────────────────

function BooksTab() {
  const qc = useQueryClient();
  const { data: books = [] } = useQuery({ queryKey: ["admin-books"], queryFn: adminApi.getBooks });
  const { data: cats = [] } = useQuery({ queryKey: ["admin-cats"], queryFn: adminApi.getCategories });

  const [form, setForm] = useState({
    title: "", author: "", description: "", cloudinary_url: "",
    cloudinary_public_id: "", cover_url: "", total_pages: "", category_id: "",
  });

  const create = useMutation({
    mutationFn: () => adminApi.createBook({
      title: form.title, author: form.author,
      description: form.description || null,
      cloudinary_url: form.cloudinary_url,
      cloudinary_public_id: form.cloudinary_public_id || form.cloudinary_url,
      cover_url: form.cover_url || null,
      total_pages: form.total_pages ? Number(form.total_pages) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      tag_ids: [],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-books"] });
      setForm({ title: "", author: "", description: "", cloudinary_url: "", cloudinary_public_id: "", cover_url: "", total_pages: "", category_id: "" });
    },
  });

  const del = useMutation({
    mutationFn: adminApi.deleteBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-books"] }),
  });

  const fields: { key: keyof typeof form; label: string; placeholder?: string }[] = [
    { key: "title", label: "Title *" },
    { key: "author", label: "Author *" },
    { key: "description", label: "Description" },
    { key: "cloudinary_url", label: "PDF URL (Cloudinary) *", placeholder: "https://res.cloudinary.com/..." },
    { key: "cloudinary_public_id", label: "Public ID (leave blank to use URL)" },
    { key: "cover_url", label: "Cover Image URL" },
    { key: "total_pages", label: "Total Pages" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Add New Book" />

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder ?? label.replace(" *", "")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— None —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={() => create.mutate()}
          disabled={!form.title || !form.author || !form.cloudinary_url || create.isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          <Plus className="w-4 h-4" />
          {create.isPending ? "Adding…" : "Add Book"}
        </button>
      </div>

      <SectionHeader title={`All Books (${books.length})`} />
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {books.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No books yet.</p>}
        {books.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-5 py-3 hover:bg-accent/50">
            <div>
              <p className="font-medium text-sm text-foreground">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.author}</p>
            </div>
            <DeleteBtn onClick={() => del.mutate(b.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Categories Tab ─────────────────────────────────────────────────────────

function CategoriesTab() {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery({ queryKey: ["admin-cats"], queryFn: adminApi.getCategories });
  const [name, setName] = useState("");

  const create = useMutation({
    mutationFn: () => adminApi.createCategory(name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-cats"] }); setName(""); },
  });
  const del = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-cats"] }),
  });

  return (
    <div className="space-y-4 max-w-md">
      <SectionHeader title="Categories" />
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={() => create.mutate()} disabled={!name || create.isPending}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {cats.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No categories yet.</p>}
        {cats.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/50">
            <span className="text-sm text-foreground">{c.name}</span>
            <DeleteBtn onClick={() => del.mutate(c.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tags Tab ───────────────────────────────────────────────────────────────

function TagsTab() {
  const qc = useQueryClient();
  const { data: tags = [] } = useQuery({ queryKey: ["admin-tags"], queryFn: adminApi.getTags });
  const [name, setName] = useState("");

  const create = useMutation({
    mutationFn: () => adminApi.createTag(name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); setName(""); },
  });
  const del = useMutation({
    mutationFn: adminApi.deleteTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tags"] }),
  });

  return (
    <div className="space-y-4 max-w-md">
      <SectionHeader title="Tags" />
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={() => create.mutate()} disabled={!name || create.isPending}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t.id} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full">
            {t.name}
            <button onClick={() => del.mutate(t.id)} className="text-red-500 hover:opacity-80"><Trash2 className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── FAQs Tab ───────────────────────────────────────────────────────────────

function FAQsTab() {
  const qc = useQueryClient();
  const { data: faqs = [] } = useQuery({ queryKey: ["admin-faqs"], queryFn: adminApi.getFAQs });
  const [q, setQ] = useState(""); const [a, setA] = useState("");

  const create = useMutation({
    mutationFn: () => adminApi.createFAQ(q, a),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faqs"] }); setQ(""); setA(""); },
  });
  const del = useMutation({
    mutationFn: adminApi.deleteFAQ,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionHeader title="FAQs" />
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <textarea value={a} onChange={(e) => setA(e.target.value)} rows={3} placeholder="Answer"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={() => create.mutate()} disabled={!q || !a || create.isPending}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {faqs.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No FAQs yet.</p>}
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between px-5 py-3 hover:bg-accent/50 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{f.question}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.answer}</p>
            </div>
            <DeleteBtn onClick={() => del.mutate(f.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Surveys Tab ────────────────────────────────────────────────────────────

function SurveysTab() {
  const qc = useQueryClient();
  const { data: surveys = [] } = useQuery({ queryKey: ["admin-surveys"], queryFn: adminApi.getSurveys });
  const [title, setTitle] = useState("");
  const [questionsRaw, setQuestionsRaw] = useState(`[{"id":"q1","text":"How satisfied are you?","type":"radio","options":["Very satisfied","Satisfied","Neutral","Dissatisfied"]}]`);
  const [jsonError, setJsonError] = useState("");

  const create = useMutation({
    mutationFn: () => {
      const questions = JSON.parse(questionsRaw);
      return adminApi.createSurvey(title, questions);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-surveys"] }); setTitle(""); },
  });

  const del = useMutation({
    mutationFn: adminApi.deleteSurvey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-surveys"] }),
  });

  const validate = (val: string) => {
    try { JSON.parse(val); setJsonError(""); } catch { setJsonError("Invalid JSON"); }
    setQuestionsRaw(val);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionHeader title="Surveys" />
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Survey title"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Questions (JSON array)</label>
          <textarea value={questionsRaw} onChange={(e) => validate(e.target.value)} rows={6}
            className={`w-full rounded-lg border px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background ${jsonError ? "border-red-500" : "border-input"}`} />
          {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
        </div>
        <button onClick={() => create.mutate()} disabled={!title || !!jsonError || create.isPending}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add Survey
        </button>
      </div>
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {surveys.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No surveys yet.</p>}
        {surveys.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-accent/50">
            <span className="text-sm font-medium text-foreground">{s.title}</span>
            <DeleteBtn onClick={() => del.mutate(s.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Contacts Tab ───────────────────────────────────────────────────────────

function ContactsTab() {
  const { data: contacts = [] } = useQuery({ queryKey: ["admin-contacts"], queryFn: adminApi.getContacts });

  return (
    <div className="space-y-4">
      <SectionHeader title={`Contact Requests (${contacts.length})`} />
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {contacts.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">No contact requests yet.</p>}
        {contacts.map((c) => (
          <div key={c.id} className="px-5 py-4 space-y-1 hover:bg-accent/50">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm text-foreground">{c.name} — <span className="text-muted-foreground font-normal">{c.email}</span></p>
              {c.subject && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{c.subject}</span>}
            </div>
            <p className="text-sm text-muted-foreground">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────

function UsersTab() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.getUsers });

  const toggle = useMutation({
    mutationFn: adminApi.toggleAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div className="space-y-4">
      <SectionHeader title={`Users (${users.length})`} />
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-accent/50">
            <div>
              <p className="text-sm font-medium text-foreground">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {u.is_admin && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Admin</span>}
              <button
                onClick={() => toggle.mutate(u.id)}
                title={u.is_admin ? "Remove admin" : "Make admin"}
                className="p-1.5 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground"
              >
                {u.is_admin ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
