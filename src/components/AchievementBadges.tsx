import type { AchievementState } from "@/lib/achievements";
import type { Dictionary } from "@/i18n/dictionaries";

export function AchievementBadges({
  achievements,
  showLocked,
  locale,
  t,
}: {
  achievements: AchievementState[];
  showLocked: boolean;
  locale: string;
  t: Dictionary["achievements"];
}) {
  const visible = showLocked ? achievements : achievements.filter((a) => a.unlocked);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section>
      <h2 className="mb-3 text-lg font-medium">
        {t.heading}{" "}
        <span className="text-sm font-normal text-black/50 dark:text-white/50">
          {unlockedCount}/{achievements.length}
        </span>
      </h2>

      {visible.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">{t.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {visible.map((a) => {
            const meta = t.items[a.id];
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3 rounded-md border p-3 ${
                  a.unlocked
                    ? "border-black/10 dark:border-white/10"
                    : "border-dashed border-black/15 opacity-55 dark:border-white/15"
                }`}
              >
                <span className="shrink-0 text-2xl" aria-hidden>
                  {a.unlocked ? "🏆" : "🔒"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{meta.name}</p>
                  <p className="text-xs text-black/60 dark:text-white/60">{meta.description}</p>
                  {a.unlocked && a.unlockedAt && (
                    <p className="mt-0.5 text-xs text-black/45 dark:text-white/45">
                      {t.unlockedOn} {new Date(a.unlockedAt).toLocaleDateString(locale)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
