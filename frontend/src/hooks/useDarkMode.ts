import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export function useDarkMode() {
  const { darkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
