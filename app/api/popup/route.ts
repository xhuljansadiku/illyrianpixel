import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export const revalidate = 300;

// Cilësimet publike të popup-it exit-intent (pa të dhëna sensitive).
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(
    {
      enabled: settings.popup_enabled === "1",
      eyebrow: settings.popup_eyebrow,
      title: settings.popup_title,
      text: settings.popup_text,
      cta: settings.popup_cta,
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
