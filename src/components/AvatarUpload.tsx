"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { updateAvatar, removeAvatar } from "@/lib/actions/profile";
import { resizeAvatar, ImageResizeError } from "@/lib/resize-image";
import type { Dictionary } from "@/i18n/dictionaries";

export function AvatarUpload({
  currentUrl,
  name,
  storageEnabled,
  t,
}: {
  currentUrl: string | null;
  name: string;
  storageEnabled: boolean;
  t: Dictionary["profile"];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const shownUrl = previewUrl ?? currentUrl;
  const hasAvatar = Boolean(currentUrl);

  function resolveResizeError(err: unknown): string {
    if (err instanceof ImageResizeError) {
      if (err.message === "unsupported-type") return t.errors.avatarBadType;
      if (err.message === "source-too-large") return t.errors.avatarTooLarge;
    }
    return t.errors.avatarUploadFailed;
  }

  async function handleFile(file: File) {
    setError(null);
    setSaved(false);

    let resized: Blob;
    try {
      resized = await resizeAvatar(file);
    } catch (err) {
      setError(resolveResizeError(err));
      return;
    }

    const localPreview = URL.createObjectURL(resized);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return localPreview;
    });

    const formData = new FormData();
    formData.append("avatar", resized, "avatar.webp");

    startTransition(async () => {
      const result = await updateAvatar(formData);
      if (result.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(result.error);
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return null;
        });
      }
    });
  }

  function handleRemove() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await removeAvatar();
      if (result.ok) {
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return null;
        });
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{t.avatarHeading}</h2>

      <div className="flex items-center gap-4">
        <Avatar src={shownUrl} name={name} size={72} />

        <div className="flex flex-col gap-2">
          {storageEnabled ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isPending}
                  className="rounded-md border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/5"
                >
                  {isPending
                    ? t.avatarProcessing
                    : hasAvatar
                      ? t.avatarChange
                      : t.avatarUpload}
                </button>

                {hasAvatar && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    className="text-sm text-red-500 hover:underline disabled:opacity-50"
                  >
                    {t.avatarRemove}
                  </button>
                )}
              </div>

              <p className="text-xs text-black/50 dark:text-white/50">{t.avatarHint}</p>
            </>
          ) : (
            <p className="text-xs text-black/50 dark:text-white/50">
              {t.errors.avatarStorageDisabled}
            </p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && !isPending && (
            <p className="text-xs font-medium text-green-600">✓ {t.avatarSaved}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
