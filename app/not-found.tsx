import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Nordic Pixel",
  robots: { index: false, follow: true },
};

/**
 * Fallback for requests outside the localized site (e.g. a mistyped file path).
 * Rendered without the site layout, so it is self-contained and bilingual.
 */
export default function RootNotFound() {
  return (
    <html lang="sv">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f9fc",
          color: "#17212b",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ padding: 24, maxWidth: 520 }}>
          <svg viewBox="0 0 20 20" width="40" height="40" aria-hidden="true">
            <path d="M0 0H4V4H8V8H12V12H16V4H20V20H16V16H12V12H8V8H4V20H0Z" fill="#006AA7" />
            <rect x="16" y="0" width="4" height="4" fill="#FECC00" />
          </svg>
          <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: "24px 0 12px", color: "#0b1117" }}>
            Sidan kunde inte hittas.
          </h1>
          <p lang="en" style={{ margin: "0 0 28px", color: "#334155" }}>
            The page could not be found.
          </p>
          <p style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: 0 }}>
            <Link href="/sv" style={{ color: "#006aa7", fontWeight: 600 }}>
              Till startsidan
            </Link>
            <Link href="/en" lang="en" style={{ color: "#006aa7", fontWeight: 600 }}>
              Go to the home page
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
