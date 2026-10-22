import {
  getConversionTrustStatsDefault,
  getConversionWhyUsHeroDefault,
} from "@/lib/conversionLandingShared";
import { DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import type { CountrySlug, DiasporaCountryContent } from "@/lib/diasporaShared";

// Versioni anglisht i lib/diasporaContent.sq.ts — të njëjtat fakte dhe dëshmi (pa
// shtuar klientë lokalë që s'i kemi: Zvicra dhe SHBA/Kanada mbeten "shembuj pune").

function buildDiasporaWhatsAppHref(countryLine: string): string {
  const lines = [
    "Hello 👋,",
    "",
    "I'd like to get a quote for your services.",
    "",
    `• From: ${countryLine}`,
    "• Name / Business: ",
    "• Service: ",
    "• Budget: ",
  ];
  return `https://wa.me/${DEFAULT_WHATSAPP_E164}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Same for all 5 countries — delivery is identical, only the pain points differ. */
const DIASPORA_PROCESS = [
  {
    step: "1",
    title: "A consultation without borders",
    desc: "We talk online, at a time that suits you, whatever the time difference.\nWe get to know your business and the market you work in.",
  },
  {
    step: "2",
    title: "Design & structure",
    desc: "We build the structure and the look.\nYou see progress step by step, with no surprises at the end.",
  },
  {
    step: "3",
    title: "Development",
    desc: "We turn it into a fast, working website.\nReady for your clients, wherever they are.",
  },
  {
    step: "4",
    title: "Launch & handover",
    desc: "We put it live and give you a simple admin.\nMake changes yourself, without waiting for anyone.",
  },
] as const;

const whyUsHero = getConversionWhyUsHeroDefault("en");
const trustStats = getConversionTrustStatsDefault("en");

export const diasporaContent: Record<CountrySlug, DiasporaCountryContent> = {
  gjermani: {
    countryLabel: "Germany",
    flagCode: "de",
    heroEyebrow: "THE ALBANIAN DIASPORA IN GERMANY",
    heroHeadline: "Your business in Germany, managed",
    heroHeadlineAccent: "from anywhere.",
    heroIntro:
      "We build professional websites for Albanian-owned businesses operating in Germany, whether you are there yourself or run it from Albania. In Albanian, simply, without endless phone calls.",
    heroTrustLine: "Free consultation · Plan within 24–48h · Real clients in Germany",
    hookLine: "Websites for Albanian businesses in Germany, with real clients as proof.",
    trustStats,
    painSection: {
      eyebrow: "THE SITUATION",
      headingBefore: "Having a business in Germany",
      headingAccent: "doesn't make it easy to manage.",
      items: [
        { title: "Messages left unanswered", body: "Clients write on Facebook/Instagram at times when you can't reply, and they run out of patience." },
        { title: "Low trust from an outdated presence", body: "An old site or just a Facebook page doesn't build the trust the German market expects." },
        { title: "Hard to manage from a distance", body: "Every small change (a price, a photo, opening hours) means calling someone else and waiting." },
      ],
    },
    solutionSection: {
      eyebrow: "THE SOLUTION",
      headingBefore: "A website that works",
      headingAccent: "even while you sleep.",
      items: [
        { title: "WhatsApp & a contact form, always on", body: "Clients find you and contact you 24/7, without waiting for your working hours." },
        { title: "Design that meets German standards", body: "A clear, professional structure that builds trust in the first 5 seconds." },
        { title: "A simple admin panel", body: "Change prices, photos and text yourself, without depending on anyone." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "CTAs that bring real inquiries", body: "Every page is built to turn visitors into clients, not just to look good." },
        { icon: "support", title: "100% communication in Albanian", body: "We speak your language and understand the context of an Albanian business abroad." },
        { icon: "seo", title: "Found by the right clients", body: "Basic SEO included, so you are found both by Albanians and by the local German market." },
        { icon: "speed", title: "Fast, no wasted time", body: "A plan within 24–48 hours, the site ready in weeks, not months." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["hauswerk-niederbayern", "suli-group-trockenbau"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Visitors find the right service quickly and inquiries come in more precise.", name: "Amir S.", role: "Hauswerk Niederbayern", location: "Straubing, Germany" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Germany"),
    relatedBlogSlugs: ["website-dygjuhesh-biznes-diaspore", "menaxho-biznesin-nga-diaspora"],
    hasLocalCaseStudy: true,
  },

  britani: {
    countryLabel: "United Kingdom",
    flagCode: "gb",
    heroEyebrow: "THE ALBANIAN DIASPORA IN THE UK",
    heroHeadline: "Your business in the UK,",
    heroHeadlineAccent: "ready for new clients.",
    heroIntro:
      "We build professional websites for Albanian-owned businesses in England, Scotland and Wales that put you side by side with British competitors, not behind them.",
    heroTrustLine: "Free consultation · Plan within 24–48h · Real client in London",
    hookLine: "Websites for Albanian businesses in the UK, with real results, not promises.",
    trustStats,
    painSection: {
      eyebrow: "THE SITUATION",
      headingBefore: "The British market expects",
      headingAccent: "very high standards.",
      items: [
        { title: "Local competitors look more professional", body: "British companies with modern sites win trust before you even pick up the phone." },
        { title: "The time difference makes communication harder", body: "Being ~2 hours apart from Albania slows project updates down if everything depends on phone calls." },
        { title: "Facebook is no longer enough", body: "British clients expect a website, not just a social page, before they get in touch." },
      ],
    },
    solutionSection: {
      eyebrow: "THE SOLUTION",
      headingBefore: "A presence that competes,",
      headingAccent: "not one that follows.",
      items: [
        { title: "International-level design", body: "A website that looks and works like those of the best British companies in your sector." },
        { title: "Clear reporting, not endless calls", body: "Written updates, screenshots and visible progress: communication that doesn't depend on the time of day." },
        { title: "Google Ads when organic isn't enough", body: "When organic SEO isn't enough, we add campaigns targeted directly at your area of the UK." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "CTAs that bring real inquiries", body: "The page structure leads visitors to get in touch, not to get confused." },
        { icon: "support", title: "Clear communication in Albanian and English", body: "We explain every step simply, without technical jargon." },
        { icon: "seo", title: "Found on Google UK and by Albanians", body: "Optimisation that covers both of your audiences at once." },
        { icon: "speed", title: "A plan within 24–48 hours", body: "No wasted time: you quickly know what the project includes and what it costs." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["palushi-brothers"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Clients contact us with clear expectations from the very start.", name: "Vehbi P.", role: "Palushi Brothers", location: "London, England" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("United Kingdom"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },

  zvicer: {
    countryLabel: "Switzerland",
    flagCode: "ch",
    heroEyebrow: "THE ALBANIAN DIASPORA IN SWITZERLAND",
    heroHeadline: "Swiss standards,",
    heroHeadlineAccent: "Albanian service.",
    heroIntro:
      "We build professional websites for Albanian-owned businesses in Switzerland, with the quality this market expects and the simple communication you need from afar.",
    heroTrustLine: "Free consultation · Plan within 24–48h · 100% communication in Albanian",
    hookLine: "A Swiss-level website, managed simply in Albanian.",
    trustStats,
    painSection: {
      eyebrow: "THE SITUATION",
      headingBefore: "Switzerland expects",
      headingAccent: "maximum professionalism.",
      items: [
        { title: "Very high expectations", body: "Swiss clients value precision and a professional look from the very first contact." },
        { title: "Little personal time to manage it yourself", body: "The pace of life in Switzerland leaves little room to learn and maintain a website yourself." },
        { title: "You need someone who understands both worlds", body: "You need someone who speaks Albanian but also understands what the Swiss market expects." },
      ],
    },
    solutionSection: {
      eyebrow: "THE SOLUTION",
      headingBefore: "Swiss quality,",
      headingAccent: "simple Albanian management.",
      items: [
        { title: "Clean, precise design", body: "Structure and aesthetics built for the high standard the Swiss market expects." },
        { title: "We look after the technical side", body: "You focus on the business; we take care of security, speed and updates." },
        { title: "Direct communication in Albanian", body: "No need to translate every request yourself: we speak your language from start to finish." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "A website that builds trust", body: "The structure and look communicate seriousness in the first few seconds." },
        { icon: "support", title: "Clear communication in Albanian", body: "Every question gets an answer, without language barriers." },
        { icon: "seo", title: "Found by the Albanian community in Switzerland", body: "SEO that connects you with the clients looking for exactly you." },
        { icon: "speed", title: "A fast process, no wasted time", body: "A clear plan within 24–48 hours, without months of waiting." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["hauswerk-niederbayern", "palushi-brothers"],
    portfolioSubline: "Examples of our work with Albanian businesses in the diaspora.",
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Visitors find the right service quickly and inquiries come in more precise.", name: "Amir S.", role: "Hauswerk Niederbayern", location: "Straubing, Germany" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Switzerland"),
    relatedBlogSlugs: ["website-dygjuhesh-biznes-diaspore", "menaxho-biznesin-nga-diaspora"],
    hasLocalCaseStudy: false,
  },

  itali: {
    countryLabel: "Italy",
    flagCode: "it",
    heroEyebrow: "THE ALBANIAN DIASPORA IN ITALY",
    heroHeadline: "Being close isn't enough,",
    heroHeadlineAccent: "you need a professional presence.",
    heroIntro:
      "We build bilingual websites (Albanian/Italian) for Albanian-owned businesses in Italy that speak to the Italian market and the Albanian community at the same time.",
    heroTrustLine: "Free consultation · Plan within 24–48h · Real client in Milan",
    hookLine: "Bilingual websites for Albanian businesses in Italy, with a real client as proof.",
    trustStats,
    painSection: {
      eyebrow: "THE SITUATION",
      headingBefore: "Close geographically,",
      headingAccent: "far behind digitally.",
      items: [
        { title: "Italian competitors overtake you online", body: "Without a professional site you lose clients to Italian businesses even when your offer is better." },
        { title: "Two audiences, one message", body: "A site only in Albanian cuts you off from the Italian market; only in Italian, it pushes away the Albanian community." },
        { title: "Hard to manage from a distance", body: "Small changes need someone else and time you don't have." },
      ],
    },
    solutionSection: {
      eyebrow: "THE SOLUTION",
      headingBefore: "One website,",
      headingAccent: "two audiences, both covered.",
      items: [
        { title: "A bilingual Albanian/Italian site", body: "The same professional message, in the language each visitor speaks." },
        { title: "Design that builds trust straight away", body: "A clear structure that helps visitors decide quickly." },
        { title: "A simple admin for your own changes", body: "Change prices, photos and opening hours without waiting for anyone." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "A message that brings real inquiries", body: "The page structure leads visitors to get in touch, not to get confused." },
        { icon: "support", title: "Communication in Albanian and Italian", body: "We explain every step clearly, without language barriers." },
        { icon: "seo", title: "Found by both audiences", body: "SEO structured for searches in Albanian and Italian at the same time." },
        { icon: "speed", title: "A plan within 24–48 hours", body: "You quickly know what the project includes and what it costs." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["esm-group"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Clients understand what we do faster and conversations are more concrete.", name: "Mariglent S.", role: "ESM Group", location: "Milan, Italy" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Italy"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },

  "shba-kanada": {
    countryLabel: "USA & Canada",
    flagCode: "us",
    heroEyebrow: "THE ALBANIAN DIASPORA IN THE USA & CANADA",
    heroHeadline: "The time difference shouldn't stop",
    heroHeadlineAccent: "your business.",
    heroIntro:
      "We build professional websites for Albanian-owned businesses in the USA and Canada that keep working while you sleep, with clear reporting and no dependence on phone calls.",
    heroTrustLine: "Free consultation · Plan within 24–48h · 100% communication in Albanian",
    hookLine: "A website that works 24/7, even with a 6–9 hour time difference.",
    trustStats,
    painSection: {
      eyebrow: "THE SITUATION",
      headingBefore: "A 6–9 hour time difference",
      headingAccent: "makes phone calls impractical.",
      items: [
        { title: "Phone calls become impossible", body: "When one side sleeps the other works; communicating only by phone slows every decision down." },
        { title: "American/Canadian expectations of a fast site", body: "Clients expect a professional, fast and clear website, not just a Facebook page." },
        { title: "Rare visits back home", body: "With 1–2 visits a year, you need a way to stay in control from a distance all year round." },
      ],
    },
    solutionSection: {
      eyebrow: "THE SOLUTION",
      headingBefore: "Online reporting,",
      headingAccent: "not dependence on phone calls.",
      items: [
        { title: "Website + WhatsApp, always on", body: "Clients find and contact you whatever the time; the site works even while you sleep." },
        // Q-15 (2026-10-22): there is no client self-edit panel yet
        // { title: "A simple dashboard for remote control", body: "See and change your business information yourself, without waiting for your next visit home." },
        { title: "We make the changes, remotely", body: "Message us on WhatsApp or email with what needs changing (prices, hours, photos) and we update the site as part of the maintenance package, without waiting for your next visit home." },
        { title: "Clear, asynchronous communication", body: "Written updates and screenshots, not dependence on a shared phone schedule." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "A website that brings inquiries, not just visits", body: "The page structure leads visitors to real contact." },
        { icon: "support", title: "Clear communication in Albanian", body: "No language barriers, however far away you are." },
        { icon: "seo", title: "Found by the Albanian community in the USA/Canada", body: "SEO that connects you directly with your specific audience." },
        { icon: "speed", title: "A fast process, even from afar", body: "A plan within 24–48 hours, no need to be there in person." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["roofon-nyc", "suli-group-trockenbau", "palushi-brothers"],
    portfolioSubline: "From New York (Roofon NYC) to Albanian businesses across Europe.",
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Clients contact us with clear expectations from the very start.", name: "Vehbi P.", role: "Palushi Brothers", location: "London, England" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("USA / Canada"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },
};
