import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/lib/stats";
import { getConnectionCounts } from "@/lib/social";
import { Avatar } from "@/components/Avatar";
import { AvatarUpload } from "@/components/AvatarUpload";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { StatsSummary } from "@/components/StatsSummary";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const t = getDictionary(await getLocale());

  const [user, stats, counts] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    getUserStats(userId),
    getConnectionCounts(userId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center gap-4">
        <Avatar src={user.avatarUrl} name={user.username} size={64} />
        <div>
          <h1 className="text-2xl font-semibold">{user.displayName || user.username}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">@{user.username}</p>
        </div>
      </section>

      {user.bio && <p className="text-black/80 dark:text-white/80">{user.bio}</p>}

      <section className="flex flex-wrap gap-4 text-sm">
        <Link href={`/u/${user.username}`} className="underline">
          {t.social.viewPublicProfile}
        </Link>
        <Link href="/friends" className="underline">
          {t.social.connectionsTitle} ({counts.friends + counts.followers + counts.following})
        </Link>
        <Link href="/users" className="underline">
          {t.social.findPeople}
        </Link>
      </section>

      <section>
        <AvatarUpload
          currentUrl={user.avatarUrl}
          name={user.username}
          storageEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          t={t.profile}
        />
      </section>

      <section>
        <PrivacyToggle current={user.privacy} t={t.profile} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">{t.profile.statsHeading}</h2>
        <StatsSummary stats={stats} t={t} />
      </section>
    </div>
  );
}
