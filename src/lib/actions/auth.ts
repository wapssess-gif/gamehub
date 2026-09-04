"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  username: z
    .string()
    .trim()
    .min(3, "Ник — минимум 3 символа")
    .max(24, "Ник — максимум 24 символа")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и подчёркивание"),
  password: z.string().min(8, "Пароль — минимум 8 символов"),
});

export type FormState = { error?: string };

export async function registerUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Некорректные данные" };
  }
  const { email, username, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return { error: "Пользователь с таким email или ником уже существует" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, username, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/library" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Аккаунт создан, но вход не удался — попробуйте войти вручную" };
    }
    throw error;
  }
  return {};
}

export async function loginUser(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/library",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Неверный email или пароль" };
    }
    throw error;
  }
  return {};
}
