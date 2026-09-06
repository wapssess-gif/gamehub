"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProfilePrivacy } from "@prisma/client";
import { setPrivacy } from "@/lib/actions/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function PrivacyToggle({
  current,
  t,
}: {
  current: ProfilePrivacy;
  t: Dictionary["profile"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function change(value: ProfilePrivacy) {
    if (value === current) return;
    startTransition(async () => {
      await setPrivacy(value);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">{t.privacyHeading}</h2>
      <select
        value={current}
        onChange={(e) => change(e.target.value as ProfilePrivacy)}
        disabled={isPending}
        className="w-fit rounded-md border border-black/20 bg-white text-black px-3 py-2 text-sm outline-none focus:border-red-900 focus:bg-red-50 transition-all duration-200 disabled:opacity-50 dark:border-white/30 dark:bg-black dark:text-white dark:focus:bg-red-900"
      >
        <option value="PUBLIC">{t.privacyPublic}</option>
        <option value="PRIVATE">{t.privacyPrivate}</option>
      </select>
      <p className="text-xs text-black/70 dark:text-white/50">
        {current === "PUBLIC" ? t.privacyPublicHint : t.privacyPrivateHint}
      </p>
    </div>
  );
}
