"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { completeOnboarding, refreshSession } from "@/lib/actions/onboarding";
import type { Dictionary } from "@/i18n/dictionaries";

export function OnboardingForm({
  initialUsername,
  alreadyDone,
  t,
}: {
  initialUsername: string;
  alreadyDone: boolean;
  t: Dictionary["onboarding"];
}) {
  const [value, setValue] = useState(initialUsername);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const ran = useRef(false);

  // Stale token (onboarded elsewhere) — refresh it once and move on.
  useEffect(() => {
    if (alreadyDone && !ran.current) {
      ran.current = true;
      startTransition(() => refreshSession());
    }
  }, [alreadyDone]);

  if (alreadyDone) {
    return <p className="text-sm text-black/60 dark:text-white/60">{t.allSet}</p>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await completeOnboarding(value);
      // success path redirects inside the action; only errors return here
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        {t.usernameLabel}
        <div className="flex items-center rounded-md border border-black/20 focus-within:border-foreground dark:border-white/20">
          <span className="pl-3 text-black/40 dark:text-white/40">@</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={24}
            autoFocus
            className="flex-1 bg-transparent px-2 py-2 outline-none"
          />
        </div>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending || value.trim().length < 3}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
      >
        {isPending ? t.saving : t.submit}
      </button>
    </form>
  );
}
