import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * The root layout only provides shared metadata. <html> and <body> are rendered
 * by app/[locale]/layout.tsx (so each language gets the right `lang`) and by
 * app/not-found.tsx for requests outside a locale.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Nordic Pixel",
  title: { default: "Nordic Pixel", template: "%s | Nordic Pixel" },
  creator: "Nordic Pixel",
  publisher: "Nordic Pixel",
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
