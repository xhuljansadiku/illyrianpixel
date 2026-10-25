import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

// Vetëm "latin" (2026-10-25): ë, ç, €, vizat dhe thonjëzat janë të gjitha aty; "latin-ext" dyfishonte
// skedarët e fonteve që ngarkohen në fillim pa asnjë shkronjë të përdorur në faqe (kontrolluar me skript).
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  display: "swap",
});

// Klasat e <body> — të përbashkëta për RootDocument dhe app/error.tsx
export const bodyClassName = `${plusJakarta.variable} ${display.variable} bg-bg font-body text-text antialiased`;
