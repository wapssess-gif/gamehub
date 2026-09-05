"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { followUser, unfollowUser } from "@/lib/actions/social";
import type { Dictionary } from "@/i18n/dictionaries";

export function FollowButton({
  targetUserId,
  following,
  t,
}: {
  targetUserId: string;
  following: boolean;
  t: Dictionary["social"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        if (following) await unfollowUser(targetUserId);
        else await followUser(targetUserId);
      } catch {
        // likely stale UI state — router.refresh() below resyncs
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={
        following
          ? "rounded-md border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/5"
          : "rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 disabled:opacity-50"
      }
    >
      {following ? t.unfollow : t.follow}
    </button>
  );
}
