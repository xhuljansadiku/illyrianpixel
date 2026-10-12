import {
  PROJECT_PHASE_LABELS,
  PROJECT_STATUS_LABELS,
  type ProjectRecord,
} from "@/lib/projects";
import {
  QUOTE_KIND_LABELS,
  QUOTE_STATUS_LABELS,
  formatMoney,
  quoteTotals,
  type QuoteRecord,
} from "@/lib/quotes";
import { ClientDocFooter, ClientDocHeader, ClientDocShell } from "@/components/ClientDocShell";

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("sq-AL", { day: "2-digit", month: "long", year: "numeric" });
}

const STATUS_COLORS: Record<QuoteRecord["status"], string> = {
  draft: "border-white/20 bg-white/5 text-white/75",
  sent: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  accepted: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
  rejected: "border-red-400/30 bg-red-400/8 text-red-400",
  paid: "border-accent/40 bg-accent/10 text-accent",
};

export default function ClientPortalView({
  contactName,
  projects,
  quotes,
}: {
  contactName: string;
  projects: ProjectRecord[];
  quotes: QuoteRecord[];
}) {
  return (
    <ClientDocShell>
      <ClientDocHeader eyebrow="Portali i klientit" title={contactName} subtitle="Ecuria e projekteve, ofertat dhe faturat tuaja — në një vend." />

        {/* Projects */}
        <section className="mt-10">
          <h2 className="font-display text-[1.5rem] font-semibold text-white">Projektet</h2>
          {projects.length === 0 ? (
            <p className="mt-3 text-[15px] text-white/70">Ende nuk ka projekte aktive për ju.</p>
          ) : (
            <div className="mt-4 space-y-5">
              {projects.map((p) => {
                const total = p.tasks.length;
                const done = p.tasks.filter((t) => t.done).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-surface p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[17px] font-semibold text-white">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-[12px] font-semibold text-accent">
                          {PROJECT_PHASE_LABELS[p.phase]}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-semibold text-white/75">
                          {PROJECT_STATUS_LABELS[p.status]}
                        </span>
                      </div>
                    </div>

                    {p.deadline && (
                      <p className="mt-2 text-[14px] text-white/70">Afati: {formatDay(`${p.deadline}T00:00:00`)}</p>
                    )}

                    {total > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[13px] text-white/70">
                          <span>Progresi</span>
                          <span className="tabular-nums">{done}/{total} · <span className="font-semibold text-accent">{pct}%</span></span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <ul className="mt-4 space-y-1.5">
                          {p.tasks.map((t) => (
                            <li key={t.id} className="flex items-start gap-2.5 text-[15px] leading-snug">
                              <span className={t.done ? "text-emerald-400" : "text-white/40"} aria-hidden>
                                {t.done ? "✓" : "○"}
                              </span>
                              <span className={t.done ? "text-white/55 line-through" : "text-white/85"}>
                                {t.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quotes / invoices */}
        <section className="mt-10">
          <h2 className="font-display text-[1.5rem] font-semibold text-white">Ofertat & Faturat</h2>
          {quotes.length === 0 ? (
            <p className="mt-3 text-[15px] text-white/70">Ende nuk ka oferta ose fatura për ju.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {quotes.map((q) => {
                const total = quoteTotals(q.items, q.discount, q.tax_rate).total;
                return (
                  <div
                    key={q.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface p-4 md:p-5"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        {QUOTE_KIND_LABELS[q.kind]} {q.number}
                      </p>
                      <p className="mt-0.5 text-[14px] text-white/65">{formatDay(q.issued_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-semibold tabular-nums text-white">{formatMoney(total)}</span>
                      <span className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${STATUS_COLORS[q.status]}`}>
                        {QUOTE_STATUS_LABELS[q.status]}
                      </span>
                      {q.public_token && (
                        <a
                          href={`/oferta/${q.public_token}`}
                          className="ip-no-print text-[14px] font-semibold text-accent underline-offset-4 hover:text-accentLight hover:underline"
                        >
                          Shiko →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      <ClientDocFooter />
    </ClientDocShell>
  );
}
