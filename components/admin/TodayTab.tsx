"use client";

// "Sot" (2026-11-02) — faqja e parë e panelit, ndërtuar rreth pyetjes së pronarit:
// "Çfarë duhet të bëj sot dhe a po hyjnë paratë?". Çdo rresht veprimi hap pikërisht
// atë element; asnjë numër që s'të thotë çfarë të bësh. Zëvendëson "Përmbledhjen"
// (OverviewTab në AdminDashboard, ruajtur pa u përdorur).

import { useEffect, useMemo, useState } from "react";
import type { Contact } from "@/components/AdminDashboard";
import type { QuoteRecord } from "@/lib/quotes";
import { quoteTotals, formatMoney } from "@/lib/quotes";
import type { ProjectRecord } from "@/lib/projects";
import { CARD, formatSq, localIsoDate } from "@/components/admin/ui";
import { AdminIcon, type AdminIconName } from "@/components/admin/icons";

type Tone = "red" | "yellow" | "green";

type Action = {
  key: string;
  tone: Tone;
  icon: AdminIconName;
  title: string;
  detail: string;
  cta: string;
  onRun: () => void;
  // Për renditjen brenda së njëjtës ngjyrë: më e vjetra/më urgjentja e para
  sortAt: string;
};

const TONE_ORDER: Record<Tone, number> = { red: 0, yellow: 1, green: 2 };

const TONE_DOT: Record<Tone, string> = {
  red: "bg-red-400",
  yellow: "bg-amber-400",
  green: "bg-emerald-400",
};

const DAY_MS = 86400000;

function daysBetween(fromIso: string, to = Date.now()) {
  return Math.floor((to - new Date(fromIso).getTime()) / DAY_MS);
}

function hoursSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
}

// Rasa rrjedhore pas "para"/"prej": "para 3 ditësh", "prej 1 ore"
function ago(iso: string) {
  const h = hoursSince(iso);
  if (h < 1) return "pak minutash";
  if (h < 24) return h === 1 ? "1 ore" : `${h} orësh`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 dite" : `${d} ditësh`;
}

function docTotal(q: QuoteRecord) {
  return quoteTotals(q.items, q.discount, q.tax_rate).total;
}

function monthKey(iso: string) {
  return localIsoDate(new Date(iso)).slice(0, 7);
}

export default function TodayTab({
  contacts,
  quotes,
  projects,
  onOpenContact,
  onOpenQuote,
  onOpenProject,
  onGoTo,
}: {
  contacts: Contact[];
  quotes: QuoteRecord[];
  projects: ProjectRecord[];
  onOpenContact: (term: string) => void;
  onOpenQuote: (term: string) => void;
  onOpenProject: (term: string) => void;
  onGoTo: (tab: "blog" | "subscribers" | "contacts" | "quotes" | "finances") => void;
}) {
  // Përshëndetja dhe data llogariten vetëm në shfletues (serveri punon në UTC → hydration mismatch)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const today = localIsoDate();

  const actions = useMemo<Action[]>(() => {
    const list: Action[] = [];
    const in3Days = localIsoDate(new Date(Date.now() + 3 * DAY_MS));

    for (const c of contacts) {
      const status = c.status || "new";
      if (status === "done") continue;

      // Kërkesë e re që s'është hapur ende — përgjigja e shpejtë fiton klientin
      if (status === "new" && !c.viewed_at) {
        const hours = hoursSince(c.created_at);
        list.push({
          key: `c-new-${c.id}`,
          tone: hours >= 24 ? "red" : "yellow",
          icon: "inbox",
          title: `${c.name} pret përgjigje`,
          detail: `${c.service || "Kërkesë e re"} · prej ${ago(c.created_at)}`,
          cta: "Përgjigju",
          onRun: () => onOpenContact(c.email),
          sortAt: c.created_at,
        });
        continue;
      }

      // Kujtesë e planifikuar që ka ardhur
      if (c.follow_up_date && c.follow_up_date <= today) {
        const late = c.follow_up_date < today;
        list.push({
          key: `c-fu-${c.id}`,
          tone: late ? "red" : "yellow",
          icon: "clock",
          title: `Kujtesë: ${c.name}`,
          detail: late ? `E planifikuar më ${formatSq(c.follow_up_date)} · e vonuar` : "E planifikuar për sot",
          cta: "Hap",
          onRun: () => onOpenContact(c.email),
          sortAt: c.follow_up_date,
        });
      }
    }

    for (const q of quotes) {
      if (q.kind === "quote") {
        // Oferta e hapur nga klienti por pa përgjigje — sinjali më i fortë i shitjes
        if (q.status === "sent" && q.viewed_at && daysBetween(q.viewed_at) >= 2) {
          const views = q.view_count ?? 1;
          list.push({
            key: `q-viewed-${q.id}`,
            tone: "yellow",
            icon: "receipt",
            title: `${q.client_name} e pa ofertën${views > 1 ? ` ${views}×` : ""}, pa përgjigje`,
            detail: `${q.number} · ${formatMoney(docTotal(q))} · hapur para ${ago(q.viewed_at)}`,
            cta: "Kujto klientin",
            onRun: () => onOpenQuote(q.number),
            sortAt: q.viewed_at,
          });
        } else if (q.status === "sent" && !q.viewed_at && daysBetween(q.updated_at) >= 4) {
          list.push({
            key: `q-unseen-${q.id}`,
            tone: "yellow",
            icon: "receipt",
            title: `${q.client_name} s'e ka hapur ofertën`,
            detail: `${q.number} · dërguar para ${ago(q.updated_at)} — ndoshta një mesazh në WhatsApp?`,
            cta: "Hap",
            onRun: () => onOpenQuote(q.number),
            sortAt: q.updated_at,
          });
        }

        // Lajm i mirë: ofertë e pranuar në 7 ditët e fundit
        if (q.status === "accepted" && q.accepted_at && daysBetween(q.accepted_at) <= 7) {
          list.push({
            key: `q-won-${q.id}`,
            tone: "green",
            icon: "check",
            title: `${q.client_name} e pranoi ofertën`,
            detail: `${q.number} · ${formatMoney(docTotal(q))} · projekti u hap automatikisht`,
            cta: "Shiko",
            onRun: () => onOpenQuote(q.number),
            sortAt: q.accepted_at,
          });
        }
        continue;
      }

      // Fatura e dërguar, e papaguar
      if (q.status === "draft" || q.status === "paid" || q.status === "rejected" || !q.due_at) continue;
      if (q.due_at < today) {
        list.push({
          key: `i-late-${q.id}`,
          tone: "red",
          icon: "wallet",
          title: `Fatura ${q.number} e vonuar ${daysBetween(`${q.due_at}T00:00:00`)} ditë`,
          detail: `${q.client_name} · ${formatMoney(docTotal(q))}`,
          cta: "Dërgo kujtesë",
          onRun: () => onOpenQuote(q.number),
          sortAt: q.due_at,
        });
      } else if (q.due_at <= in3Days) {
        list.push({
          key: `i-soon-${q.id}`,
          tone: "yellow",
          icon: "wallet",
          title: `Fatura ${q.number} skadon ${q.due_at === today ? "sot" : `më ${formatSq(q.due_at)}`}`,
          detail: `${q.client_name} · ${formatMoney(docTotal(q))}`,
          cta: "Hap",
          onRun: () => onOpenQuote(q.number),
          sortAt: q.due_at,
        });
      }
    }

    for (const p of projects) {
      if (p.status === "done" || !p.deadline || p.deadline > in3Days) continue;
      const late = p.deadline < today;
      list.push({
        key: `p-${p.id}`,
        tone: late ? "red" : "yellow",
        icon: "folder",
        title: `Projekti "${p.name}" ${late ? "e ka kaluar afatin" : p.deadline === today ? "ka afatin sot" : `ka afatin më ${formatSq(p.deadline)}`}`,
        detail: p.client_name ? `${p.client_name}` : "Pa klient të lidhur",
        cta: "Hap",
        onRun: () => onOpenProject(p.name),
        sortAt: p.deadline,
      });
    }

    return list.sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone] || (a.sortAt < b.sortAt ? -1 : 1));
  }, [contacts, quotes, projects, today, onOpenContact, onOpenQuote, onOpenProject]);

  const money = useMemo(() => {
    const thisMonth = today.slice(0, 7);
    const prev = new Date();
    prev.setDate(1);
    prev.setMonth(prev.getMonth() - 1);
    const prevMonth = localIsoDate(prev).slice(0, 7);

    let collected = 0;
    let collectedPrev = 0;
    let pending = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let open = 0;
    let openCount = 0;

    for (const q of quotes) {
      const total = docTotal(q);
      if (q.kind === "invoice") {
        // Si te Financat: fatura e paguar llogaritet në muajin kur u shënua "Paguar"
        if (q.status === "paid") {
          const m = monthKey(q.updated_at);
          if (m === thisMonth) collected += total;
          else if (m === prevMonth) collectedPrev += total;
        } else if (q.status === "sent" || q.status === "accepted") {
          pending += total;
          pendingCount++;
          if (q.due_at && q.due_at < today) overdueCount++;
        }
      } else if (q.status === "sent") {
        open += total;
        openCount++;
      }
    }

    const trend = collectedPrev > 0 ? Math.round(((collected - collectedPrev) / collectedPrev) * 100) : null;
    return { collected, trend, pending, pendingCount, overdueCount, open, openCount };
  }, [quotes, today]);

  // Rruga e klientit, 90 ditët e fundit: kërkesë → ofertë → fituar → paguar
  const path = useMemo(() => {
    const since = Date.now() - 90 * DAY_MS;
    const recent = (iso: string | null | undefined) => !!iso && new Date(iso).getTime() >= since;
    const leads = contacts.filter((c) => recent(c.created_at)).length;
    const offers = quotes.filter((q) => q.kind === "quote" && q.status !== "draft" && recent(q.created_at));
    const won = offers.filter((q) => q.status === "accepted" || q.status === "paid").length;
    const lost = offers.filter((q) => q.status === "rejected").length;
    const paid = quotes.filter((q) => q.kind === "invoice" && q.status === "paid" && recent(q.updated_at)).length;
    return { leads, offers: offers.length, won, lost, paid };
  }, [contacts, quotes]);

  const activity = useMemo(() => {
    const items: { key: string; at: string; text: string; onRun: () => void }[] = [];
    for (const c of contacts) {
      items.push({
        key: `c-${c.id}`,
        at: c.created_at,
        text: `Kërkesë e re nga ${c.name}${c.service ? ` · ${c.service}` : ""}`,
        onRun: () => onOpenContact(c.email),
      });
    }
    for (const q of quotes) {
      if (q.viewed_at) items.push({ key: `qv-${q.id}`, at: q.viewed_at, text: `${q.client_name} hapi ${q.number}`, onRun: () => onOpenQuote(q.number) });
      if (q.accepted_at) items.push({ key: `qa-${q.id}`, at: q.accepted_at, text: `${q.client_name} pranoi ${q.number}`, onRun: () => onOpenQuote(q.number) });
      if (q.declined_at) items.push({ key: `qd-${q.id}`, at: q.declined_at, text: `${q.client_name} refuzoi ${q.number}`, onRun: () => onOpenQuote(q.number) });
      if (q.kind === "invoice" && q.status === "paid") {
        items.push({ key: `qp-${q.id}`, at: q.updated_at, text: `${q.number} u pagua · ${formatMoney(docTotal(q))}`, onRun: () => onOpenQuote(q.number) });
      }
    }
    return items.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 6);
  }, [contacts, quotes, onOpenContact, onOpenQuote]);

  const hour = now?.getHours() ?? 12;
  const greeting = hour < 12 ? "Mirëmëngjes" : hour < 18 ? "Mirëdita" : "Mirëmbrëma";
  const redCount = actions.filter((a) => a.tone === "red").length;

  return (
    <div className="space-y-5">
      {/* Përshëndetja + përmbledhja me një fjali */}
      <div>
        <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.5)]">
          {now ? formatSq(now, "weekday-date") : " "}
        </p>
        <h3 className="mt-1 font-display text-[1.35rem] font-bold text-[var(--a-text)]">
          {greeting}.{" "}
          <span className="text-[rgb(var(--a-text-rgb)/0.6)]">
            {actions.length === 0
              ? "Asgjë urgjente sot."
              : redCount > 0
                ? `${redCount} gjë${redCount === 1 ? "" : "ra"} kërko${redCount === 1 ? "n" : "jnë"} vëmendje tani.`
                : `${actions.length} gjë${actions.length === 1 ? "" : "ra"} për sot.`}
          </span>
        </h3>
      </div>

      {/* PËR T'U BËRË SOT */}
      <section className={CARD + " p-5"} aria-labelledby="today-actions">
        <h4 id="today-actions" className="mb-3 text-[13px] font-semibold text-[var(--a-text)]">
          Për t&apos;u bërë sot
        </h4>
        {actions.length === 0 ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-4">
            <p className="text-[14px] font-semibold text-emerald-300">Gjithçka në rregull — asnjë kërkesë, faturë apo afat që pret.</p>
            <p className="mt-1.5 text-[13px] text-[rgb(var(--a-text-rgb)/0.55)]">Koha e mirë për diçka që sjell klientë:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => onGoTo("blog")} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] text-[var(--a-text)] transition-colors hover:border-accent/50">
                Shkruaj një artikull
              </button>
              <button onClick={() => onGoTo("subscribers")} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] text-[var(--a-text)] transition-colors hover:border-accent/50">
                Dërgo një newsletter
              </button>
              <button onClick={() => onGoTo("quotes")} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] text-[var(--a-text)] transition-colors hover:border-accent/50">
                Përgatit një ofertë
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--a-border)]">
            {actions.map((a) => (
              <li key={a.key} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                <span className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[a.tone]}`} aria-hidden />
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--a-text-rgb)/0.05)] text-[rgb(var(--a-text-rgb)/0.6)]">
                  <AdminIcon name={a.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--a-text)]">{a.title}</p>
                  <p className="truncate text-[12.5px] text-[rgb(var(--a-text-rgb)/0.5)]">{a.detail}</p>
                </div>
                <button
                  onClick={a.onRun}
                  className={`font-ui shrink-0 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    a.tone === "red"
                      ? "border-red-400/40 text-red-300 hover:bg-red-400/10"
                      : a.tone === "green"
                        ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
                        : "border-[var(--a-border)] text-[var(--a-text)] hover:border-accent/50"
                  }`}
                >
                  {a.cta}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* PARATË */}
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Paratë këtë muaj">
        <button onClick={() => onGoTo("finances")} className={CARD + " p-5 text-left transition-colors hover:border-accent/40"}>
          <p className="text-[12.5px] text-[rgb(var(--a-text-rgb)/0.55)]">Arkëtuar këtë muaj</p>
          <p className="mt-1.5 font-display text-[1.7rem] font-bold leading-none text-accent tabular-nums">{formatMoney(money.collected)}</p>
          <p className="mt-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">
            {money.trend === null ? "Pa krahasim me muajin e kaluar" : `${money.trend >= 0 ? "▲" : "▼"} ${Math.abs(money.trend)}% nga muaji i kaluar`}
          </p>
        </button>
        <button onClick={() => onGoTo("quotes")} className={CARD + " p-5 text-left transition-colors hover:border-accent/40"}>
          <p className="text-[12.5px] text-[rgb(var(--a-text-rgb)/0.55)]">Pritet të paguhet</p>
          <p className="mt-1.5 font-display text-[1.7rem] font-bold leading-none text-[var(--a-text)] tabular-nums">{formatMoney(money.pending)}</p>
          <p className={`mt-2 text-[12px] ${money.overdueCount > 0 ? "text-red-300" : "text-[rgb(var(--a-text-rgb)/0.45)]"}`}>
            {money.pendingCount === 0
              ? "Asnjë faturë e hapur"
              : `${money.pendingCount} fatur${money.pendingCount === 1 ? "ë" : "a"}${money.overdueCount > 0 ? ` · ${money.overdueCount} e vonuar` : ""}`}
          </p>
        </button>
        <button onClick={() => onGoTo("quotes")} className={CARD + " p-5 text-left transition-colors hover:border-accent/40"}>
          <p className="text-[12.5px] text-[rgb(var(--a-text-rgb)/0.55)]">Në oferta të hapura</p>
          <p className="mt-1.5 font-display text-[1.7rem] font-bold leading-none text-[var(--a-text)] tabular-nums">{formatMoney(money.open)}</p>
          <p className="mt-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">
            {money.openCount === 0 ? "Asnjë ofertë në pritje" : `${money.openCount} ofert${money.openCount === 1 ? "ë" : "a"} në pritje të përgjigjes`}
          </p>
        </button>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* RRUGA E KLIENTIT */}
        <section className={CARD + " p-5"} aria-labelledby="today-path">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h4 id="today-path" className="text-[13px] font-semibold text-[var(--a-text)]">Rruga e klientit</h4>
            <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">90 ditët e fundit</span>
          </div>
          <ol className="grid grid-cols-4 gap-2">
            {[
              { label: "Kërkesa", value: path.leads, onRun: () => onGoTo("contacts") },
              { label: "Oferta", value: path.offers, onRun: () => onGoTo("quotes") },
              { label: "Fituar", value: path.won, onRun: () => onGoTo("quotes") },
              { label: "Paguar", value: path.paid, onRun: () => onGoTo("finances") },
            ].map((step, i, arr) => {
              const prevValue = i > 0 ? arr[i - 1].value : null;
              const rate = prevValue ? Math.round((step.value / prevValue) * 100) : null;
              return (
                <li key={step.label}>
                  <button onClick={step.onRun} className="w-full rounded-xl border border-[var(--a-border)] px-2 py-3 text-center transition-colors hover:border-accent/40">
                    <span className="block font-display text-[1.4rem] font-bold leading-none text-[var(--a-text)] tabular-nums">{step.value}</span>
                    <span className="mt-1.5 block text-[12px] text-[rgb(var(--a-text-rgb)/0.55)]">{step.label}</span>
                  </button>
                  <p className="mt-1.5 h-4 text-center text-[11.5px] text-[rgb(var(--a-text-rgb)/0.4)]">{rate !== null ? `${rate}%` : ""}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[12.5px] text-[rgb(var(--a-text-rgb)/0.5)]">
            {path.lost > 0
              ? `${path.lost} ofert${path.lost === 1 ? "ë" : "a"} u refuzu${path.lost === 1 ? "a" : "an"}.`
              : path.offers > 0
                ? "Asnjë ofertë e refuzuar."
                : "Kur të dërgosh oferta, këtu shfaqet sa prej tyre bëhen klientë."}
          </p>
        </section>

        {/* AKTIVITETI */}
        <section className={CARD + " p-5"} aria-labelledby="today-activity">
          <h4 id="today-activity" className="mb-3 text-[13px] font-semibold text-[var(--a-text)]">Aktiviteti i fundit</h4>
          {activity.length === 0 ? (
            <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.5)]">Ende pa aktivitet. Kërkesat e reja dhe ofertat e hapura nga klientët shfaqen këtu.</p>
          ) : (
            <ul className="space-y-1">
              {activity.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={item.onRun}
                    className="flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)]"
                  >
                    <span className="min-w-0 truncate text-[13.5px] text-[rgb(var(--a-text-rgb)/0.8)]">{item.text}</span>
                    <span className="shrink-0 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">{formatSq(item.at, "day-time")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
