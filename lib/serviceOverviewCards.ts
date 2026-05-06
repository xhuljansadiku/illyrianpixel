import type { ServiceCardVisualVariant } from "@/components/ServiceCardHeroVisual";

export type ServiceOverviewCard = {
  ordinal: string;
  title: string;
  /** Dy rreshta fiks (pas "&") për kartat ku duhet thyerje e kontrolluar */
  titleLines?: readonly [string, string];
  desc: string;
  href: string;
  cta: string;
  visualVariant: ServiceCardVisualVariant;
};

/** 3 karta, homepage */
export const SERVICE_OVERVIEW_CARDS: ServiceOverviewCard[] = [
  {
    ordinal: "01",
    title: "Web & E-Commerce",
    desc: "Krijojmë website dhe dyqane online të shpejta, të optimizuara për Google (SEO) dhe të ndërtuara për të kthyer vizitorët në klientë.",
    href: "/services/website",
    visualVariant: "web",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "02",
    title: "SEO & Reklama",
    desc: "Rrisim klientët tuaj përmes SEO dhe reklamave online (Google Ads & Social Media), duke sjellë trafik cilësor dhe kërkesa reale.",
    href: "/services/marketing-growth",
    visualVariant: "marketing",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "03",
    title: "Branding & Content",
    desc: "Ndërtojmë identitet vizual dhe përmbajtje (foto & video) që rrit besimin dhe e bën brandin tuaj të duket profesional.",
    href: "/services/branding-content",
    visualVariant: "branding",
    cta: "Shiko shërbimin →"
  }
];

/** 6 karta, faqja /sherbimet */
export const SHERBIMET_PAGE_CARDS: ServiceOverviewCard[] = [
  {
    ordinal: "01",
    title: "Website Premium",
    desc: "Website i shpejtë, profesional dhe i optimizuar për Google. Ndërtuar për të kthyer vizitorët në klientë, jo vetëm për t'u dukur mirë.",
    href: "/services/website",
    visualVariant: "web",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "02",
    title: "E-Commerce",
    desc: "Dyqan online që shet 24/7. Checkout i optimizuar, pagesa të integruara dhe analitikë e plotë, sistemi juaj i shitjeve automatike.",
    href: "/services/ecommerce",
    visualVariant: "ecommerce",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "03",
    title: "SEO & Reklama",
    desc: "Sjellim klientë të gatshëm të blejnë, përmes SEO organik dhe Google Ads. Trafik i kualifikuar, jo vetëm klikime.",
    href: "/services/marketing-growth",
    visualVariant: "marketing",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "04",
    title: "Social Media",
    desc: "Menaxhojmë Instagram, Facebook dhe TikTok me përmbajtje që ndërton komunitet dhe gjeneron kërkesa reale.",
    href: "/services/smm",
    visualVariant: "smm",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "05",
    title: "Branding & Content",
    desc: "Logo, identitet vizual dhe foto/video profesionale, bëjmë brandin tuaj të duket serioz dhe të ndërtojë besim që në shikim të parë.",
    href: "/services/branding-content",
    visualVariant: "branding",
    cta: "Shiko shërbimin →"
  },
  {
    ordinal: "06",
    title: "Mirëmbajtja",
    desc: "Mirëmbajtje për website dhe e-commerce të ndërtuar nga ne ose nga të tjerë. Shpejtësi, siguri dhe përditësime të vazhdueshme me monitorim 24/7.",
    href: "/contact",
    visualVariant: "maintenance",
    cta: "Shiko shërbimin →"
  }
];
