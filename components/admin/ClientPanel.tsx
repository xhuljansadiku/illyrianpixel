"use client";

// Faqja e klientit (2026-11-02) — panel anësor me historinë e plotë të një klienti:
// projektet, ofertat/faturat, kërkesa e parë dhe shënimet. Më parë këto ishin të
// shpërndara në 4–5 tab-e dhe duhej t'i bashkoje vetë.

import { useEffect, useRef } from "react";
import type { Contact } from "@/components/AdminDashboard";
import { QUOTE_KIND_LABELS, QUOTE_STATUS_LABELS, formatMoney, quoteTotals, type QuoteRecord } from "@/lib/quotes";
import { PROJECT_PHASE_LABELS, PROJECT_STATUS_LABELS, type ProjectRecord } from "@/lib/projects";
import { formatSq } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/icons";

export type ClientPanelData = {
  name: string;
  business: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  notes: string | null;
  since: string;
  contact: Contact | null;
  projects: ProjectRecord[];
  docs: QuoteRecord[];
  paidTotal: number;
  pendingTotal: number;
  recurringMonthly: number;
};

const DOC_STATUS_TONE: Record<QuoteRecord["status"], string> = {
  draft: "text-[rgb(var(--a-text-rgb)/0.5)]",
  sent: "text-amber-300",
  accepted: "text-emerald-300",
  rejected: "text-red-300",
  paid: "text-emerald-300",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-2 mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--a-text-rgb)/0.45)]">{children}</h4>;
}

export default function ClientPanel({
  client,
  onClose,
  onOpenProject,
  onOpenQuote,
  onOpenContact,
  onEdit,
  onCopyPortal,
  portalCopied,
}: {
  client: ClientPanelData;
  onClose: () => void;
  onOpenProject: (name: string) => void;
  onOpenQuote: (number: string) => void;
  onOpenContact: (email: string) => void;
  onEdit: () => void;
  onCopyPortal: () => void;
  portalCopied: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const whatsapp = client.phone ? `https://wa.me/${client.phone.replace(/[^\d]/g, "")}` : null;
  const docs = [...client.docs].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <div className="fixed inset-0 z-[105]">
      <div className="absolute inset-0 bg-black/55 animate-[fadeIn_0.15s_ease-out]" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-panel-title"
        className="animate-drawer-in-right absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-[var(--a-border)] bg-[var(--a-card)] shadow-2xl backdrop-blur-[12px]"
      >
        {/* Header */}
        <div className="border-b border-[var(--a-border)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 id="client-panel-title" className="truncate font-display text-[1.35rem] font-bold text-[var(--a-text)]">
                {client.name}
              </h3>
              <p className="mt-0.5 text-[13px] text-[rgb(var(--a-text-rgb)/0.55)]">
                {[client.business, client.service].filter(Boolean).join(" · ") || "—"}
              </p>
              <p className="mt-1 text-[12.5px] text-[rgb(var(--a-text-rgb)/0.45)]">Klient që nga {formatSq(client.since, "month-year")}</p>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Mbyll"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="font-ui rounded-lg border border-emerald-400/35 px-3 py-1.5 text-[13px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/10">
                WhatsApp
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] font-semibold text-[var(--a-text)] transition-colors hover:border-accent/50">
                Email
              </a>
            )}
            {client.contact?.portal_token && (
              <button onClick={onCopyPortal} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] font-semibold text-[var(--a-text)] transition-colors hover:border-accent/50">
                {portalCopied ? "✓ U kopjua" : "Linku i portalit"}
              </button>
            )}
            <button onClick={onEdit} className="font-ui rounded-lg border border-[var(--a-border)] px-3 py-1.5 text-[13px] font-semibold text-[var(--a-text)] transition-colors hover:border-accent/50">
              Redakto
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pt-1">
          {/* Paratë */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-[var(--a-border)] p-3">
              <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">Paguar</p>
              <p className="mt-1 font-display text-[1.15rem] font-bold text-emerald-300 tabular-nums">{formatMoney(client.paidTotal)}</p>
            </div>
            <div className="rounded-xl border border-[var(--a-border)] p-3">
              <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">Pritet</p>
              <p className="mt-1 font-display text-[1.15rem] font-bold text-[var(--a-text)] tabular-nums">{formatMoney(client.pendingTotal)}</p>
            </div>
            <div className="rounded-xl border border-[var(--a-border)] p-3">
              <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">Mujore</p>
              <p className="mt-1 font-display text-[1.15rem] font-bold text-accent tabular-nums">
                {client.recurringMonthly > 0 ? formatMoney(client.recurringMonthly) : "—"}
              </p>
            </div>
          </div>

          {/* Projektet */}
          <SectionTitle>Projektet ({client.projects.length})</SectionTitle>
          {client.projects.length === 0 ? (
            <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.5)]">Asnjë projekt ende.</p>
          ) : (
            <ul className="space-y-2">
              {client.projects.map((p) => {
                const done = p.tasks?.filter((t) => t.done).length ?? 0;
                const total = p.tasks?.length ?? 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : null;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => onOpenProject(p.name)}
                      className="w-full rounded-xl border border-[var(--a-border)] p-3 text-left transition-colors hover:border-accent/40"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[14px] font-medium text-[var(--a-text)]">{p.name}</span>
                        <span className="shrink-0 text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
                          {PROJECT_STATUS_LABELS[p.status]} · {PROJECT_PHASE_LABELS[p.phase]}
                        </span>
                      </div>
                      {pct !== null && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--a-text-rgb)/0.08)]">
                            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[12px] tabular-nums text-[rgb(var(--a-text-rgb)/0.5)]">{pct}%</span>
                        </div>
                      )}
                      {p.deadline && <p className="mt-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">Afati: {formatSq(p.deadline, "long")}</p>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Ofertat & faturat */}
          <SectionTitle>Ofertat & faturat ({docs.length})</SectionTitle>
          {docs.length === 0 ? (
            <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.5)]">Asnjë ofertë apo faturë.</p>
          ) : (
            <ul className="divide-y divide-[var(--a-border)] rounded-xl border border-[var(--a-border)]">
              {docs.map((q) => (
                <li key={q.id}>
                  <button onClick={() => onOpenQuote(q.number)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.04)]">
                    <span className="min-w-0">
                      <span className="block text-[13.5px] text-[var(--a-text)]">
                        {q.number} <span className="text-[rgb(var(--a-text-rgb)/0.45)]">· {QUOTE_KIND_LABELS[q.kind]}</span>
                      </span>
                      <span className="block text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">{formatSq(q.issued_at)}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[13.5px] font-semibold tabular-nums text-[var(--a-text)]">
                        {formatMoney(quoteTotals(q.items, q.discount, q.tax_rate).total)}
                      </span>
                      <span className={`block text-[12px] ${DOC_STATUS_TONE[q.status]}`}>{QUOTE_STATUS_LABELS[q.status]}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Kërkesa e parë */}
          {client.contact && (
            <>
              <SectionTitle>Kërkesa e parë</SectionTitle>
              <button
                onClick={() => onOpenContact(client.contact!.email)}
                className="w-full rounded-xl border border-[var(--a-border)] p-3 text-left transition-colors hover:border-accent/40"
              >
                <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">
                  {formatSq(client.contact.created_at, "long")}
                  {client.contact.budget ? ` · Buxheti: ${client.contact.budget}` : ""}
                </p>
                <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-[13.5px] text-[rgb(var(--a-text-rgb)/0.8)]">
                  {client.contact.message || "—"}
                </p>
              </button>
            </>
          )}

          {/* Shënime */}
          <SectionTitle>Shënime</SectionTitle>
          {client.notes ? (
            <p className="whitespace-pre-wrap rounded-xl border border-[var(--a-border)] p-3 text-[13.5px] text-[rgb(var(--a-text-rgb)/0.8)]">{client.notes}</p>
          ) : (
            <button onClick={onEdit} className="flex items-center gap-2 text-[13px] text-[rgb(var(--a-text-rgb)/0.55)] hover:text-accent">
              <AdminIcon name="plus" className="h-3.5 w-3.5" /> Shto një shënim për këtë klient
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
