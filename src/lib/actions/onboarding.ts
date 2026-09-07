"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { unstable_update } from "@/auth";
import { requireUserId } from "@/lib/session";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export type OnboardingState = { error?: string };

/** Sets the chosen @username, marks onboarding done, refreshes the JWT, then leaves. */
export async function completeOnboarding(username: string): Promise<OnboardingState> {
  const userId = await requireUserId();
  const t = getDictionary(await getLocale()).auth.errors;

  const schema = z
    .string()
    .trim()
    .min(3, t.usernameTooShort)
    .max(24, t.usernameTooLong)
    .regex(/^[a-zA-Z0-9_]+$/, t.usernameInvalidChars);

  const parsed = schema.safeParse(username);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.invalidData };
  }
  const handle = parsed.data;

  const taken = await prisma.user.findFirst({
    where: { username: { equals: handle, mode: "insensitive" }, NOT: { id: userId } },
    select: { id: true },
  });
  if (taken) return { error: t.usernameTaken };

  await prisma.user.update({
    where: { id: userId },
    data: { username: handle, onboardedAt: new Date() },
  });

  await unstable_update({ user: {} });
  revalidatePath("/", "layout");
  redirect("/library");
}

/** For a user whose JWT still says "needs onboarding" but the DB disagrees. */
export async function refreshSession(): Promise<void> {
  await requireUserId();
  await unstable_update({ user: {} });
  redirect("/library");
}
