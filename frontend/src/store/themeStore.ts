import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      setDarkMode: (val) => set({ darkMode: val }),
      toggle: () => set({ darkMode: !get().darkMode }),
    }),
    { name: "theme" }
  )
);
