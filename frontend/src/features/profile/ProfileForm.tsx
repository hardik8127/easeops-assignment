import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { User } from "@/types/auth";
import { profileApi } from "./profileApi";
import { useAuthStore } from "@/features/auth/authStore";
import { useThemeStore } from "@/store/themeStore";

interface Props {
  user: User;
}

export function ProfileForm({ user }: Props) {
  const { updateUser } = useAuthStore();
  const { darkMode, setDarkMode } = useThemeStore();
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await profileApi.updateMe({ name, dark_mode: darkMode });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Dark Mode</span>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            darkMode ? "bg-primary" : "bg-secondary"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              darkMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-primary-foreground font-semibold rounded-lg py-2 px-5 hover:opacity-90 transition disabled:opacity-60"
      >
        {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
