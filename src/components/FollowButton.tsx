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
          ? "rounded-md border border-white/30 px-3 py-1.5 text-sm text-white font-medium transition-all duration-200 hover:bg-red-900 hover:border-red-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-white/30"
          : "rounded-md bg-white px-3 py-1.5 text-sm text-black font-medium transition-all duration-200 hover:bg-red-900 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
      }
    >
      {following ? t.unfollow : t.follow}
    </button>
  );
}
