import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/lib/stats";
import { StatsSummary } from "@/components/StatsSummary";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const [user, stats] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    getUserStats(userId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/10 text-xl font-semibold dark:bg-white/10">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.displayName || user.username}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">@{user.username}</p>
        </div>
      </section>

      {user.bio && <p className="text-black/80 dark:text-white/80">{user.bio}</p>}

      <section>
        <h2 className="mb-2 text-lg font-medium">Статистика</h2>
        <StatsSummary stats={stats} />
      </section>
    </div>
  );
}
