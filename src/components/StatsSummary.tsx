import type { UserStats } from "@/lib/stats";
import { STATUS_LABELS } from "@/lib/labels";

export function StatsSummary({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-md border border-black/10 p-4 sm:grid-cols-4 dark:border-white/10">
      <Stat label="Всего игр" value={stats.totalGames} />
      <Stat label="Часов сыграно" value={stats.totalHours.toFixed(1)} />
      <Stat label="Средняя оценка" value={stats.averageRating ? stats.averageRating.toFixed(1) : "—"} />
      <Stat
        label="Любимый жанр"
        value={stats.topGenres[0]?.genre ?? "—"}
      />

      <div className="col-span-2 sm:col-span-4">
        <p className="mb-1 text-xs uppercase text-black/50 dark:text-white/50">По статусам</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <span
              key={status}
              className="rounded-full border border-black/10 px-2 py-0.5 dark:border-white/10"
            >
              {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}: {count}
            </span>
          ))}
          {stats.totalGames === 0 && <span className="text-black/50 dark:text-white/50">Библиотека пуста</span>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs uppercase text-black/50 dark:text-white/50">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
