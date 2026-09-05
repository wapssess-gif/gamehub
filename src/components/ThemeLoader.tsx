"use client";

import { useEffect } from "react";

export function ThemeLoader() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  return null;
}
