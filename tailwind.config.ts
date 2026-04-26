import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0b",
        text: "#f5f5f0",
        accent: "#C89B2E",
        muted: "rgba(245,245,240,0.65)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,155,46,0.2), 0 12px 48px rgba(200,155,46,0.12)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      }
    }
  },
  plugins: []
};

export default config;
