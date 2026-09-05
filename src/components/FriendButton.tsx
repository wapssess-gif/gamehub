"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  sendFriendRequest,
  respondToFriendRequest,
  removeFriendship,
} from "@/lib/actions/social";
import type { FriendshipView } from "@/lib/social";
import type { Dictionary } from "@/i18n/dictionaries";

const BASE = "rounded-md px-3 py-1.5 text-sm disabled:opacity-50";
const PRIMARY = `${BASE} bg-foreground text-background hover:opacity-90`;
const SECONDARY = `${BASE} border border-black/20 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5`;

export function FriendButton({
  targetUserId,
  friendship,
  t,
}: {
  targetUserId: string;
  friendship: FriendshipView | null;
  t: Dictionary["social"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
      } catch {
        // stale state — resync
      }
      router.refresh();
    });
  }

  // No relationship, or a previously declined one: offer to (re)send a request.
  if (!friendship || friendship.status === "DECLINED") {
    return (
      <button
        type="button"
        disabled={isPending}
        className={PRIMARY}
        onClick={() => run(() => sendFriendRequest(targetUserId))}
      >
        {t.addFriend}
      </button>
    );
  }

  if (friendship.status === "PENDING") {
    if (friendship.iAmRequester) {
      return (
        <span className="flex items-center gap-2 text-sm">
          <span className="text-black/60 dark:text-white/60">{t.requestSent}</span>
          <button
            type="button"
            disabled={isPending}
            className={SECONDARY}
            onClick={() => run(() => removeFriendship(friendship.id))}
          >
            {t.cancelRequest}
          </button>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          className={PRIMARY}
          onClick={() => run(() => respondToFriendRequest(friendship.id, true))}
        >
          {t.acceptRequest}
        </button>
        <button
          type="button"
          disabled={isPending}
          className={SECONDARY}
          onClick={() => run(() => respondToFriendRequest(friendship.id, false))}
        >
          {t.declineRequest}
        </button>
      </span>
    );
  }

  // ACCEPTED
  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="font-medium text-green-600">{t.youAreFriends}</span>
      <button
        type="button"
        disabled={isPending}
        className={SECONDARY}
        onClick={() => run(() => removeFriendship(friendship.id))}
      >
        {t.removeFriend}
      </button>
    </span>
  );
}
