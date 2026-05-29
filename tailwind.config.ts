import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  // Safelist classes used dynamically (string interpolation, JS-generated)
  safelist: [
    "sr-only",
    "not-sr-only",
    "focus:not-sr-only",
    { pattern: /^(opacity|translate|scale|rotate)-/ },
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        text: "#E0E0E0",
        /** Secondary labels, captions, de-emphasized UI */
        muted: "#A0A0A0",
        accent: "#ab8339",
        accentLight: "#eace71"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(171, 131, 57, 0.2), 0 12px 48px rgba(171, 131, 57, 0.12)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        /** Serif — editorial, pricing, elite / trust */
        display: ["var(--font-display)", "Georgia", "serif"],
        /** Sans — services, lists, UI (same variable as body) */
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        ui: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    }
  },
  plugins: []
};

export default config;
