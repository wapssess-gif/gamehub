import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "@/components/OnboardingForm";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

/** A friendly starting suggestion derived from the email local part. */
function suggestUsername(email: string): string {
  const base = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") ?? "";
  const trimmed = base.slice(0, 20);
  return trimmed.length >= 3 ? trimmed : "";
}

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const t = getDictionary(await getLocale()).onboarding;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, username: true, onboardedAt: true },
  });

  const alreadyDone = Boolean(user.onboardedAt);
  // If the placeholder handle looks generated ("u" + 8 chars), don't pre-fill it.
  const currentIsPlaceholder = /^u[a-z0-9]{8}$/.test(user.username);
  const initial = alreadyDone
    ? user.username
    : currentIsPlaceholder
      ? suggestUsername(user.email)
      : user.username;

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-2 text-2xl font-semibold">{t.title}</h1>
      <p className="mb-6 text-sm text-black/60 dark:text-white/60">{t.subtitle}</p>
      <OnboardingForm initialUsername={initial} alreadyDone={alreadyDone} t={t} />
    </div>
  );
}
