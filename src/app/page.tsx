import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">GameHub</h1>
      <p className="max-w-xl text-balance text-black/70 dark:text-white/70">
        Единая платформа для геймеров: библиотека игр, отслеживание прогресса,
        статистика и открытие новых игр.
      </p>

      <div className="flex gap-3">
        {session?.user ? (
          <Link
            href="/library"
            className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
          >
            Моя библиотека
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
            >
              Начать
            </Link>
            <Link
              href="/games"
              className="rounded-md border border-black/20 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Смотреть каталог
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
