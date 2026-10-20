"use client";

import { useState } from "react";
import {
  QUOTE_KIND_LABELS,
  formatMoney,
  quoteTotals,
  type QuoteRecord,
} from "@/lib/quotes";
import { ClientDocFooter, ClientDocHeader, ClientDocShell, docLabel } from "@/components/ClientDocShell";

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function QuotePublicView({ quote, token }: { quote: QuoteRecord; token: string }) {
  const [status, setStatus] = useState(quote.status);
  const [showDecline, setShowDecline] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const kindLabel = QUOTE_KIND_LABELS[quote.kind];
  const canRespond = quote.kind === "quote" && (status === "draft" || status === "sent");

  const respond = async (action: "accept" | "decline") => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/oferta/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setShowDecline(false);
      } else {
        setError(data.error ?? "Diçka shkoi keq. Provoni sërish.");
      }
    } catch {
      setError("Gabim lidhjeje. Provoni sërish.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ClientDocShell>
      <ClientDocHeader
        eyebrow={`Nr. ${quote.number}`}
        title={kindLabel}
        aside={
          <button
            type="button"
            onClick={() => window.print()}
            className="ip-no-print inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white/80 transition-colors hover:border-accent/60 hover:text-accentLight"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-[1.6]" aria-hidden>
              <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12.5h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Shkarko PDF
          </button>
        }
      />

      {/* Meta */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className={docLabel}>Për</p>
          <p className="mt-2 text-[17px] font-semibold text-white">{quote.client_name}</p>
          {quote.client_business && <p className="mt-0.5 text-[15px] text-white/70">{quote.client_business}</p>}
        </div>
        <div className="sm:text-right">
          <p className={docLabel}>Data</p>
          <p className="mt-2 text-[15px] text-white/85">{formatDay(quote.issued_at)}</p>
          {quote.due_at && (
            <p className="mt-1 text-[14px] text-white/65">
              {quote.kind === "invoice" ? "Afati i pagesës" : "E vlefshme deri"}: {formatDay(quote.due_at)}
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className={`${docLabel} px-4 py-3.5 text-left`}>Përshkrimi</th>
              <th className={`${docLabel} px-4 py-3.5 text-center`}>Sasia</th>
              <th className={`${docLabel} hidden px-4 py-3.5 text-right sm:table-cell`}>Çmimi</th>
              <th className={`${docLabel} px-4 py-3.5 text-right`}>Totali</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((it, i) => (
              <tr key={i} className="border-t border-white/[0.06] first:border-t-0">
                <td className="px-4 py-3.5 leading-snug text-white/90">{it.description}</td>
                <td className="px-4 py-3.5 text-center tabular-nums text-white/70">{it.qty}</td>
                <td className="hidden px-4 py-3.5 text-right tabular-nums text-white/70 sm:table-cell">{formatMoney(it.price)}</td>
                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-white">{formatMoney(it.qty * it.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-white/10 px-4 py-5 text-[15px]">
          <div className="ml-auto max-w-[300px] space-y-2 tabular-nums">
            <div className="flex justify-between text-white/70">
              <span>Nëntotali</span>
              <span>{formatMoney(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-white/70">
                <span>Zbritje</span>
                <span>-{formatMoney(totals.discount)}</span>
              </div>
            )}
            {quote.tax_rate > 0 && (
              <div className="flex justify-between text-white/70">
                <span>TVSH ({quote.tax_rate}%)</span>
                <span>{formatMoney(totals.tax)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-accent/50 pt-3">
              <span className="font-semibold text-white">Totali</span>
              <span className="font-display text-[1.6rem] font-bold text-accent">{formatMoney(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-surface px-5 py-5">
          <p className={docLabel}>Shënime</p>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/80">{quote.notes}</p>
        </div>
      )}

      {/* Status / actions */}
      <div className="mt-10">
        {status === "accepted" || status === "paid" ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-6 py-6 text-center">
            <p className="text-lg font-semibold text-emerald-300">
              {status === "paid" ? "✓ Fatura është paguar" : "✓ Oferta u pranua"}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">
              Faleminderit për besimin! Do t&apos;ju kontaktojmë shumë shpejt për hapat e radhës.
            </p>
          </div>
        ) : status === "rejected" ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-center">
            <p className="text-base font-semibold text-white/85">Oferta u refuzua.</p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">
              Nëse ndryshoni mendje ose doni një ofertë të përshtatur, na shkruani — gjejmë zgjidhje bashkë.
            </p>
          </div>
        ) : canRespond ? (
          <div className="ip-no-print rounded-2xl border border-accent/30 bg-accent/5 px-6 py-7">
            <p className="text-center text-[16px] font-medium text-white/85">
              A dëshironi të vazhdojmë me këtë ofertë?
            </p>
            {showDecline ? (
              <div className="mt-5">
                <label htmlFor="decline-note" className={docLabel}>Arsyeja (opsionale)</label>
                <textarea
                  id="decline-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Na tregoni arsyen ose çfarë do të donit ndryshe"
                  className="mt-2 w-full resize-none rounded-[10px] border border-white/15 bg-bg px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent/60"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => respond("decline")}
                    disabled={busy}
                    className="flex-1 rounded-full border border-red-400/50 px-6 py-3 text-[15px] font-semibold text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                  >
                    {busy ? "Duke dërguar…" : "Konfirmo refuzimin"}
                  </button>
                  <button
                    onClick={() => setShowDecline(false)}
                    disabled={busy}
                    className="flex-1 rounded-full border border-white/20 px-6 py-3 text-[15px] text-white/75 transition-colors hover:text-white"
                  >
                    Kthehu
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => respond("accept")}
                  disabled={busy}
                  className="flex-1 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold uppercase tracking-[0.08em] text-bg transition-all hover:bg-accentLight disabled:opacity-50"
                >
                  {busy ? "Duke dërguar…" : "Pranoj ofertën ✓"}
                </button>
                <button
                  onClick={() => setShowDecline(true)}
                  disabled={busy}
                  className="flex-1 rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white/75 transition-colors hover:border-white/40 hover:text-white"
                >
                  Refuzoj
                </button>
              </div>
            )}
            {error && <p className="mt-3 text-center text-[14px] text-red-400" role="alert">{error}</p>}
            {/* Garancia (2026-10-20) — e njëjta si te /cmimet dhe te kontakti */}
            <p className="mt-5 text-center text-[13px] leading-relaxed text-white/60">
              🛡 Për projektet me dizajn: nëse dizajni i parë nuk ju pëlqen pas 2 raundesh ndryshimesh, ju kthejmë paradhënien 100%.
            </p>
          </div>
        ) : null}
      </div>

      <ClientDocFooter />
    </ClientDocShell>
  );
}
