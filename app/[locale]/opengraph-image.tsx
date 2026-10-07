import { isLocale, routing } from "@/i18n/routing";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { localeParams } from "@/lib/page";

export const alt = "Nordic Pixel";
export const size = OG_SIZE;
export const contentType = "image/png";

// Rendered once per locale at build time.
export function generateStaticParams() {
  return localeParams();
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage(isLocale(locale) ? locale : routing.defaultLocale);
}
