"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_E164;
const whatsappHref = buildWhatsAppChatHref(WHATSAPP_NUMBER);

type ServicePackageInfo = { name: string; price: string; priceNote: string | null; ideal: string };
type ServiceInfo = { slug: string; title: string; short: string; packages: ServicePackageInfo[] };
type FaqInfo = { question: string; answer: string };
type AssistantData = { services: ServiceInfo[]; faqs: FaqInfo[] };

type Message = {
  role: "you" | "bot";
  text: string;
  link?: { href: string; label: string };
  suggestions?: string[];
  matched?: boolean;
};

const SERVICE_KEYWORDS: { slug: string; words: RegExp }[] = [
  { slug: "ecommerce", words: /dyqan|shop|e-?commerce|botiq|shites online/i },
  { slug: "seo-google-ads", words: /marketing|reklam|ads|google ads|seo|growth|fitim klient/i },
  { slug: "branding-content", words: /brand|identitet|logo|content|përmbajtje/i },
  { slug: "smm", words: /social|instagram|facebook|tiktok|smm|rrjete sociale/i },
  { slug: "mirembajtja", words: /mir[ëe]mbajt|maintenance|suport|mbeshtetje|mbështetje/i },
  { slug: "website", words: /website|faqe|web|sajt/i },
];

const GREETING = /^(tung|tungjatjeta|p[ëe]rsh[ëe]ndetje|hi|hello|hey|ckemi|c'kemi|si je)/i;
const PRICE_WORDS = /sa kushton|sa eshte|sa është|cmim|çmim|tarif|paket|pak[oe]/i;
const CONTACT_WORDS = /kontakt|telefon|email|e-?mail|whatsapp|adres[ëe]|num[ëe]r/i;
const TIME_WORDS = /sa koh[ëe]|sa zgjat|afat|deadline|kohëzgjatj/i;
const WHO_WORDS = /kush je|c'je ti|cfar[ëe] je|qfar[ëe] je/i;
const LOCATION_WORDS = /ku (jeni|ndodheni|gjendeni)|ku punoni|cil[ëe]n? (qytet|vend)|nga jeni|lokacion/i;
const PORTFOLIO_WORDS = /portofol|portfolio|pun[ëe]t tuaja|projekte t[ëe] m[ëe]parshme|shembuj|nj[ëe] shembull|ç'keni b[ëe]r/i;
const GUARANTEE_WORDS = /garanci|garantoni|nese nuk jam i kenaqur|n[ëe]se nuk jam i k[ëe]naqur/i;
const PROCESS_WORDS = /si funksionon|proces|hapat e pun[ëe]s|si punoni|si filloj/i;
const PAYMENT_WORDS = /pages[ëe]|si paguaj|metod[ëe]n? e pages[ëe]s|kesh|transfert bankare/i;
const THANKS_WORDS = /^(faleminderit|flm|thanks|thank you|shum[ëe] mir[ëe])/i;
const BYE_WORDS = /^(mirupafshim|bye|ciao|na shihemi)/i;
const FOLLOWUP_WORDS = /^(po |edhe |dhe |c'perfshin|cfar[ëe] p[ëe]rfshin|cka p[ëe]rfshin|m[ëe] shum[ëe] detaje|m[ëe] thuaj m[ëe] shum[ëe])/i;
const GENERAL_INTEREST_WORDS = /dua (nj[ëe] )?ofert|kam nevoj[ëe] p[ëe]r ndihm|m[ëe] interesoj|dua t[ëe] filloj|dua nj[ëe] projekt|m[ëe] duhet (nj[ëe] )?(sajt|website|faqe)|d[ëe]shiroj nj[ëe] projekt/i;

// Tema krejtësisht jashtë fushës së Illyrian Pixel (moti, lajme, politikë, sport, etj.)
const OFF_TOPIC_WORDS =
  /moti|parashikim|lajme|politik|kryeministr|president|zgjedhje|futboll|basketboll|ndeshj|recet[ëe]|gatim|film|serial|k[ëe]ng[ëe]|muzik[ëe]|sa b[ëe]n \d|matematik[ëe]|kush ishte|kush [ëe]sht[ëe] presid|histori e bot[ëe]s|chatgpt|openai|inteligjenc[ëe]\s*artificiale/i;

// Buxhet i përmendur me shumë + monedhë (p.sh. "kam buxhet 500 euro")
const BUDGET_WORDS = /(\d{2,6})\s*(€|eur|euro|lek|all)\b/i;

// --- Mbështetje bazike për anglisht ---
const ENGLISH_HINT =
  /\b(how much|how long|what is|do you|can you|thank you|thanks|hello|hey|hi|where are you|contact you|get in touch|your price|price list|how does it work|i want|i need|please|good morning|good evening)\b/i;
const EN_THANKS = /^(thanks|thank you|thx)/i;
const EN_BYE = /^(bye|goodbye|see you)/i;
const EN_WHO = /who are you|what are you/i;
const EN_GREETING = /^(hi|hello|hey|good morning|good evening)/i;
const EN_LOCATION = /where are you|location|based/i;
const EN_CONTACT = /contact|phone|email|whatsapp|reach you|get in touch/i;
const EN_TIME = /how long|timeline|turnaround|deadline/i;
const EN_GUARANTEE = /guarantee|refund|risk/i;
const EN_PROCESS = /how does it work|process|how do you work/i;
const EN_PAYMENT = /payment|pay|installment/i;
const EN_PORTFOLIO = /portfolio|examples|previous work|case stud/i;
const EN_PRICE = /how much|price|cost|pricing/i;

const SUGGESTIONS = [
  "Sa kushton një website?",
  "Si ju kontaktoj?",
  "Ku ndodheni?",
  "Sa kohë zgjat një projekt?",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

// Numëron sa fjalë të tekstit gjenden (ose janë shumë të ngjashme) te fjalitë e synuara
function fuzzyWordScore(words: string[], target: string): number {
  let score = 0;
  for (const w of words) {
    if (target.includes(w)) {
      score += 1;
      continue;
    }
    for (const tw of target.split(/\s+/)) {
      if (Math.abs(tw.length - w.length) > 2) continue;
      const maxDist = w.length >= 7 ? 2 : 1;
      if (levenshtein(w, tw) <= maxDist) {
        score += 0.7;
        break;
      }
    }
  }
  return score;
}

type ConversationContext = { lastServiceSlug: string | null; awaitingService: boolean };

// Përputh tekstin me titullin/fjalët kyçe të një shërbimi (përdoret edhe pas pyetjes sqaruese)
function matchService(text: string, data: AssistantData): ServiceInfo | null {
  const fromKeywords = SERVICE_KEYWORDS.find((s) => s.words.test(text));
  if (fromKeywords) {
    const service = data.services.find((s) => s.slug === fromKeywords.slug);
    if (service) return service;
  }
  const words = text.split(/\s+/).filter((w) => w.length >= 3);
  for (const service of data.services) {
    if (fuzzyWordScore(words, normalize(service.title)) >= 1) return service;
  }
  return null;
}

function serviceReply(service: ServiceInfo): Message {
  const lines = service.packages
    .map((p) => `• ${p.name}: ${p.price}${p.priceNote ? ` (${p.priceNote})` : ""}`)
    .join("\n");
  return {
    role: "bot",
    text: `${service.title} — paketat tona:\n${lines}\n\nDëshiron një ofertë të personalizuar?`,
    link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
  };
}

function serviceReplyEn(service: ServiceInfo): Message {
  const lines = service.packages
    .map((p) => `• ${p.name}: ${p.price}${p.priceNote ? ` (${p.priceNote})` : ""}`)
    .join("\n");
  return {
    role: "bot",
    text: `${service.title} — our packages:\n${lines}\n\nWant a custom quote?`,
    link: { href: whatsappHref, label: "Message us on WhatsApp →" },
  };
}

// Nxjerr vlerën numerike nga një string çmimi (p.sh. "nga €299" -> 299)
function extractPriceNumber(price: string): number | null {
  const m = price.replace(/[.,]/g, "").match(/(\d{2,6})/);
  return m ? Number(m[1]) : null;
}

// Gjen paketën më të përshtatshme për një buxhet të dhënë
function findBudgetMatch(
  data: AssistantData,
  budget: number
): { service: ServiceInfo; pkg: ServicePackageInfo; withinBudget: boolean } | null {
  let best: { service: ServiceInfo; pkg: ServicePackageInfo; price: number } | null = null;
  let cheapest: { service: ServiceInfo; pkg: ServicePackageInfo; price: number } | null = null;
  for (const service of data.services) {
    for (const pkg of service.packages) {
      const price = extractPriceNumber(pkg.price);
      if (price == null) continue;
      if (!cheapest || price < cheapest.price) cheapest = { service, pkg, price };
      if (price <= budget && (!best || price > best.price)) best = { service, pkg, price };
    }
  }
  if (best) return { service: best.service, pkg: best.pkg, withinBudget: true };
  if (cheapest) return { service: cheapest.service, pkg: cheapest.pkg, withinBudget: false };
  return null;
}

function buildEnglishReply(text: string, data: AssistantData | null, ctx: ConversationContext): Message {
  if (EN_THANKS.test(text)) {
    return { role: "bot", text: "You're welcome! 🙌 Let me know if there's anything else." };
  }

  if (EN_BYE.test(text)) {
    return { role: "bot", text: "Goodbye! 👋 Feel free to reach out anytime — Illyrian Pixel is always here." };
  }

  if (EN_WHO.test(text)) {
    return {
      role: "bot",
      text: "I'm King Genti 👑 — Illyrian Pixel's virtual assistant. I can help with pricing, services, and common questions. What would you like to know?",
    };
  }

  if (EN_GREETING.test(text)) {
    return {
      role: "bot",
      text: "Hi there! 👋 Ask me about pricing for a service (website, e-commerce, marketing, branding, social media, maintenance), or anything else about Illyrian Pixel.",
    };
  }

  if (EN_LOCATION.test(text)) {
    return {
      role: "bot",
      text: "The Illyrian Pixel team is based in Albania · Germany · Online — we work with clients worldwide, everything is coordinated online (calls, email, WhatsApp).",
    };
  }

  if (EN_CONTACT.test(text)) {
    return {
      role: "bot",
      text: "You can reach us via:\n📱 WhatsApp — message us directly\n📧 Email: info@illyrianpixel.com\n\nOr fill out the contact form and we'll get back to you quickly.",
      link: { href: whatsappHref, label: "Open WhatsApp →" },
    };
  }

  if (EN_TIME.test(text)) {
    return {
      role: "bot",
      text: "It depends on the project: a Basic website is usually ready within 5–10 days, while bigger projects (e-commerce, full branding) take 2–4 weeks. Send us the details and we'll give you an exact timeline.",
    };
  }

  if (EN_GUARANTEE.test(text)) {
    return {
      role: "bot",
      text: "Every package includes revisions until you're happy with the result. If something isn't working as expected, just tell us — we'll always find a solution together.",
    };
  }

  if (EN_PROCESS.test(text)) {
    return {
      role: "bot",
      text: "Our process: 1) a short chat about your needs, 2) a proposal with price and timeline, 3) development with regular updates, 4) delivery + post-launch support. Message us to get started.",
      link: { href: whatsappHref, label: "Start the conversation →" },
    };
  }

  if (EN_PAYMENT.test(text)) {
    return {
      role: "bot",
      text: "Payment is usually split into installments (e.g. a deposit upfront, the rest on delivery), via bank transfer. We confirm the details together based on the project.",
    };
  }

  if (EN_PORTFOLIO.test(text)) {
    return {
      role: "bot",
      text: "You can see examples of our work in the 'Portfolio' section on the homepage. If you'd like examples specific to your industry, just ask and we'll point you to similar projects.",
    };
  }

  if (data) {
    const matchedService = SERVICE_KEYWORDS.find((s) => s.words.test(text));
    if (matchedService) {
      const service = data.services.find((s) => s.slug === matchedService.slug);
      if (service && service.packages.length > 0) {
        ctx.lastServiceSlug = service.slug;
        return serviceReplyEn(service);
      }
    }

    if (EN_PRICE.test(text)) {
      const lines = data.services
        .map((s) => `• ${s.title}: from ${s.packages[0]?.price ?? "—"}`)
        .join("\n");
      return {
        role: "bot",
        text: `Starting prices for our services:\n${lines}\n\nTell me which service you're interested in for more accurate details.`,
      };
    }
  }

  return {
    role: "bot",
    text: "I'm not totally sure how to answer that 🤔. Try asking about pricing (e.g. \"how much is a website\"), services, timelines, or just message us directly.",
    link: { href: whatsappHref, label: "Message us on WhatsApp →" },
    matched: false,
  };
}

function buildReply(rawText: string, data: AssistantData | null, ctx: ConversationContext): Message {
  const text = normalize(rawText);

  // Po presim që useri të zgjedhë shërbimin pas pyetjes sqaruese
  if (ctx.awaitingService && data) {
    ctx.awaitingService = false;
    const service = matchService(text, data);
    if (service && service.packages.length > 0) {
      ctx.lastServiceSlug = service.slug;
      return serviceReply(service);
    }
    // nuk u kuptua — vazhdo me rrjedhën normale më poshtë
  }

  // Përgjigje në anglisht nëse mesazhi duket i shkruar në anglisht
  if (ENGLISH_HINT.test(text)) {
    return buildEnglishReply(text, data, ctx);
  }

  if (THANKS_WORDS.test(text)) {
    return { role: "bot", text: "Me kënaqësi! 🙌 Nëse të duhet ndonjë gjë tjetër, jam këtu." };
  }

  if (BYE_WORDS.test(text)) {
    return { role: "bot", text: "Mirupafshim! 👋 Na shkruaj sa herë të duhet — Illyrian Pixel është gjithmonë gati." };
  }

  if (WHO_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Unë jam Mbreti Genti 👑 — asistenti virtual i Illyrian Pixel. Të ndihmoj me çmime, shërbime dhe pyetje të shpeshta. Çfarë të intereson?",
    };
  }

  if (GREETING.test(text)) {
    return {
      role: "bot",
      text: "Tungjatjeta! 👋 Më pyet për çmimet e një shërbimi (website, e-commerce, marketing, branding, social media, mirëmbajtje), ose çdo gjë tjetër rreth Illyrian Pixel.",
    };
  }

  if (OFF_TOPIC_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Unë jam asistenti virtual i Illyrian Pixel 👑 dhe jap informacion vetëm për shërbimet, çmimet dhe pyetjet rreth kompanisë sonë. Për këtë temë nuk mund të ndihmoj, por nëse ke pyetje për website, marketing, branding, social media etj. — jam gati!",
      matched: false,
    };
  }

  if (LOCATION_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Ekipi i Illyrian Pixel ndodhet në Shqipëri · Gjermani · Online — punojmë me klientë kudo në botë, gjithçka koordinohet online (video-thirrje, email, WhatsApp).",
    };
  }

  if (CONTACT_WORDS.test(text)) {
    return {
      role: "bot",
      text: 'Mund të na kontaktoni:\n📱 WhatsApp — shkruani direkt\n📧 Email: info@illyrianpixel.com\n\nOse plotësoni formularin e kontaktit dhe ju kthejmë përgjigje shpejt.',
      link: { href: whatsappHref, label: "Hap WhatsApp →" },
    };
  }

  if (TIME_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Kohëzgjatja varet nga projekti: një website Basic zakonisht gati brenda 5–10 ditëve, ndërsa projekte më komplekse (e-commerce, branding i plotë) marrin 2–4 javë. Na shkruani detajet dhe ju japim një afat të saktë.",
    };
  }

  if (GUARANTEE_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Punojmë me revizione të përfshira në çdo paketë derisa rezultati t'ju kënaqë. Nëse diçka nuk shkon si pritej, na thoni — gjejmë gjithmonë një zgjidhje së bashku.",
    };
  }

  if (PROCESS_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Procesi jonë: 1) bisedë e shkurtër për nevojat tuaja, 2) propozim me çmim dhe afat, 3) zhvillimi me përditësime periodike, 4) dorëzimi + mbështetje pas-lançimit. Na shkruani për të nisur.",
      link: { href: whatsappHref, label: "Nisim bisedën →" },
    };
  }

  if (PAYMENT_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Pagesa zakonisht ndahet në këste (p.sh. një paradhënie në fillim dhe pjesa tjetër në dorëzim), me transfertë bankare. Detajet i konfirmojmë bashkë sipas projektit.",
    };
  }

  if (PORTFOLIO_WORDS.test(text)) {
    return {
      role: "bot",
      text: "Mund të shihni shembuj të punëve tona te seksioni 'Portofoli' në faqen kryesore. Nëse doni shembuj specifikë për sektorin tuaj, na shkruani dhe ju tregojmë projekte të ngjashme.",
    };
  }

  if (data) {
    // Kërkesë për çmim te një shërbim specifik
    const matchedService = SERVICE_KEYWORDS.find((s) => s.words.test(text));
    if (matchedService) {
      const service = data.services.find((s) => s.slug === matchedService.slug);
      if (service && service.packages.length > 0) {
        ctx.lastServiceSlug = service.slug;
        return serviceReply(service);
      }
    }

    // Buxhet i përmendur — rekomando paketën më të përshtatshme
    const budgetMatch = text.match(BUDGET_WORDS);
    if (budgetMatch) {
      const budget = Number(budgetMatch[1]);
      const found = findBudgetMatch(data, budget);
      if (found) {
        ctx.lastServiceSlug = found.service.slug;
        if (found.withinBudget) {
          return {
            role: "bot",
            text: `Me një buxhet rreth ${budget}€, ju rekomandojmë "${found.pkg.name}" nga ${found.service.title} — ${found.pkg.price}${found.pkg.priceNote ? ` (${found.pkg.priceNote})` : ""}.\n\nDëshiron më shumë detaje?`,
            link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
          };
        }
        return {
          role: "bot",
          text: `Paketat tona fillojnë nga ${found.pkg.price} (${found.service.title}), pak më shumë se buxheti i përmendur. Na shkruani direkt — shpesh gjejmë opsione fleksibël sipas nevojave tuaja.`,
          link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
        };
      }
    }

    // Interes i përgjithshëm pa shërbim të specifikuar — pyet për sqarim
    if (GENERAL_INTEREST_WORDS.test(text)) {
      ctx.awaitingService = true;
      return {
        role: "bot",
        text: "Sigurisht! 🙌 Për cilin shërbim bëhet fjalë?",
        suggestions: data.services.map((s) => s.title),
      };
    }

    // Pyetje vijuese ("po çmimi?", "çfarë përfshin?") për shërbimin e diskutuar më parë
    if (ctx.lastServiceSlug && FOLLOWUP_WORDS.test(text)) {
      const service = data.services.find((s) => s.slug === ctx.lastServiceSlug);
      if (service && service.packages.length > 0) {
        return serviceReply(service);
      }
    }

    // Kërkesë e përgjithshme për çmime
    if (PRICE_WORDS.test(text)) {
      const lines = data.services
        .map((s) => `• ${s.title}: nga ${s.packages[0]?.price ?? "—"}`)
        .join("\n");
      return {
        role: "bot",
        text: `Çmimet fillestare për shërbimet tona:\n${lines}\n\nMë thuaj cili shërbim të intereson për detaje më të sakta.`,
      };
    }

    // Kërko në FAQ — me tolerancë ndaj gabimeve të shtypjes
    const words = text.split(/\s+/).filter((w) => w.length >= 3);
    let bestFaq: FaqInfo | null = null;
    let bestScore = 0;
    for (const faq of data.faqs) {
      const faqText = normalize(faq.question) + " " + normalize(faq.answer);
      const score = fuzzyWordScore(words, faqText);
      if (score > bestScore) {
        bestScore = score;
        bestFaq = faq;
      }
    }
    if (bestFaq && bestScore >= 1) {
      const faqWords = normalize(bestFaq.question).split(/\s+/).filter((w) => w.length >= 3);
      const related = data.faqs
        .filter((f) => f.question !== bestFaq!.question)
        .map((f) => ({ f, score: fuzzyWordScore(faqWords, normalize(f.question)) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((r) => r.f.question);
      return { role: "bot", text: bestFaq.answer, suggestions: related.length > 0 ? related : undefined };
    }

    // Përputhje e dobët — propozo pyetjen më të afërt si çip
    if (bestFaq && bestScore > 0) {
      return {
        role: "bot",
        text: "Nuk jam plotësisht i sigurt çfarë po pyet 🤔. A doje të thuash:",
        suggestions: [bestFaq.question],
        matched: false,
      };
    }
  }

  return {
    role: "bot",
    text: 'Nuk jam i sigurt si t\'i përgjigjem kësaj saktësisht 🤔. Provo të pyesësh për çmime (psh. "sa kushton një website"), shërbime, afate, garanci, pagesa, ose ku ndodhemi — ose na shkruaj direkt.',
    link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
    matched: false,
  };
}

export default function KingGenti() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState<AssistantData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Tungjatjeta!\nUnë jam Mbreti Genti 👑\nAsistenti i Illyrian Pixel.\nPyesni për çmime, shërbime, ose afate dhe ju ndihmoj menjëherë.",
    },
  ]);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<ConversationContext>({ lastServiceSlug: null, awaitingService: false });
  const sessionIdRef = useRef<string>("");

  if (typeof window !== "undefined" && !sessionIdRef.current) {
    let id = window.sessionStorage.getItem("king_genti_session");
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem("king_genti_session", id);
    }
    sessionIdRef.current = id;
  }

  useIsomorphicLayoutEffect(() => {
    if (!open || !panelRef.current || reduced) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 10, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
    );
  }, [open, reduced]);

  useEffect(() => {
    if (!open || data) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/assistant/data");
        const json = await res.json();
        if (!cancelled && json.success) setData(json);
      } catch {
        // injoro — fallback përgjigjet pa të dhëna
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, data]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mbyll body-scroll-in pas vetes kur sheet-i mobil është i hapur
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const logMessage = (role: "you" | "bot", text: string, matched?: boolean) => {
    fetch("/api/assistant/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionIdRef.current, role, text, matched }),
    }).catch(() => {});
  };

  const sendText = (trimmed: string) => {
    if (!trimmed.trim()) return;
    const reply = buildReply(trimmed, data, contextRef.current);
    setMessages((m) => [...m, { role: "you", text: trimmed }, reply]);
    logMessage("you", trimmed);
    logMessage("bot", reply.text, reply.matched);
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendText(trimmed);
    setInput("");
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}
      <div className="fixed bottom-[88px] right-4 z-[96] flex flex-col items-end md:right-6">
        {open ? (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mbreti Genti — asistenti i Illyrian Pixel"
            className="fixed inset-x-0 bottom-0 z-[96] flex max-h-[min(640px,85dvh)] flex-col rounded-t-[1.25rem] border-t border-white/12 bg-[#0c0c0c]/98 p-4 shadow-[0_-16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl md:static md:mb-3 md:max-h-none md:w-[min(100vw-2rem,340px)] md:rounded-[1rem] md:border md:border-white/12 md:bg-[#0c0c0c]/95 md:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Image src="/images/king-gentius-portrait.png" alt="" width={22} height={22} className="rounded-full object-cover" />
                <p className="text-[11px] tracking-[0.2em] text-accent/90">MBRETI GENTI</p>
              </div>
              <button
                type="button"
                className="-m-2 flex h-9 w-9 items-center justify-center text-xl text-white/55 hover:text-white"
                aria-label="Mbyll"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm md:max-h-[260px] md:flex-none">
              {messages.map((msg, i) => (
                <div
                  key={`m-${i}`}
                  className={`rounded-lg border px-3 py-2 leading-relaxed whitespace-pre-line ${
                    msg.role === "bot"
                      ? "border-white/10 bg-white/[0.03] text-white/75"
                      : "border-accent/25 bg-accent/[0.06] text-white/88"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.link ? (
                    <a
                      href={msg.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-accent underline decoration-accent/40 underline-offset-4"
                    >
                      {msg.link.label}
                    </a>
                  ) : null}
                  {msg.suggestions && i === messages.length - 1 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => sendText(s)}
                          className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/65 transition hover:border-accent/40 hover:text-white"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            {messages.length === 1 ? (
              <div className="mt-2 flex shrink-0 flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendText(s)}
                    className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/65 transition hover:border-accent/40 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="mt-3 flex shrink-0 gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Shkruaj pyetjen tënde…"
                className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/40 px-3.5 py-2.5 text-base text-white outline-none ring-0 placeholder:text-white/35 focus:border-accent/45 md:text-xs"
              />
              <button
                type="button"
                onClick={send}
                className="interactive-button ip-cta-primary ip-cta-primary--sm shrink-0 !px-4 !py-2.5"
              >
                DËRGO
              </button>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-magnetic="true"
          className={`${open ? "hidden md:flex" : "flex"} h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/14 bg-[#0b0b0b]/85 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-accent/45`}
          aria-expanded={open}
          aria-label="Hap Mbretin Genti — asistenti i Illyrian Pixel"
        >
          <Image src="/images/king-gentius-portrait.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
        </button>
      </div>
    </>
  );
}
