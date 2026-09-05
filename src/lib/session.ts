import { auth } from "@/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

/** Returns the current user's id, or throws a localized error if unauthenticated. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    const t = getDictionary(await getLocale()).auth.errors;
    throw new Error(t.notAuthorized);
  }
  return session.user.id;
}
