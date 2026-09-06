"use client";

import { useEffect } from "react";

export function ThemeLoader() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return null;
}
