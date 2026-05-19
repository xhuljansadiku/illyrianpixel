/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async redirects() {
    return [
      // www → non-www (covers both http and https www variants)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.illyrianpixel.com" }],
        destination: "https://illyrianpixel.com/:path*",
        permanent: true
      },
      { source: "/process", destination: "/sherbimet", permanent: true },
      { source: "/services/web-ecommerce", destination: "/services/website", permanent: true },
      { source: "/services/websites", destination: "/services/website", permanent: true },
      { source: "/services/mirembajtje", destination: "/services/website", permanent: true },
      { source: "/services/marketing", destination: "/services/marketing-growth", permanent: true },
      { source: "/services/social-media", destination: "/services/marketing-growth", permanent: true },
      { source: "/services/branding", destination: "/services/branding-content", permanent: true },
      { source: "/services/photography", destination: "/services/branding-content", permanent: true },
      { source: "/services", destination: "/sherbimet", permanent: true }
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "s.wordpress.com"
      }
    ]
  }
};

export default nextConfig;
