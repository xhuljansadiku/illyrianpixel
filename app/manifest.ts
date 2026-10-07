import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nordic Pixel",
    short_name: "Nordic Pixel",
    description: "Scandinavian full-service digital agency — websites, e-commerce, SEO, branding and digital marketing.",
    start_url: "/sv",
    display: "browser",
    background_color: "#F7F9FC",
    theme_color: "#006AA7",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
