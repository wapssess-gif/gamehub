"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export type FormState = { error?: string };

export async function registerUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const t = getDictionary(await getLocale()).auth.errors;

  const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email(t.invalidEmail),
    username: z
      .string()
      .trim()
      .min(3, t.usernameTooShort)
      .max(24, t.usernameTooLong)
      .regex(/^[a-zA-Z0-9_]+$/, t.usernameInvalidChars),
    password: z.string().min(8, t.passwordTooShort),
  });

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.invalidData };
  }
  const { email, username, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return { error: t.accountExists };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, username, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/library" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t.registeredButLoginFailed };
    }
    throw error;
  }
  return {};
}

export async function loginUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const t = getDictionary(await getLocale()).auth.errors;

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/library",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t.invalidCredentials };
    }
    throw error;
  }
  return {};
}
