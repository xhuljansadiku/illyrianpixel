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

type Message = { role: "you" | "bot"; text: string; link?: { href: string; label: string } };

const SERVICE_KEYWORDS: { slug: string; words: RegExp }[] = [
  { slug: "ecommerce", words: /dyqan|shop|e-?commerce|botiq|shites online/i },
  { slug: "marketing-growth", words: /marketing|reklam|ads|google ads|growth|fitim klient/i },
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

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function buildReply(rawText: string, data: AssistantData | null): Message {
  const text = normalize(rawText);

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

  if (data) {
    // Kërkesë për çmim te një shërbim specifik
    const matchedService = SERVICE_KEYWORDS.find((s) => s.words.test(text));
    if (matchedService) {
      const service = data.services.find((s) => s.slug === matchedService.slug);
      if (service && service.packages.length > 0) {
        const lines = service.packages
          .map((p) => `• ${p.name}: ${p.price}${p.priceNote ? ` (${p.priceNote})` : ""}`)
          .join("\n");
        return {
          role: "bot",
          text: `${service.title} — paketat tona:\n${lines}\n\nDëshiron një ofertë të personalizuar?`,
          link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
        };
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

    // Kërko në FAQ
    const words = text.split(/\s+/).filter((w) => w.length >= 4);
    let bestFaq: FaqInfo | null = null;
    let bestScore = 0;
    for (const faq of data.faqs) {
      const faqText = normalize(faq.question);
      let score = 0;
      for (const w of words) if (faqText.includes(w)) score++;
      if (score > bestScore) {
        bestScore = score;
        bestFaq = faq;
      }
    }
    if (bestFaq && bestScore > 0) {
      return { role: "bot", text: bestFaq.answer };
    }
  }

  return {
    role: "bot",
    text: 'Nuk jam i sigurt si t\'i përgjigjem kësaj saktësisht 🤔. Provo të pyesësh për çmime (psh. "sa kushton një website"), shërbime, ose afate kohore — ose na shkruaj direkt.',
    link: { href: whatsappHref, label: "Shkruaj në WhatsApp →" },
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

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const reply = buildReply(trimmed, data);
    setMessages((m) => [...m, { role: "you", text: trimmed }, reply]);
    setInput("");
  };

  return (
    <div className="fixed bottom-[88px] right-4 z-[96] flex flex-col items-end md:right-6">
      {open ? (
        <div
          ref={panelRef}
          className="mb-3 w-[min(100vw-2rem,340px)] rounded-[1rem] border border-white/12 bg-[#0c0c0c]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image src="/images/king-gentius-portrait.png" alt="" width={22} height={22} className="rounded-full object-cover" />
              <p className="text-[11px] tracking-[0.2em] text-accent/90">MBRETI GENTI</p>
            </div>
            <button type="button" className="text-white/55 hover:text-white" aria-label="Mbyll" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div ref={scrollRef} className="max-h-[260px] space-y-2 overflow-y-auto pr-1 text-sm">
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
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Shkruaj pyetjen tënde…"
              className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/40 px-3 py-2 text-xs text-white outline-none ring-0 placeholder:text-white/35 focus:border-accent/45"
            />
            <button
              type="button"
              onClick={send}
              className="interactive-button ip-cta-primary ip-cta-primary--sm !px-3 !py-2"
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
        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/14 bg-[#0b0b0b]/85 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-accent/45"
        aria-expanded={open}
        aria-label="Hap Mbretin Genti — asistenti i Illyrian Pixel"
      >
        <Image src="/images/king-gentius-portrait.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
      </button>
    </div>
  );
}
