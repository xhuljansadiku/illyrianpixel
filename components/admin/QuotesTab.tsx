"use client";

import { useEffect, useMemo, useState } from "react";
import {
  QUOTE_KIND_LABELS,
  QUOTE_STATUS_LABELS,
  formatMoney,
  quotePublicUrl,
  quoteTotals,
  type QuoteItem,
  type QuoteRecord,
  type RecurringInvoice,
} from "@/lib/quotes";
import RecurringInvoices from "@/components/admin/RecurringInvoices";
import { QUOTE_TEMPLATES } from "@/lib/quoteTemplates";

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[var(--a-border)] bg-[var(--a-card)] backdrop-blur-[12px]";

const INPUT =
  "font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent";

const STATUS_COLORS: Record<QuoteRecord["status"], string> = {
  draft: "border-[rgb(var(--a-text-rgb)/0.2)] bg-[rgb(var(--a-text-rgb)/0.05)] text-[rgb(var(--a-text-rgb)/0.55)]",
  sent: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  accepted: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
  rejected: "border-red-400/30 bg-red-400/8 text-red-400",
  paid: "border-accent/40 bg-accent/10 text-accent",
};

export type QuoteContact = {
  id: number | string;
  name: string;
  email: string;
  business_name: string | null;
};

type QuoteForm = {
  kind: QuoteRecord["kind"];
  contact_id: string;
  client_name: string;
  client_email: string;
  client_business: string;
  items: { description: string; qty: string; price: string }[];
  discount: string;
  tax_rate: string;
  notes: string;
  issued_at: string;
  due_at: string;
};

const EMPTY_FORM: QuoteForm = {
  kind: "quote",
  contact_id: "",
  client_name: "",
  client_email: "",
  client_business: "",
  items: [{ description: "", qty: "1", price: "" }],
  discount: "",
  tax_rate: "",
  notes: "",
  issued_at: new Date().toISOString().slice(0, 10),
  due_at: "",
};

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formItemsToQuoteItems(items: QuoteForm["items"]): QuoteItem[] {
  return items
    .map((it) => ({ description: it.description.trim(), qty: Number(it.qty) || 0, price: Number(it.price) || 0 }))
    .filter((it) => it.description && it.qty > 0);
}

// PDF — hap dritare printimi me dizajn të pastër faturimi
export function printQuote(quote: QuoteRecord) {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const kindLabel = QUOTE_KIND_LABELS[quote.kind];

  const rows = quote.items
    .map(
      (it) => `<tr>
        <td>${it.description}</td>
        <td class="num">${it.qty}</td>
        <td class="num">${formatMoney(it.price)}</td>
        <td class="num">${formatMoney(it.qty * it.price)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="UTF-8">
<title>${kindLabel} ${quote.number}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #141414; padding: 48px 56px; max-width: 800px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ab8339; padding-bottom: 20px; }
  .brand { font-size: 20px; font-weight: 700; letter-spacing: 0.02em; }
  .brand small { display: block; font-weight: 400; font-size: 11px; color: #888; margin-top: 4px; letter-spacing: 0.12em; text-transform: uppercase; }
  .doc { text-align: right; }
  .doc h1 { margin: 0; font-size: 22px; color: #ab8339; letter-spacing: 0.04em; text-transform: uppercase; }
  .doc p { margin: 6px 0 0; font-size: 12px; color: #666; }
  .meta { display: flex; justify-content: space-between; margin-top: 28px; font-size: 13px; line-height: 1.7; }
  .meta h3 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #999; }
  table { width: 100%; border-collapse: collapse; margin-top: 32px; font-size: 13px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; border-bottom: 1.5px solid #ddd; padding: 8px 10px; }
  th.num, td.num { text-align: right; }
  td { padding: 10px; border-bottom: 1px solid #eee; }
  .totals { margin-top: 16px; margin-left: auto; width: 280px; font-size: 13px; }
  .totals div { display: flex; justify-content: space-between; padding: 5px 10px; }
  .totals .grand { border-top: 2px solid #ab8339; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 700; color: #ab8339; }
  .notes { margin-top: 32px; font-size: 12px; color: #555; line-height: 1.7; background: #faf8f4; border: 1px solid #eee2c8; border-radius: 8px; padding: 14px 18px; white-space: pre-wrap; }
  .foot { margin-top: 48px; border-top: 1px solid #eee; padding-top: 16px; font-size: 11px; color: #999; display: flex; justify-content: space-between; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="head">
    <div class="brand">
      ILLYRIAN PIXEL
      <small>Agjenci Dixhitale Premium</small>
    </div>
    <div class="doc">
      <h1>${kindLabel}</h1>
      <p><strong>${quote.number}</strong></p>
      <p>Data: ${formatDay(quote.issued_at)}</p>
      ${quote.due_at ? `<p>${quote.kind === "invoice" ? "Afati i pagesës" : "E vlefshme deri"}: ${formatDay(quote.due_at)}</p>` : ""}
    </div>
  </div>

  <div class="meta">
    <div>
      <h3>Për</h3>
      <strong>${quote.client_name}</strong><br>
      ${quote.client_business ? `${quote.client_business}<br>` : ""}
      ${quote.client_email ?? ""}
    </div>
    <div style="text-align:right">
      <h3>Nga</h3>
      Illyrian Pixel<br>
      Tiranë, Shqipëri<br>
      info@illyrianpixel.com
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Përshkrimi</th><th class="num">Sasia</th><th class="num">Çmimi</th><th class="num">Totali</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div><span>Nëntotali</span><span>${formatMoney(totals.subtotal)}</span></div>
    ${totals.discount > 0 ? `<div><span>Zbritje</span><span>-${formatMoney(totals.discount)}</span></div>` : ""}
    ${quote.tax_rate > 0 ? `<div><span>TVSH (${quote.tax_rate}%)</span><span>${formatMoney(totals.tax)}</span></div>` : ""}
    <div class="grand"><span>Totali</span><span>${formatMoney(totals.total)}</span></div>
  </div>

  ${quote.notes ? `<div class="notes">${quote.notes}</div>` : ""}

  <div class="foot">
    <span>illyrianpixel.com</span>
    <span>Faleminderit për besimin!</span>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

export default function QuotesTab({
  quotes,
  setQuotes,
  contacts,
  recurring,
  setRecurring,
  prefill,
}: {
  quotes: QuoteRecord[];
  setQuotes: (q: QuoteRecord[]) => void;
  contacts: QuoteContact[];
  recurring: RecurringInvoice[];
  setRecurring: React.Dispatch<React.SetStateAction<RecurringInvoice[]>>;
  prefill?: { contact: QuoteContact; key: number } | null;
}) {
  const [view, setView] = useState<"docs" | "recurring">("docs");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<QuoteForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "quote" | "invoice">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | QuoteRecord["status"]>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [sentId, setSentId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Hapur nga butoni "🧾 Krijo ofertë" te kontakti — formular i ri me klientin gati
  useEffect(() => {
    if (!prefill) return;
    setForm({
      ...EMPTY_FORM,
      contact_id: String(prefill.contact.id),
      client_name: prefill.contact.name,
      client_email: prefill.contact.email,
      client_business: prefill.contact.business_name ?? "",
    });
    setEditingId(null);
    setError("");
    setView("docs");
    setShowForm(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill?.key]);

  const copyPublicLink = async (q: QuoteRecord) => {
    if (!q.public_token) return;
    try {
      await navigator.clipboard.writeText(quotePublicUrl(q.public_token));
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      prompt("Kopjoje lidhjen manualisht:", quotePublicUrl(q.public_token));
    }
  };

  const filtered = useMemo(
    () =>
      quotes.filter((q) => {
        if (kindFilter !== "all" && q.kind !== kindFilter) return false;
        if (statusFilter !== "all" && q.status !== statusFilter) return false;
        return true;
      }),
    [quotes, kindFilter, statusFilter]
  );

  const stats = useMemo(() => {
    const accepted = quotes.filter((q) => q.status === "accepted" || q.status === "paid");
    const open = quotes.filter((q) => q.status === "draft" || q.status === "sent");
    const sum = (list: QuoteRecord[]) =>
      list.reduce((acc, q) => acc + quoteTotals(q.items, q.discount, q.tax_rate).total, 0);
    return { acceptedValue: sum(accepted), openValue: sum(open), total: quotes.length };
  }, [quotes]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (q: QuoteRecord) => {
    setForm({
      kind: q.kind,
      contact_id: q.contact_id ?? "",
      client_name: q.client_name,
      client_email: q.client_email ?? "",
      client_business: q.client_business ?? "",
      items: q.items.map((it) => ({ description: it.description, qty: String(it.qty), price: String(it.price) })),
      discount: q.discount ? String(q.discount) : "",
      tax_rate: q.tax_rate ? String(q.tax_rate) : "",
      notes: q.notes ?? "",
      issued_at: q.issued_at,
      due_at: q.due_at ?? "",
    });
    setEditingId(q.id);
    setError("");
    setShowForm(true);
  };

  const pickContact = (id: string) => {
    const c = contacts.find((x) => String(x.id) === id);
    setForm((f) => ({
      ...f,
      contact_id: id,
      client_name: c ? c.name : f.client_name,
      client_email: c ? c.email : f.client_email,
      client_business: c?.business_name ?? f.client_business,
    }));
  };

  // Mbush artikujt, llojin dhe shënimet nga shablloni — klienti mbetet siç është
  const pickTemplate = (id: string) => {
    const t = QUOTE_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setForm((f) => ({
      ...f,
      kind: editingId ? f.kind : t.kind,
      items: t.items.map((it) => ({ description: it.description, qty: String(it.qty), price: String(it.price) })),
      notes: t.notes,
    }));
  };

  const setItem = (idx: number, field: "description" | "qty" | "price", value: string) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const totalsPreview = useMemo(
    () => quoteTotals(formItemsToQuoteItems(form.items), Number(form.discount) || 0, Number(form.tax_rate) || 0),
    [form.items, form.discount, form.tax_rate]
  );

  const submit = async () => {
    const items = formItemsToQuoteItems(form.items);
    if (!form.client_name.trim()) {
      setError("Emri i klientit është i detyrueshëm.");
      return;
    }
    if (items.length === 0) {
      setError("Shto të paktën një artikull me përshkrim dhe sasi.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      kind: form.kind,
      contact_id: form.contact_id || null,
      client_name: form.client_name,
      client_email: form.client_email,
      client_business: form.client_business,
      items,
      discount: Number(form.discount) || 0,
      tax_rate: Number(form.tax_rate) || 0,
      notes: form.notes,
      issued_at: form.issued_at,
      due_at: form.due_at || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/quotes/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setQuotes(quotes.map((q) => (q.id === editingId ? data.quote : q)));
      } else {
        const res = await fetch("/api/admin/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setQuotes([data.quote, ...quotes]);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (q: QuoteRecord, status: QuoteRecord["status"]) => {
    setBusyId(q.id);
    try {
      const res = await fetch(`/api/admin/quotes/${q.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setQuotes(quotes.map((x) => (x.id === q.id ? data.quote : x)));
    } finally {
      setBusyId(null);
    }
  };

  const sendEmail = async (q: QuoteRecord) => {
    if (!q.client_email) return;
    if (!confirm(`T'i dërgohet ${QUOTE_KIND_LABELS[q.kind].toLowerCase()}a ${q.number} te ${q.client_email}?`)) return;
    setBusyId(q.id);
    try {
      const res = await fetch(`/api/admin/quotes/${q.id}/send`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.map((x) => (x.id === q.id ? { ...x, status: data.status } : x)));
        setSentId(q.id);
        setTimeout(() => setSentId(null), 3000);
      } else {
        alert(data.error ?? "Dërgimi dështoi.");
      }
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (q: QuoteRecord) => {
    if (!confirm(`Të fshihet ${q.number}? Ky veprim nuk kthehet mbrapsht.`)) return;
    setBusyId(q.id);
    try {
      const res = await fetch(`/api/admin/quotes/${q.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.filter((x) => x.id !== q.id));
        if (editingId === q.id) {
          setShowForm(false);
          setEditingId(null);
        }
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Nën-seksionet: dokumente / të rikurrueshme */}
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {([
          ["docs", `🧾 Dokumentet (${quotes.length})`],
          ["recurring", `🔁 Të rikurrueshme (${recurring.length})`],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`font-ui whitespace-nowrap rounded-[2px] px-4 py-2 text-[12px] font-semibold transition-colors ${
              view === id
                ? "bg-accent/10 text-accent border border-accent/30"
                : "border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "recurring" && <RecurringInvoices rows={recurring} setRows={setRecurring} contacts={contacts} />}

      {view === "docs" && (
      <>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{formatMoney(stats.acceptedValue)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Të pranuara / paguara</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{formatMoney(stats.openValue)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Në pritje (draft + dërguar)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{stats.total}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Dokumente gjithsej</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          onClick={openCreate}
          className="font-ui rounded-[2px] bg-accent px-5 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)]"
        >
          ＋ Ofertë / Faturë e re
        </button>
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as typeof kindFilter)} className={INPUT}>
          <option value="all">Të gjitha llojet</option>
          <option value="quote">Vetëm oferta</option>
          <option value="invoice">Vetëm fatura</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={INPUT}>
          <option value="all">Çdo status</option>
          {Object.entries(QUOTE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className={CARD + " mb-6 p-5"}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[1.1rem] font-semibold text-[var(--a-text)]">
              {editingId ? "Edito dokumentin" : "Dokument i ri"}
            </p>
            <select
              value=""
              onChange={(e) => pickTemplate(e.target.value)}
              className={INPUT}
              title="Mbush artikujt dhe shënimet nga një shabllon i gatshëm"
            >
              <option value="">⚡ Nga shablloni…</option>
              {QUOTE_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Lloji</label>
              <select
                value={form.kind}
                onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as QuoteForm["kind"] }))}
                disabled={!!editingId}
                className={INPUT + " w-full disabled:opacity-50"}
              >
                <option value="quote">Ofertë (OF)</option>
                <option value="invoice">Faturë (FA)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                Plotëso nga kontakti (ops.)
              </label>
              <select value={form.contact_id} onChange={(e) => pickContact(e.target.value)} className={INPUT + " w-full"}>
                <option value="">— Klient manual —</option>
                {contacts.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {c.name} · {c.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Emri i klientit *"
              value={form.client_name}
              onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
              className={INPUT + " w-full"}
            />
            <input
              type="email"
              placeholder="Email i klientit"
              value={form.client_email}
              onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
              className={INPUT + " w-full"}
            />
            <input
              type="text"
              placeholder="Biznesi"
              value={form.client_business}
              onChange={(e) => setForm((f) => ({ ...f, client_business: e.target.value }))}
              className={INPUT + " w-full"}
            />
          </div>

          {/* Items */}
          <label className="mb-1.5 mt-4 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
            Artikujt
          </label>
          <div className="space-y-2">
            {form.items.map((it, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Përshkrimi (p.sh. Website Premium)"
                  value={it.description}
                  onChange={(e) => setItem(idx, "description", e.target.value)}
                  className={INPUT + " min-w-[200px] flex-1"}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Sasia"
                  value={it.qty}
                  onChange={(e) => setItem(idx, "qty", e.target.value)}
                  className={INPUT + " w-20"}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Çmimi €"
                  value={it.price}
                  onChange={(e) => setItem(idx, "price", e.target.value)}
                  className={INPUT + " w-28"}
                />
                <span className="w-24 text-right text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
                  {formatMoney((Number(it.qty) || 0) * (Number(it.price) || 0))}
                </span>
                <button
                  onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))}
                  disabled={form.items.length === 1}
                  className="text-[14px] text-red-400/60 transition-colors hover:text-red-400 disabled:opacity-30"
                  aria-label="Hiq artikullin"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setForm((f) => ({ ...f, items: [...f.items, { description: "", qty: "1", price: "" }] }))}
            className="font-ui mt-2 rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
          >
            ＋ Shto rresht
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Zbritje (€)</label>
              <input type="number" min="0" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">TVSH (%)</label>
              <input type="number" min="0" max="100" value={form.tax_rate} onChange={(e) => setForm((f) => ({ ...f, tax_rate: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Data e lëshimit</label>
              <input type="date" value={form.issued_at} onChange={(e) => setForm((f) => ({ ...f, issued_at: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                {form.kind === "invoice" ? "Afati i pagesës" : "E vlefshme deri"}
              </label>
              <input type="date" value={form.due_at} onChange={(e) => setForm((f) => ({ ...f, due_at: e.target.value }))} className={INPUT + " w-full"} />
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Shënime / kushte (ops.)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={INPUT + " mt-3 w-full resize-none"}
          />

          {/* Totals preview */}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-5 text-[12px] text-[rgb(var(--a-text-rgb)/0.55)]">
            <span>Nëntotali: {formatMoney(totalsPreview.subtotal)}</span>
            {totalsPreview.discount > 0 && <span>Zbritje: -{formatMoney(totalsPreview.discount)}</span>}
            {totalsPreview.tax > 0 && <span>TVSH: {formatMoney(totalsPreview.tax)}</span>}
            <span className="font-display text-[1.1rem] font-bold text-accent">Totali: {formatMoney(totalsPreview.total)}</span>
          </div>

          {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={submit}
              disabled={saving}
              className="font-ui rounded-[2px] bg-accent px-6 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)] disabled:opacity-50"
            >
              {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Krijo dokumentin"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="font-ui rounded-[2px] border border-[var(--a-border)] px-6 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              Anulo
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-[13px] text-[rgb(var(--a-text-rgb)/0.35)]">
            Asnjë dokument ende. Krijo ofertën e parë me butonin lart.
          </p>
        )}
        {filtered.map((q) => {
          const totals = quoteTotals(q.items, q.discount, q.tax_rate);
          return (
            <div key={q.id} className={CARD + " p-5"}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display font-semibold text-[var(--a-text)]">{q.number}</span>
                    <span className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.5)]">
                      {QUOTE_KIND_LABELS[q.kind]}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_COLORS[q.status]}`}>
                      {QUOTE_STATUS_LABELS[q.status]}
                    </span>
                    {q.viewed_at && (
                      <span
                        title={`Klienti e ka hapur ${q.view_count ?? 1} herë`}
                        className="rounded-full border border-accent/35 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold text-accent"
                      >
                        👁 Parë{(q.view_count ?? 0) > 1 ? ` ${q.view_count}×` : ""} ·{" "}
                        {new Date(q.viewed_at).toLocaleString("sq-AL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
                    {q.client_name}
                    {q.client_business ? ` · ${q.client_business}` : ""} · {formatDay(q.issued_at)}
                    {q.due_at ? ` → ${formatDay(q.due_at)}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[1.2rem] font-bold text-accent">{formatMoney(totals.total)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--a-border)] pt-3">
                <select
                  value={q.status}
                  disabled={busyId === q.id}
                  onChange={(e) => updateStatus(q, e.target.value as QuoteRecord["status"])}
                  className={INPUT + " disabled:opacity-50"}
                >
                  {Object.entries(QUOTE_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <button
                  onClick={() => printQuote(q)}
                  className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                >
                  🖨 PDF
                </button>
                <button
                  onClick={() => sendEmail(q)}
                  disabled={!q.client_email || busyId === q.id}
                  title={q.client_email ? `Dërgo te ${q.client_email}` : "Klienti s'ka email"}
                  className="font-ui rounded-[2px] border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
                >
                  {busyId === q.id ? "…" : sentId === q.id ? "U dërgua ✓" : "✉️ Dërgo me email"}
                </button>
                {q.public_token && (
                  <button
                    onClick={() => copyPublicLink(q)}
                    title="Kopjo lidhjen publike që klienti hap për ta parë e pranuar online"
                    className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                  >
                    {copiedId === q.id ? "U kopjua ✓" : "🔗 Lidhja publike"}
                  </button>
                )}
                <button
                  onClick={() => openEdit(q)}
                  className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                >
                  Edito
                </button>
                <button
                  onClick={() => remove(q)}
                  disabled={busyId === q.id}
                  className="font-ui rounded-[2px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                >
                  Fshi
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
