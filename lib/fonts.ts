import { Inter, Manrope } from "next/font/google";

// Self-hosted at build time by next/font: no requests to Google from the
// visitor's browser (GDPR-friendly), preloaded and with metric-matched fallbacks.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${manrope.variable}`;
