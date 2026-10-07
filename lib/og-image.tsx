import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/components/brand/Logo";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/i18n/routing";

export const OG_SIZE = { width: 1200, height: 630 };

const TAGLINES: Record<Locale, string> = {
  sv: "Webbplatser · E-handel · SEO · Branding · Digital marknadsföring",
  en: "Websites · E-commerce · SEO · Branding · Digital marketing",
};

/** Branded 1200 × 630 share image: deep Nordic blue, the pixel mark, white type. */
export async function renderOgImage(locale: Locale) {
  const dict = getDictionary(locale);
  const [bold, medium] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Manrope-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Manrope-Medium.ttf")),
  ]);

  const pixels = [
    { x: 0, y: 0, color: "#006AA7" },
    { x: 1, y: 1, color: "#006AA7" },
    { x: 2, y: 0, color: "rgba(255,255,255,0.12)" },
    { x: 2, y: 2, color: "#FECC00" },
    { x: 0, y: 2, color: "rgba(255,255,255,0.12)" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(150deg, #003366 0%, #001F3F 58%)",
          color: "#FFFFFF",
          fontFamily: "Manrope",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 80, top: 72, display: "flex", width: 132, height: 132 }}>
          {pixels.map((pixel) => (
            <div
              key={`${pixel.x}-${pixel.y}`}
              style={{
                position: "absolute",
                left: pixel.x * 44,
                top: pixel.y * 44,
                width: 40,
                height: 40,
                background: pixel.color,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 20 20" width="56" height="56">
            <path d={MARK_PATH} fill="#FFFFFF" />
            <rect x="16" y="0" width="4" height="4" fill="#FECC00" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em" }}>Nordic Pixel</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 940,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
            }}
          >
            {dict.home.hero.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.78)" }}>
            <div style={{ width: 12, height: 12, background: "#FECC00" }} />
            {TAGLINES[locale]}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Manrope", data: bold, weight: 700, style: "normal" },
        { name: "Manrope", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
