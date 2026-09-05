import { translate } from "google-translate-api-x";
import type { Locale } from "@/i18n/locale";

export async function translateText(text: string | null | undefined, locale: Locale): Promise<string> {
  if (!text) return "";
  if (locale === "en") return text;

  try {
    const result = await translate({
      text,
      to: locale === "ru" ? "ru" : "en",
    });
    return result.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
