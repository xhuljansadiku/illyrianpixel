// "Si punojmë" (2026-10-16): 4 hapa të shkurtër + "Pa rrezik për ju" — zëvendësoi Process në faqen kryesore.
// Premtimet vijnë vetëm nga kushtet reale (FAQ: pagesa 50/50, plan falas, gjuhët).
import { useTranslations } from "next-intl";
import SectionMark from "@/components/SectionMark";

type Step = { title: string; time: string; body: string };

export default function HomeProcess() {
  const t = useTranslations("home.processV2");
  const steps = t.raw("steps") as Step[];
  const promises = t.raw("promises") as string[];

  return (
    <section id="procesi" className="relative border-b border-white/[0.06] bg-bgDeep/60">
      <div className="section-wrap">
        <SectionMark label={t("eyebrow")} />
        <h2 className="section-title mt-3 max-w-3xl">
          {t("headline")}
          <span className="text-accent">{t("headlineAccent")}</span>
        </h2>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative bg-bg p-7">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">{s.time}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/55">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 md:flex-row md:items-center md:gap-10 md:p-7">
          <p className="flex shrink-0 items-center gap-3 font-display text-xl font-bold text-white">
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            {t("promiseTitle")}
          </p>
          <ul className="grid flex-1 gap-3 md:grid-cols-3">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] text-white/75">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
