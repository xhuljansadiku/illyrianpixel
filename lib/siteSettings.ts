import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const SITE_SETTINGS_DEFAULTS = {
  newsletter_discount_code: "ILLYRIAN10",
  whatsapp_number: "355694726827",
  popup_enabled: "1",
  popup_eyebrow: "Para se të largoheni",
  popup_title: "Merrni një konsultë falas sot.",
  popup_text: "Tregoni për projektin tuaj dhe marrim një plan konkret pa kosto, pa detyrime.",
  popup_cta: "Konsultë falas →",
  popup_eyebrow_en: "Before you go",
  popup_title_en: "Get a free consultation today.",
  popup_text_en: "Tell us about your project and we'll put together a concrete plan at no cost, no obligation.",
  popup_cta_en: "Free consultation →",
};

export type SiteSettingsKey = keyof typeof SITE_SETTINGS_DEFAULTS;

export async function getSiteSettings(): Promise<Record<SiteSettingsKey, string>> {
  const { data } = await supabase.from("site_settings").select("key, value");
  const result = { ...SITE_SETTINGS_DEFAULTS };
  for (const row of data ?? []) {
    if (row.key in result) {
      (result as Record<string, string>)[row.key] = row.value;
    }
  }
  return result;
}
