import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  display: "swap",
});

// Klasat e <body> — të përbashkëta për RootDocument dhe app/error.tsx
export const bodyClassName = `${plusJakarta.variable} ${display.variable} bg-bg font-body text-text antialiased`;
