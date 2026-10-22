import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";

// Faqe private (2026-10-22): pa indeksim, dhe pa canonical/hreflang të trashëguar nga kreu —
// më parë /admin/login ishte "index, follow" me canonical te faqja kryesore.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: {},
};

// <html>/<body> për faqet jashtë [locale] — shih komentin te app/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="sq">{children}</RootDocument>;
}
