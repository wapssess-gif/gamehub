"use client";

import { useState, useTransition } from "react";
import { updateDisplayNameBio } from "@/lib/actions/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function DisplayNameBioEdit({
  initialDisplayName,
  initialBio,
  t,
}: {
  initialDisplayName: string | null;
  initialBio: string | null;
  t: Dictionary["profile"];
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateDisplayNameBio(displayName, bio);
      setIsEditing(false);
    });
  };

  if (!isEditing) {
    return (
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white/60">
            {t.displayNameHeading}
          </h2>
          <p className="text-lg text-white">{displayName || "—"}</p>
        </div>
        {bio && (
          <div>
            <h2 className="text-sm font-semibold text-white/60">
              {t.bioHeading}
            </h2>
            <p className="text-sm text-white whitespace-pre-line">
              {bio}
            </p>
          </div>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="mt-2 w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-60"
        >
          Edit Profile
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div>
        <label className="block text-sm font-medium">{t.displayNameLabel}</label>
        <p className="mb-2 text-xs text-white/60">
          {t.displayNameHint}
        </p>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value.slice(0, 50))}
          maxLength={50}
          className="w-full rounded-md border border-white/10 bg-white/5 text-white px-3 py-2 text-sm"
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-white/50">
          {displayName.length}/50
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">{t.bioLabel}</label>
        <p className="mb-2 text-xs text-white/60">
          {t.bioHint}
        </p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 300))}
          maxLength={300}
          placeholder={t.bioPlaceholder}
          className="w-full rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/40 px-3 py-2 text-sm"
          rows={4}
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-white/50">
          {bio.length}/300
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-md bg-white text-black px-4 py-2 text-sm font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-60"
        >
          {isPending ? t.saving : t.save}
        </button>
        <button
          onClick={() => {
            setDisplayName(initialDisplayName || "");
            setBio(initialBio || "");
            setIsEditing(false);
          }}
          disabled={isPending}
          className="rounded-md border border-white/20 text-white px-4 py-2 text-sm font-medium transition-all hover:bg-white/10 active:bg-white/20 disabled:opacity-60"
        >
          {t.cancel}
        </button>
      </div>
    </section>
  );
}
