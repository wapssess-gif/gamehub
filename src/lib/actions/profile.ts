"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import type { ProfilePrivacy } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export type AvatarActionResult =
  | { ok: true; url: string | null }
  | { ok: false; error: string };

const MAX_UPLOAD_BYTES = 1024 * 1024; // 1 MB — inputs are resized client-side well below this
const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

/** True when the bytes start with a JPEG / PNG / WebP file signature. */
function looksLikeImage(bytes: Uint8Array): boolean {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return true;
  }
  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return true;
  }
  return false;
}

async function deleteOldAvatar(url: string | null | undefined) {
  if (!url || !url.includes(BLOB_HOST_SUFFIX)) return;
  try {
    await del(url);
  } catch {
    // best effort — a dangling blob is harmless
  }
}

function revalidateProfile() {
  revalidatePath("/profile");
  revalidatePath("/", "layout"); // navbar avatar
}

export async function updateAvatar(formData: FormData): Promise<AvatarActionResult> {
  const userId = await requireUserId();
  const t = getDictionary(await getLocale()).profile.errors;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: t.avatarStorageDisabled };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: t.avatarMissing };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: t.avatarTooLarge };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeImage(bytes)) {
    return { ok: false, error: t.avatarBadType };
  }

  let url: string;
  try {
    const blob = await put(`avatars/${userId}.webp`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: "image/webp",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    url = blob.url;
  } catch {
    return { ok: false, error: t.avatarUploadFailed };
  }

  const previous = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });

  await prisma.user.update({ where: { id: userId }, data: { avatarUrl: url } });
  await deleteOldAvatar(previous?.avatarUrl);

  revalidateProfile();
  return { ok: true, url };
}

export async function setPrivacy(privacy: ProfilePrivacy) {
  const userId = await requireUserId();
  await prisma.user.update({ where: { id: userId }, data: { privacy } });
  revalidatePath("/profile");
  revalidatePath("/u/[username]", "page");
}

export async function removeAvatar(): Promise<AvatarActionResult> {
  const userId = await requireUserId();

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });

  await prisma.user.update({ where: { id: userId }, data: { avatarUrl: null } });
  await deleteOldAvatar(current?.avatarUrl);

  revalidateProfile();
  return { ok: true, url: null };
}

export async function updateDisplayNameBio(
  displayName: string,
  bio: string
): Promise<void> {
  const userId = await requireUserId();

  const trimmedDisplayName = displayName.trim().slice(0, 50);
  const trimmedBio = bio.trim().slice(0, 300);

  await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: trimmedDisplayName || null,
      bio: trimmedBio || null,
    },
  });

  revalidateProfile();
}
