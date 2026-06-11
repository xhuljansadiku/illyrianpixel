"use client";

import { useState } from "react";
import {
  QUOTE_KIND_LABELS,
  formatMoney,
  quoteTotals,
  type QuoteRecord,
} from "@/lib/quotes";

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
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white md:py-20">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-accent/60 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/70">Illyrian Pixel</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/35">Agjenci Dixhitale Premium</p>
          </div>
          <div className="text-right">
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-accent">{kindLabel}</h1>
            <p className="mt-1 text-sm text-white/60">{quote.number}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap justify-between gap-6 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Për</p>
            <p className="mt-1.5 font-semibold text-white">{quote.client_name}</p>
            {quote.client_business && <p className="text-white/55">{quote.client_business}</p>}
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Data</p>
            <p className="mt-1.5 text-white/75">{formatDay(quote.issued_at)}</p>
            {quote.due_at && (
              <p className="mt-1 text-white/45">
                {quote.kind === "invoice" ? "Afati i pagesës" : "E vlefshme deri"}: {formatDay(quote.due_at)}
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#101010]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#151515] text-[10px] uppercase tracking-[0.14em] text-white/35">
                <th className="px-4 py-3 text-left font-semibold">Përshkrimi</th>
                <th className="px-4 py-3 text-center font-semibold">Sasia</th>
                <th className="hidden px-4 py-3 text-right font-semibold sm:table-cell">Çmimi</th>
                <th className="px-4 py-3 text-right font-semibold">Totali</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((it, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white/85">{it.description}</td>
                  <td className="px-4 py-3 text-center text-white/55">{it.qty}</td>
                  <td className="hidden px-4 py-3 text-right text-white/55 sm:table-cell">{formatMoney(it.price)}</td>
                  <td className="px-4 py-3 text-right text-white">{formatMoney(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-white/10 px-4 py-4 text-sm">
            <div className="ml-auto max-w-[260px] space-y-1.5">
              <div className="flex justify-between text-white/50">
                <span>Nëntotali</span>
                <span>{formatMoney(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-white/50">
                  <span>Zbritje</span>
                  <span>-{formatMoney(totals.discount)}</span>
                </div>
              )}
              {quote.tax_rate > 0 && (
                <div className="flex justify-between text-white/50">
                  <span>TVSH ({quote.tax_rate}%)</span>
                  <span>{formatMoney(totals.tax)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-accent/40 pt-2 text-base font-bold text-accent">
                <span>Totali</span>
                <span>{formatMoney(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mt-6 whitespace-pre-line rounded-xl border border-white/8 bg-[#0e0d0a] px-5 py-4 text-sm leading-relaxed text-white/55">
            {quote.notes}
          </div>
        )}

        {/* Status / actions */}
        <div className="mt-10">
          {status === "accepted" || status === "paid" ? (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-6 py-5 text-center">
              <p className="text-lg font-semibold text-emerald-300">
                {status === "paid" ? "✓ Fatura është paguar" : "✓ Oferta u pranua"}
              </p>
              <p className="mt-2 text-sm text-white/55">
                Faleminderit për besimin! Do t&apos;ju kontaktojmë shumë shpejt për hapat e radhës.
              </p>
            </div>
          ) : status === "rejected" ? (
            <div className="rounded-xl border border-white/10 bg-white/3 px-6 py-5 text-center">
              <p className="text-base font-semibold text-white/70">Oferta u refuzua.</p>
              <p className="mt-2 text-sm text-white/45">
                Nëse ndryshoni mendje ose doni një ofertë të përshtatur, na shkruani — gjejmë zgjidhje bashkë.
              </p>
            </div>
          ) : canRespond ? (
            <div className="rounded-xl border border-accent/25 bg-accent/5 px-6 py-6">
              <p className="text-center text-sm text-white/65">
                A dëshironi të vazhdojmë me këtë ofertë?
              </p>
              {showDecline ? (
                <div className="mt-4">
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Na tregoni arsyen ose çfarë do të donit ndryshe (ops.)"
                    className="w-full resize-none rounded-lg border border-white/12 bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent/60"
                  />
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => respond("decline")}
                      disabled={busy}
                      className="flex-1 rounded-full border border-red-400/40 px-6 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                    >
                      {busy ? "Duke dërguar…" : "Konfirmo refuzimin"}
                    </button>
                    <button
                      onClick={() => setShowDecline(false)}
                      disabled={busy}
                      className="flex-1 rounded-full border border-white/15 px-6 py-3 text-sm text-white/60 transition-colors hover:text-white"
                    >
                      Kthehu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => respond("accept")}
                    disabled={busy}
                    className="flex-1 rounded-full bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition-all hover:shadow-[0_0_24px_rgba(171,131,57,0.45)] disabled:opacity-50"
                  >
                    {busy ? "Duke dërguar…" : "Pranoj ofertën ✓"}
                  </button>
                  <button
                    onClick={() => setShowDecline(true)}
                    disabled={busy}
                    className="flex-1 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Refuzoj
                  </button>
                </div>
              )}
              {error && <p className="mt-3 text-center text-sm text-red-400/85">{error}</p>}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/30">
          <span>illyrianpixel.com · info@illyrianpixel.com</span>
          <span>Faleminderit për besimin!</span>
        </div>
      </div>
    </main>
  );
}
