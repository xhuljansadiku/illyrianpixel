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

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("sq-AL", { day: "2-digit", month: "long", year: "numeric" });
}

const STATUS_COLORS: Record<QuoteRecord["status"], string> = {
  draft: "border-white/15 bg-white/5 text-white/55",
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
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white md:py-20">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-accent/60 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/70">Illyrian Pixel</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/35">Portali i klientit</p>
          </div>
          <div className="text-right">
            <h1 className="font-display text-2xl font-bold text-white">{contactName}</h1>
          </div>
        </div>

        {/* Projects */}
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-accent">Projektet</h2>
          {projects.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Ende nuk ka projekte aktive për ju.</p>
          ) : (
            <div className="mt-4 space-y-5">
              {projects.map((p) => {
                const total = p.tasks.length;
                const done = p.tasks.filter((t) => t.done).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={p.id} className="rounded-xl border border-white/10 bg-[#101010] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-accent/30 bg-accent/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                          {PROJECT_PHASE_LABELS[p.phase]}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
                          {PROJECT_STATUS_LABELS[p.status]}
                        </span>
                      </div>
                    </div>

                    {p.deadline && (
                      <p className="mt-2 text-[12px] text-white/40">Afati: {formatDay(`${p.deadline}T00:00:00`)}</p>
                    )}

                    {total > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] text-white/40">
                          <span>Progresi</span>
                          <span>{done}/{total} · {pct}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <ul className="mt-4 space-y-1.5">
                          {p.tasks.map((t) => (
                            <li key={t.id} className="flex items-center gap-2 text-sm">
                              <span className={t.done ? "text-emerald-400" : "text-white/25"}>
                                {t.done ? "✓" : "○"}
                              </span>
                              <span className={t.done ? "text-white/45 line-through" : "text-white/75"}>
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
          <h2 className="font-display text-lg font-semibold text-accent">Ofertat & Faturat</h2>
          {quotes.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Ende nuk ka oferta ose fatura për ju.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {quotes.map((q) => {
                const total = quoteTotals(q.items, q.discount, q.tax_rate).total;
                return (
                  <div
                    key={q.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#101010] p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {QUOTE_KIND_LABELS[q.kind]} {q.number}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/40">{formatDay(q.issued_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{formatMoney(total)}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_COLORS[q.status]}`}>
                        {QUOTE_STATUS_LABELS[q.status]}
                      </span>
                      {q.public_token && (
                        <a
                          href={`/oferta/${q.public_token}`}
                          className="text-[12px] font-semibold text-accent underline-offset-4 hover:underline"
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

        {/* Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/30">
          <span>illyrianpixel.com · info@illyrianpixel.com</span>
          <span>Faleminderit për besimin!</span>
        </div>
      </div>
    </main>
  );
}
