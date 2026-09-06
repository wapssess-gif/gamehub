import type { ReactNode } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { formatPublicId } from "@/lib/format";

/** Row with a user's avatar / name linking to their profile, plus an optional action slot. */
export function UserCard({
  user,
  children,
}: {
  user: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    publicId?: number;
  };
  children?: ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
      <Link
        href={`/u/${user.username}`}
        className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-85"
      >
        <Avatar src={user.avatarUrl} name={user.username} size={40} />
        <div className="min-w-0">
          <p className="truncate font-medium">{user.displayName || user.username}</p>
          <p className="truncate text-xs text-black/60 dark:text-white/60">
            @{user.username}
            {user.publicId != null && (
              <span className="text-black/40 dark:text-white/40"> · ID {formatPublicId(user.publicId)}</span>
            )}
          </p>
        </div>
      </Link>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </li>
  );
}
