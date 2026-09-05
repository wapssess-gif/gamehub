import { translate } from "google-translate-api-x";
import type { Locale } from "@/i18n/locale";

export async function translateText(text: string | null | undefined, locale: Locale): Promise<string> {
  if (!text) return "";
  if (locale === "en") return text;

  try {
    const result = await translate({
      text,
      to: locale === "ru" ? "ru" : "en",
    }) as any;

    console.log("Translation result for:", { text: text.slice(0, 50), locale, result });

    // Try multiple possible response formats
    if (typeof result === 'string') return result;
    if (result?.text && typeof result.text === 'string') return result.text;
    if (result?.data?.translations?.[0]?.translatedText) return result.data.translations[0].translatedText;

    // Handle array response
    if (Array.isArray(result) && result.length > 0) {
      if (typeof result[0] === 'string') return result[0];
      if (result[0]?.translatedText) return result[0].translatedText;
    }

    // Fallback: try to find any string in the result object
    if (typeof result === 'object' && result !== null) {
      for (const key of Object.keys(result)) {
        if (typeof result[key] === 'string' && result[key].length > 0) {
          return result[key];
        }
      }
    }

    console.warn("Could not extract translation from result:", result);
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
