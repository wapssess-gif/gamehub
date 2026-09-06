export const PUBLIC_ID_LENGTH = 10;

/** The stored integer id shown as a fixed-width, zero-padded string. */
export function formatPublicId(publicId: number): string {
  return String(publicId).padStart(PUBLIC_ID_LENGTH, "0");
}

/** Parses a user-typed public id ("42" or "0000000042") to its integer, or null. */
export function parsePublicId(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Locale-aware "5 minutes ago" / "5 минут назад" from an ISO timestamp. */
export function relativeTime(iso: string, locale: string): string {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const abs = Math.abs(diffSec);

  if (abs < 60) return rtf.format(diffSec, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
}
