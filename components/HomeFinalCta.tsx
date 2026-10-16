// CTA i fundit (2026-10-16): titulli "A po ju gjejnë?" + 3 mënyra kontakti (WhatsApp, formular, email).
// Zëvendësoi bllokun "Mini Sales" me një buton të vetëm.
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Tone = "whatsapp" | "form" | "email";

// Ngjyra për kanal: distinktive, por brenda paletës së errët/ari
const TONES: Record<Tone, { badge: string; glow: string; border: string; button: string }> = {
  whatsapp: {
    badge: "bg-emerald-500/12 text-emerald-300 ring-emerald-400/25",
    glow: "rgba(16,185,129,0.22)",
    border: "border-white/10 hover:border-emerald-400/50",
    button: "border border-emerald-400/40 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black",
  },
  form: {
    badge: "bg-accent/15 text-accent ring-accent/35",
    glow: "rgba(171,131,57,0.35)",
    border: "border-accent/45 hover:border-accent",
    button: "bg-accent text-black group-hover:bg-accentLight",
  },
  email: {
    badge: "bg-white/[0.06] text-white/80 ring-white/15",
    glow: "rgba(255,255,255,0.10)",
    border: "border-white/10 hover:border-white/35",
    button: "border border-white/20 text-white/85 group-hover:bg-white group-hover:text-black",
  },
};

function ContactCard({ tone, icon, title, body, cta, featured }: {
  tone: Tone; icon: React.ReactNode; title: string; body: string; cta: string; featured?: boolean;
}) {
  const c = TONES[tone];
  return (
    <>
      {/* Shkëlqim me ngjyrën e kanalit, shfaqet në hover (në kartën kryesore është gjithmonë pak i ndezur) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 ${featured ? "opacity-70" : "opacity-0 group-hover:opacity-100"}`}
        style={{ background: c.glow }}
      />
      <span className="relative flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${c.badge}`}>{icon}</span>
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-white/30 group-hover:text-white"
        >
          →
        </span>
      </span>
      <span className="relative mt-6 font-display text-2xl font-bold text-white">{title}</span>
      <span className="relative mt-1.5 text-[14px] leading-relaxed text-white/55">{body}</span>
      <span className={`relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${c.button}`}>
        {cta} <span aria-hidden>→</span>
      </span>
    </>
  );
}

export default function HomeFinalCta({ whatsappHref }: { whatsappHref: string }) {
  const t = useTranslations("home.finalCta");

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-[680px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[110px]" />
      <div className="section-wrap relative text-center">
        <p className="font-body text-[0.95rem] font-light tracking-[0.04em] text-white/50">{t("line1")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">{t("line2")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/55">{t("body")}</p>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3 md:items-stretch">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)_55%)] p-7 text-left shadow-lift backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 ${TONES.whatsapp.border}`}>
            <ContactCard
              tone="whatsapp"
              title={t("whatsappTitle")}
              body={t("whatsappBody")}
              cta={t("whatsappCta")}
              icon={
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
                </svg>
              }
            />
          </a>

          <Link href="/contact" className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)_55%)] p-7 text-left shadow-lift backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 ${TONES.form.border} bg-[linear-gradient(160deg,rgba(171,131,57,0.16),rgba(171,131,57,0.03)_60%)] md:-translate-y-2 md:hover:-translate-y-3.5`}>
            <ContactCard
              tone="form"
              featured
              title={t("formTitle")}
              body={t("formBody")}
              cta={t("formCta")}
              icon={
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
              }
            />
          </Link>

          <a href="mailto:info@illyrianpixel.com" className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)_55%)] p-7 text-left shadow-lift backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 ${TONES.email.border}`}>
            <ContactCard
              tone="email"
              title={t("emailTitle")}
              body={t("emailBody")}
              cta={t("emailCta")}
              icon={
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              }
            />
          </a>
        </div>

        <p className="mt-8 inline-flex flex-wrap items-center justify-center gap-2.5 text-[14px] text-white/55">
          {["al", "gb", "de", "hr"].map((code) => (
            <Image key={code} src={`/flags/4x3/${code}.svg`} alt="" width={20} height={15} className="h-[15px] w-5 rounded-[2px] object-cover" unoptimized />
          ))}
          <span className="ml-1">{t("languages")}</span>
        </p>
      </div>
    </section>
  );
}
