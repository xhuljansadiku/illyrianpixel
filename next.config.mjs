import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compress: true,

  experimental: {
    optimizePackageImports: ["gsap", "lenis"],
    optimizeCss: true,
    browsersListForSwc: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s.wordpress.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "flagcdn.com" }
    ]
  },

  async headers() {
    return [
      // Immutable cache for hashed Next.js static assets
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      // Long cache for public images/fonts
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      // Security headers for all routes
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy",   value: [
              "default-src 'self'",
              // 'unsafe-eval' duhet: Next.js 14 (webpack) mbështjell modulet client-side
              // në eval() në runtime-in e tij të brendshëm — edhe në build prodhimi, jo vetëm dev.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://images.unsplash.com https://flagcdn.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join("; ")
          }
        ]
      }
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.illyrianpixel.com" }],
        destination: "https://illyrianpixel.com/:path*",
        permanent: true
      },
      { source: "/process",                    destination: "/sherbimet",               permanent: true },
      { source: "/services/web-ecommerce",     destination: "/services/website",        permanent: true },
      { source: "/services/websites",          destination: "/services/website",        permanent: true },
      { source: "/services/mirembajtje",       destination: "/services/website",        permanent: true },
      { source: "/services/marketing",         destination: "/services/seo-google-ads", permanent: true },
      { source: "/services/social-media",      destination: "/services/seo-google-ads", permanent: true },
      { source: "/services/marketing-growth",  destination: "/services/seo-google-ads", permanent: true },
      { source: "/services/branding",          destination: "/services/branding-content", permanent: true },
      { source: "/services/photography",       destination: "/services/branding-content", permanent: true },
      { source: "/services",                   destination: "/sherbimet",               permanent: true }
    ];
  }
};

export default withNextIntl(nextConfig);
