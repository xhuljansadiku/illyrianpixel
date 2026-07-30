"use client";

import { useMemo, useState } from "react";
import { CARD, EmptyState, STATUS_LABELS, formatDate } from "@/components/admin/ui";
import { formatMoney, quoteTotals, type QuoteRecord, type RecurringInvoice } from "@/lib/quotes";
import type { Contact, Stats } from "@/components/AdminDashboard";

function printMonthlyReport(contacts: Contact[], stats: Stats) {
  const now = new Date();
  const monthLabel = now.toLocaleDateString("sq-AL", { month: "long", year: "numeric" });
  const monthContacts = contacts.filter((c) => {
    const d = new Date(c.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const rows = monthContacts
    .map(
      (c) => `<tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.service}</td>
        <td>${STATUS_LABELS[c.status || "new"] ?? c.status ?? ""}</td>
        <td>${formatDate(c.created_at)}</td>
      </tr>`
    )
    .join("");

  const servicesRows = stats.topServices
    .map(({ service, count }) => `<tr><td>${service}</td><td>${count}</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="UTF-8">
<title>Raporti — ${monthLabel}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 14px; margin-top: 28px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #555; }
  p.subtitle { color: #777; margin-top: 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  th { background: #f3f3f3; }
  .stats { display: flex; gap: 24px; margin-top: 16px; }
  .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px 20px; }
  .stat strong { display: block; font-size: 22px; }
  .stat span { font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 0.05em; }
</style>
</head>
<body>
  <h1>Illyrian Pixel — Raporti Mujor</h1>
  <p class="subtitle">${monthLabel}</p>

  <div class="stats">
    <div class="stat"><strong>${stats.totalContacts}</strong><span>Kontakte gjithsej</span></div>
    <div class="stat"><strong>${monthContacts.length}</strong><span>Këtë muaj</span></div>
    <div class="stat"><strong>${stats.conversionRate.toFixed(1)}%</strong><span>Norma e konvertimit</span></div>
    <div class="stat"><strong>${stats.avgDaysToClose !== null ? stats.avgDaysToClose.toFixed(1) : "—"}</strong><span>Ditë mesatare deri në mbyllje</span></div>
  </div>

  <h2>Shërbimet më të kërkuara</h2>
  <table><thead><tr><th>Shërbimi</th><th>Numri</th></tr></thead><tbody>${servicesRows || "<tr><td colspan=2>Nuk ka të dhëna.</td></tr>"}</tbody></table>

  <h2>Kontaktet e ${monthLabel} (${monthContacts.length})</h2>
  <table><thead><tr><th>Emri</th><th>Email</th><th>Shërbimi</th><th>Statusi</th><th>Data</th></tr></thead><tbody>${rows || "<tr><td colspan=5>Asnjë kontakt këtë muaj.</td></tr>"}</tbody></table>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

export default function AnalyticsTab({
  stats,
  contacts,
  quotes,
  visitors30,
  recurring,
}: {
  stats: Stats;
  contacts: Contact[];
  quotes: QuoteRecord[];
  visitors30: number;
  recurring: RecurringInvoice[];
}) {
  const [rangeOption, setRangeOption] = useState<"7" | "30" | "90" | "custom">("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const { cutoff, until, rangeLabel } = useMemo(() => {
    if (rangeOption === "custom" && customFrom) {
      const from = new Date(`${customFrom}T00:00:00`).getTime();
      const to = customTo ? new Date(`${customTo}T23:59:59.999`).getTime() : Date.now();
      return { cutoff: from, until: to, rangeLabel: "intervali i zgjedhur" };
    }
    const days = Number(rangeOption);
    return { cutoff: Date.now() - days * 86400000, until: Date.now(), rangeLabel: `${days} ditët e fundit` };
  }, [rangeOption, customFrom, customTo]);

  const funnel = useMemo(() => {
    const contactsR = contacts.filter((c) => {
      const t = new Date(c.created_at).getTime();
      return t >= cutoff && t <= until;
    });
    const quotesR = quotes.filter((q) => {
      const t = new Date(q.created_at).getTime();
      return t >= cutoff && t <= until && q.status !== "draft";
    });
    const wonR = contactsR.filter((c) => (c.status || "new") === "done");
    return [
      { label: "Vizitorë", value: visitors30 },
      { label: "Kontakte", value: contactsR.length },
      { label: "Oferta të dërguara", value: quotesR.length },
      { label: "Fituar (mbyllur)", value: wonR.length },
    ];
  }, [contacts, quotes, visitors30, cutoff, until]);

  const pipeline = useMemo(() => {
    const open = contacts
      .filter((c) => (c.status || "new") !== "done")
      .reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const won = contacts
      .filter((c) => (c.status || "new") === "done")
      .reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const invoicesPaid = quotes
      .filter((q) => q.kind === "invoice" && q.status === "paid")
      .reduce((sum, q) => sum + quoteTotals(q.items, q.discount, q.tax_rate).total, 0);
    return { open, won, invoicesPaid };
  }, [contacts, quotes]);

  const monthlyRevenue = useMemo(() => {
    const months: { key: string; label: string; total: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleDateString("sq-AL", { month: "short" }), total: 0 });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    quotes
      .filter((q) => q.kind === "invoice" && q.status === "paid")
      .forEach((q) => {
        const key = q.updated_at.slice(0, 7);
        const m = byKey.get(key);
        if (m) m.total += quoteTotals(q.items, q.discount, q.tax_rate).total;
      });
    return months;
  }, [quotes]);

  const mrr = useMemo(
    () => recurring.filter((r) => r.active).reduce((sum, r) => sum + quoteTotals(r.items, r.discount, r.tax_rate).total, 0),
    [recurring]
  );

  const monthlyRevenueMax = Math.max(1, ...monthlyRevenue.map((m) => m.total));

  const sources = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const key = c.source_path || "(e panjohur)";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [contacts]);

  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["7", "30", "90"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setRangeOption(opt)}
              className={`font-ui rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                rangeOption === opt
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
              }`}
            >
              {opt} ditë
            </button>
          ))}
          <button
            onClick={() => setRangeOption("custom")}
            className={`font-ui rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              rangeOption === "custom"
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            Interval
          </button>
          {rangeOption === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                max={customTo || undefined}
                className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">—</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                min={customFrom || undefined}
                className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => printMonthlyReport(contacts, stats)}
          className="font-ui rounded-[10px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          🖨 Eksporto raport (PDF)
        </button>
      </div>

      {/* Pipeline value */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-accent">{formatMoney(pipeline.open)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Pipeline i hapur (vlera e kontakteve aktive)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-emerald-400">{formatMoney(pipeline.won)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Vlera e fituar (kontakte të mbyllura)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{formatMoney(pipeline.invoicesPaid)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Fatura të paguara (gjithsej)</p>
        </div>
      </div>

      {/* Monthly revenue */}
      <div className={CARD + " p-5"}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Të ardhurat mujore — 6 muajt e fundit
          </p>
          {mrr > 0 && (
            <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
              + <span className="font-semibold text-accent">{formatMoney(mrr)}</span> rekurrente / muaj
            </p>
          )}
        </div>
        <div className="flex h-32 items-end gap-3">
          {monthlyRevenue.map((m) => (
            <div key={m.key} className="group relative flex-1">
              <div
                className="rounded-sm bg-accent/40 transition-colors group-hover:bg-accent"
                style={{ height: `${Math.max(3, (m.total / monthlyRevenueMax) * 120)}px` }}
              />
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-[var(--a-text)] opacity-0 transition-opacity group-hover:opacity-100">
                {formatMoney(m.total)}
              </div>
              <p className="mt-2 text-center text-[10px] uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.35)]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Funnel i konvertimit — {rangeLabel}
        </p>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const prev = i > 0 ? funnel[i - 1].value : null;
            const rate = prev && prev > 0 ? (step.value / prev) * 100 : null;
            return (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-[rgb(var(--a-text-rgb)/0.65)]">{step.label}</span>
                  <span className="text-[rgb(var(--a-text-rgb)/0.45)]">
                    {step.value.toLocaleString("sq-AL")}
                    {rate !== null && <span className="ml-2 text-accent/70">({rate.toFixed(1)}%)</span>}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-accent/70 to-accent/35 transition-all"
                    style={{ width: `${Math.max(2, (step.value / funnelMax) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Vizitorët maten nga tracking i brendshëm i faqeve (pa cookies, 30 ditët e fundit, pavarësisht intervalit të zgjedhur). Oferta = dokumente jo-draft të krijuara në {rangeLabel}.
        </p>
      </div>

      {/* Burimet e lead-eve */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Nga cilat faqe vijnë kontaktet
        </p>
        {sources.length === 0 ? (
          <EmptyState text="Ende pa të dhëna burimi." />
        ) : (
          <div className="space-y-3">
            {sources.map(([path, count]) => {
              const max = sources[0][1];
              return (
                <div key={path}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
                    <span className="truncate pr-3 font-mono text-[11px]">{path}</span>
                    <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
                    <div className="h-2 rounded-full bg-accent/50" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
          “(e panjohur)” janë kontakte të ardhura para aktivizimit të gjurmimit të burimit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{stats.conversionRate.toFixed(1)}%</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Norma e konvertimit (Mbyllur / Total)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">
            {stats.avgDaysToClose !== null ? stats.avgDaysToClose.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Ditë mesatare deri në mbyllje</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{stats.totalContacts}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Kontakte gjithsej</p>
        </div>
      </div>

      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Shërbimet më të kërkuara
        </p>
        {stats.topServices.length === 0 ? (
          <EmptyState text="Nuk ka të dhëna." />
        ) : (
          <div className="space-y-3">
            {stats.topServices.map(({ service, count }) => {
              const max = stats.topServices[0].count;
              return (
                <div key={service}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
                    <span>{service}</span>
                    <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
                    <div
                      className="h-2 rounded-full bg-accent/50"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
