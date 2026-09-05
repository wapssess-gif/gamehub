"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", t);
    }
  }

  function toggle() {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  }

  if (!mounted) return null;

  const icons: Record<Theme, string> = {
    light: "☀️",
    dark: "🌙",
    system: "💻",
  };

  return (
    <button
      onClick={toggle}
      type="button"
      className="rounded-md px-2 py-1.5 text-lg transition-all hover:bg-white/10 dark:hover:bg-black/40"
      title={`Theme: ${theme}`}
      aria-label="Toggle theme"
    >
      {icons[theme]}
    </button>
  );
}
