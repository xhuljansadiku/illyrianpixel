import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export const revalidate = 300;

// Cilësimet publike të popup-it exit-intent (pa të dhëna sensitive).
// ?locale=en kthen variantin anglisht të teksteve.
export async function GET(req: Request) {
  const settings = await getSiteSettings();
  const en = new URL(req.url).searchParams.get("locale") === "en";
  return NextResponse.json(
    {
      enabled: settings.popup_enabled === "1",
      eyebrow: en ? settings.popup_eyebrow_en : settings.popup_eyebrow,
      title: en ? settings.popup_title_en : settings.popup_title,
      text: en ? settings.popup_text_en : settings.popup_text,
      cta: en ? settings.popup_cta_en : settings.popup_cta,
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
