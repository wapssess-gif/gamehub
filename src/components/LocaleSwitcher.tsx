"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions/locale";
import { LOCALES, type Locale } from "@/i18n/locale";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          disabled={isPending}
          aria-current={code === locale}
          className={`rounded px-1.5 py-0.5 uppercase transition-colors ${
            code === locale
              ? "bg-foreground text-background"
              : "text-black/60 hover:text-foreground dark:text-white/60 dark:hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
