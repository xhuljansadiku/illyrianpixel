import { activeWebHeroVariant } from "@/lib/webHeroVariants.en";
import type { ServiceCategory } from "./serviceCategories.sq";

export const serviceCategories: ServiceCategory[] = [
  // ─── 1. WEBSITE ────────────────────────────────────────────────────────────
  {
    slug: "website",
    title: "Website",
    ...activeWebHeroVariant,
    subServices: [
      "A website that generates real inquiries",
      "SEO that brings you clients",
      "Speed that increases conversion",
      "Design that builds trust",
      "Simple to manage",
    ],
    short:
      "Modern websites for businesses that want more clients,\nnot just an online presence.",
    icon: "◈",
    packages: [
      {
        name: "Basic",
        price: "€349",
        ideal: "A clean, serious business page.\nClients find you, they contact you.",
        features: [
          "Professional, clean design",
          "Up to 5 pages",
          "Contact form",
          "Basic SEO",
          "Mobile-first & fast",
        ],
      },
      {
        name: "Business",
        price: "€599",
        ideal: "The right structure, the right message.\nClients arrive and take the next step.",
        features: [
          "Everything in Basic",
          "Up to 8 pages",
          "Structure optimized for conversion",
          "Google Analytics",
          "1–2 languages",
          "Mobile & speed optimization",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€899",
        ideal: "Custom design, advanced SEO and a conversion funnel from visitor to client.",
        features: [
          "Everything in Business",
          "100% custom design",
          "Advanced SEO (on-page)",
          "Integrations (WhatsApp, booking, etc.)",
          "Funnels & strategic CTAs",
        ],
      },
      {
        name: "Custom",
        price: "From €1,200",
        ideal: "E-Commerce, special features or integrations?\nWe build it from scratch for your needs.",
        features: [
          "Everything in Premium",
          "E-Commerce or special features",
          "Advanced integrations",
          "Custom CMS",
          "Dedicated support",
        ],
        cta: "Request a quote",
      },
    ],
  },

  // ─── 2. E-COMMERCE ─────────────────────────────────────────────────────────
  {
    slug: "ecommerce",
    title: "E-Commerce",
    headline: "An online store\n(e-commerce) that sells 24/7,\nevery day, without a break.",
    subheadline:
      "We build online stores that convert, with optimized checkout and integrated payments for more sales.",
    short:
      "Premium online stores with optimized checkout, payments and analytics,\nfor Albanian businesses that want to sell online.",
    description: "",
    icon: "◈",
    ctaPrimary: "Start selling online →",
    ctaSecondary: "Our work",
    trustLine: "Free consultation · Strategy within 24h · No obligation",
    subServices: [
      "24/7 sales",
      "Checkout that converts",
      "Simple payments",
      "Non-stop selling",
      "Sales analytics",
    ],
    packages: [
      {
        name: "Starter",
        price: "€699",
        tagline: "A store that starts selling right away",
        ideal: "The right first step online.\nProducts, payments and checkout ready to sell.",
        features: [
          "Up to 30 products",
          "Integrated payments",
          "Optimized checkout",
          "Mobile-first & fast",
          "Order form + automatic confirmation",
        ],
      },
      {
        name: "Growth",
        price: "€1,199",
        tagline: "A store that grows sales every month",
        ideal: "The right structure to turn visitors into buyers and buyers into regular clients.",
        features: [
          "Up to 100 products",
          "Filters, categories and advanced search",
          "Checkout optimized for conversion",
          "Sales analytics and Google Analytics",
          "Basic SEO for products and categories",
        ],
        featured: true,
      },
      {
        name: "Advanced",
        price: "€1,999",
        tagline: "An e-commerce platform built to scale",
        ideal: "A complete system for businesses that want to dominate online, without limits, without compromise.",
        features: [
          "No product limit",
          "Upsells & recommendations that increase sales",
          "Automatic emails, order confirmation & abandoned cart recovery",
          "Advanced SEO for products and categories",
          "Fast page optimized for Google",
        ],
      },
    ],
  },

  // ─── 3. SEO & GOOGLE ADS ─────────────────────────────────────────────────
  {
    slug: "seo-google-ads",
    title: "SEO & Google Ads",
    headline: "SEO and Google Ads that bring clients, not just clicks.",
    subheadline:
      "Technical SEO and Google Ads campaigns, built as a conversion system for Albanian businesses.",
    short:
      "More calls, messages and sales, not more waiting.\nSEO + Google Ads + pages that convert, measured in money.",
    description: "",
    icon: "◉",
    subServices: [
      "Clients, not traffic",
      "SEO that ranks",
      "Google Ads with ROI",
      "Measurable results",
      "Strategy, not experiments",
    ],
    packages: [
      {
        name: "Starter",
        price: "€149",
        priceNote: "/ month",
        ideal: "Start with Google Ads today, plus SEO basics.\nSmall budget, first results within the month.",
        features: [
          "Google Ads setup",
          "1 active campaign",
          "Basic SEO (on-page)",
          "Results tracking",
          "Monthly report",
        ],
        cta: "Start Now",
      },
      {
        name: "Growth",
        price: "€249",
        priceNote: "/ month",
        ideal: "Google Ads optimized every week, SEO gets you ranked on Google.\nNew clients every month, budget under control.",
        features: [
          "Advanced Google Ads",
          "2–3 active campaigns",
          "Full SEO (on-page)",
          "Weekly budget optimization",
          "Report every 2 weeks + 1 monthly meeting",
        ],
        featured: true,
        cta: "Start Now",
      },
      {
        name: "Pro",
        price: "€399",
        priceNote: "/ month",
        ideal: "Full Google Ads, technical SEO and A/B testing.\nEvery decision backed by numbers, not guesswork.",
        features: [
          "Full Google Ads (Search + Display)",
          "Advanced technical SEO",
          "A/B testing for campaigns",
          "Cost-per-client optimization (CPA/ROAS)",
          "Weekly report + 2 meetings per month",
        ],
        cta: "Start Now",
      },
    ],
  },

  // ─── 4. SOCIAL MEDIA MARKETING ─────────────────────────────────────────────
  {
    slug: "smm",
    title: "Social Media",
    headline: "Professional social media management for Albanian businesses.",
    subheadline:
      "Content, design and regular posting on Instagram, Facebook and TikTok, for businesses that want to grow online.",
    short:
      "Complete social media management: content, design, posting and engagement, for Albanian businesses that want a consistent, professional presence.",
    description: "",
    icon: "◉",
    ctaPrimary: "Start today →",
    ctaSecondary: "Our work",
    trustLine: "Free consultation · No obligation · Plan within 24h",
    subServices: [
      "Instagram & Facebook",
      "Reels & TikTok",
      "Content & Design",
      "Regular posting",
      "Measurable growth",
    ],
    packages: [
      {
        name: "Starter",
        price: "€200",
        priceNote: "/ month",
        tagline: "A consistent, professional presence",
        ideal: "10 posts + 2 Reels every month.\nEverything ready: design, captions, posting.",
        features: [
          "10 posts/month (feed + caption)",
          "2 Reels/month",
          "2 platforms (Instagram + Facebook)",
          "Graphic design matching your identity",
          "Strategic hashtags",
          "Monthly performance report",
        ],
      },
      {
        name: "Growth",
        price: "€330",
        priceNote: "/ month",
        tagline: "Content that grows your audience every month",
        ideal: "15 posts + 3 Reels on 3 platforms.\nActive engagement and bi-weekly reporting.",
        features: [
          "15 posts/month (feed + caption)",
          "3 Reels/month",
          "3 platforms\n(Instagram + Facebook + Threads)",
          "Strategic hashtags",
          "Detailed bi-weekly report",
        ],
        featured: true,
      },
      {
        name: "Pro",
        price: "€400",
        priceNote: "/ month",
        tagline: "Maximum presence on every platform",
        ideal: "20 posts + 5 Reels across all platforms.\nFull strategy, execution and weekly reporting.",
        features: [
          "20 posts/month + daily Stories",
          "5 Reels / Videos",
          "All platforms",
          "Basic ads management (Meta Ads)",
          "Strategic hashtags",
          "Monthly strategy call + weekly report",
        ],
      },
    ],
  },

  // ─── 5. BRANDING & CONTENT ─────────────────────────────────────────────────
  {
    slug: "branding-content",
    title: "Branding & Content",
    headline: "Professional branding and visual identity for Albanian businesses.",
    subheadline:
      "Logo, visual identity and content that build trust and attract the right clients.",
    short:
      "Positioning, identity and content for brands that want status, trust and better-fit clients, not just more visibility.",
    description: "",
    icon: "◆",
    ctaPrimary: "Start today →",
    ctaSecondary: "Our work",
    trustLine: "Free consultation · No obligation · Reply within 24h",
    subServices: [
      "Logo & Visual identity",
      "A clear brand",
      "Premium design",
      "Professional content",
      "Instant trust",
    ],
    packages: [
      {
        name: "Basic",
        price: "€250",
        tagline: "Logo and brand palette",
        ideal: "Professional logo and color palette, the foundation of your visual identity.",
        features: [
          "Professional logo (concepts + final)",
          "Color palette",
          "Versions for web and print",
          "Basic guidelines (PDF)",
        ],
      },
      {
        name: "Standard",
        price: "€500",
        tagline: "Complete visual identity",
        ideal: "Logo, palette and complete visual identity, ready for any material and platform.",
        features: [
          "Everything in Basic",
          "Complete visual identity (icons, patterns, graphic elements)",
          "Extended palette (secondary + neutral)",
          "Business cards",
          "1 Template",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€850",
        tagline: "Complete brand design",
        ideal: "Logo, visual identity and complete brand design, with palette and brand kit for every scenario.",
        features: [
          "Everything in Standard",
          "Complete material design (brochures, presentations, packaging)",
          "Full Brand Kit (PDF + Figma/Canva)",
          "Color palette for every platform",
          "Post-delivery support",
        ],
      },
    ],
  },

  // ─── 6. MAINTENANCE ────────────────────────────────────────────────────────
  {
    slug: "mirembajtja",
    title: "Maintenance",
    headline: "Maintenance, optimization and rebuilds for Albanian business websites.",
    subheadline:
      "We keep your site always online, fast and secure. We also rebuild and optimize older sites.",
    short:
      "Your site online, fast and secure, every day.",
    description: "",
    icon: "◈",
    ctaPrimary: "Start today →",
    ctaSecondary: "Our work",
    trustLine: "Free consultation · Activation within 24h · No obligation",
    subServices: [
      "24/7 monitoring",
      "Continuous optimization",
      "Rebuilding older sites",
      "Security & daily backup",
      "Immediate response",
    ],
    packages: [
      {
        name: "Basic",
        price: "€49",
        priceNote: "/ month",
        tagline: "Basic protection",
        ideal: "Your site monitored and secure, without a high cost.",
        features: [
          "24/7 uptime monitoring with alerts",
          "Full weekly backup",
          "CMS, plugin and theme updates",
          "Monthly site health report",
          "Email support with reply within 48h",
        ],
        featureBullets: [
          { emphasis: "24/7 monitoring", detail: "we notify you immediately if the site goes down." },
          { emphasis: "Weekly backup", detail: "a full copy every week, ready for a quick restore." },
          { emphasis: "Updates", detail: "we keep everything up to date and secure." },
          { emphasis: "Monthly report", detail: "we show you how the site is doing every month." },
        ],
      },
      {
        name: "Pro",
        price: "€99",
        priceNote: "/ month",
        tagline: "Complete maintenance",
        ideal: "Maximum protection and speed, for businesses that can't afford downtime.",
        features: [
          "24/7 uptime monitoring with SMS and email",
          "Automated daily backup",
          "SSL, firewall and malware scanning",
          "Cache and speed optimization every month",
          "Up to 2 hours/month of technical work",
          "Priority support with reply within 4h",
        ],
        featureBullets: [
          { emphasis: "Daily backup", detail: "a fresh copy every day, you lose at most one day of work." },
          { emphasis: "Advanced security", detail: "firewall, virus scanning and SSL, your site well protected." },
          { emphasis: "Speed optimization", detail: "the site gets faster every month." },
          { emphasis: "2h of work/month", detail: "free changes and fixes, whenever needed." },
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "€149",
        priceNote: "/ month",
        tagline: "Complete technical partner",
        ideal: "Unlimited full support, for high-traffic businesses or an active online store.",
        features: [
          "Advanced monitoring with real-time alerts",
          "Daily backup + weekly off-site backup",
          "Enterprise security: WAF, anti-DDoS, daily scanning",
          "Continuous Core Web Vitals optimization",
          "Unlimited technical work",
          "Priority support with reply within 1h",
          "Weekly performance and security report",
        ],
        featureBullets: [
          { emphasis: "Unlimited technical work", detail: "any technical change, whenever needed, at no extra cost." },
          { emphasis: "Top-tier security", detail: "protection like the big platforms, against attacks and viruses." },
          { emphasis: "Optimized for Google", detail: "the site gets faster, Google ranks you higher." },
          { emphasis: "Reply within 1h", detail: "the problem doesn't wait, neither does our fix." },
        ],
      },
    ],
  },
];

export const serviceCategoryBySlug = (slug: string) =>
  serviceCategories.find((item) => item.slug === slug);
