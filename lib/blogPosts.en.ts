import type { BlogPost } from "./blogPosts.sq";

export const blogPosts: BlogPost[] = [
  {
    slug: "menaxho-biznesin-nga-diaspora",
    title: "I run a business in Albania or Kosovo but live abroad — how to manage it online",
    category: "Diaspora",
    excerpt:
      "How to run a business back home while living in Germany, Switzerland or the US.\nA website as your digital office that keeps working while you sleep in a different timezone.",
    date: "July 2026",
    content: []
  },
  {
    slug: "website-dygjuhesh-biznes-diaspore",
    title: "A bilingual website (Albanian + local language) — why every diaspora Albanian business needs one",
    category: "Diaspora",
    excerpt:
      "Businesses started by Albanians in Germany, Switzerland or the US serve two audiences at once.\nHow to build a site that speaks both languages without splitting your credibility.",
    date: "July 2026",
    content: []
  },
  {
    slug: "si-te-gjejne-klientet-shqiptare-biznesin-tend",
    title: "How Albanian customers find your business online, wherever they are",
    category: "Diaspora",
    excerpt:
      "Albanians in Albania, Kosovo and the diaspora search differently than Western markets.\nWhat your business needs to know to be found by this entire spread-out audience.",
    date: "July 2026",
    content: []
  },
  {
    slug: "sa-kushton-website-shqiperi",
    title: "How Much Does a Professional Website Cost in Albania in 2026?",
    category: "Web Design",
    excerpt:
      "Real website pricing in Albania for 2026.\nFind out what a professional site costs, what it should include, and how to avoid costly mistakes.",
    date: "May 2026",
    content: []
  },
  {
    slug: "seo-tirane",
    title: "SEO Tirana: How to Rank First on Google in 2026",
    category: "SEO",
    excerpt:
      "How Albanian businesses reach page one of Google, and what an SEO strategy that actually delivers results in the Albanian market requires.",
    date: "May 2026",
    content: []
  },
  {
    slug: "dyqan-online-shqiperi",
    title: "How to Open an Online Store in Albania: Complete 2026 Guide",
    category: "E-Commerce",
    excerpt:
      "A practical guide to launching an online store in Albania.\nPlatforms, payments, real costs, and the first steps to start selling online.",
    date: "May 2026",
    content: []
  },
  {
    slug: "google-ads-shqiperi",
    title: "Google Ads Albania: Real Prices and Expected Results",
    category: "Marketing",
    excerpt:
      "Real Google Ads pricing in Albania, the biggest mistakes, and how to manage your ad budget for maximum ROI.",
    date: "May 2026",
    content: []
  },
  {
    slug: "web-design-tirane",
    title: "Web Design Tirana: How to Choose a Professional Agency",
    category: "Web Design",
    excerpt:
      "How to tell a serious agency apart from amateurs.\nThe right criteria, the questions to ask, and the warning signs before you sign.",
    date: "May 2026",
    content: []
  },
  {
    slug: "social-media-menaxhim-shqiperi",
    title: "Social Media Management in Albania: Prices and What to Expect",
    category: "Social Media",
    excerpt:
      "Pricing for professional social media management in Albania, the main platforms, and how to choose the right agency.",
    date: "May 2026",
    content: []
  },
  {
    slug: "si-te-rrisesh-klientet-online",
    title: "You Have the Traffic. So Where Are the Customers?",
    category: "Growth",
    excerpt:
      "Most businesses spend money bringing people to their site and lose them right away.\nNot because the offer is bad, but because the site isn't doing its job.",
    date: "April 2026",
    content: []
  },
  {
    slug: "gabimet-kryesore-ne-website",
    title: "The Mistakes Businesses Make on Their Website (and How We Fix Them)",
    category: "UX",
    excerpt: "A short list of mistakes that erode trust and push customers away.",
    date: "April 2026",
    content: []
  },
  {
    slug: "pse-seo-eshte-kritik",
    title: "Why SEO Is Critical for Serious Businesses (Not Optional)",
    category: "Strategy",
    excerpt:
      "Having a beautiful website that doesn't show up on Google is like opening a luxury store in the middle of the desert.\nNo one finds it, no one buys.",
    date: "April 2026",
    content: []
  },
  {
    slug: "google-ads-vs-seo",
    title: "Google Ads or SEO: Where Should You Invest Your Money?",
    category: "Marketing",
    excerpt:
      "Two different channels, two different logics.\nOne delivers results tomorrow, the other builds something that lasts for years.\nHere's how to choose based on your situation.",
    date: "April 2026",
    content: []
  },
  {
    slug: "pse-ecommerce-eshte-i-rendesishem",
    title: "Your Physical Store Closes at 6 PM. Your Online Store Never Does.",
    category: "E-Commerce",
    excerpt:
      "Why Albanian businesses need an online store in 2026.\nThe most common mistakes, real costs, and what you're losing every month without e-commerce.",
    date: "April 2026",
    content: []
  },
  {
    slug: "cfare-eshte-branding",
    title: "Branding Isn't a Logo. It's What Others Feel.",
    category: "Branding",
    excerpt:
      "What branding really is, why Albanian businesses underestimate it, and what they lose by treating it as just a logo and a color.",
    date: "April 2026",
    content: []
  }
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
