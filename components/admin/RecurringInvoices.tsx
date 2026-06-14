"use client";

import { useMemo, useState } from "react";
import {
  formatMoney,
  quoteTotals,
  type QuoteItem,
  type RecurringInvoice,
} from "@/lib/quotes";
import type { QuoteContact } from "@/components/admin/QuotesTab";
import { CARD, INPUT, EmptyState, useConfirm } from "@/components/admin/ui";

type RecurringForm = {
  contact_id: string;
  client_name: string;
  client_email: string;
  client_business: string;
  items: { description: string; qty: string; price: string }[];
  discount: string;
  tax_rate: string;
  notes: string;
  day_of_month: string;
};

const EMPTY_FORM: RecurringForm = {
  contact_id: "",
  client_name: "",
  client_email: "",
  client_business: "",
  items: [{ description: "Mirëmbajtje mujore website", qty: "1", price: "" }],
  discount: "",
  tax_rate: "",
  notes: "",
  day_of_month: "1",
};

function formItemsToQuoteItems(items: RecurringForm["items"]): QuoteItem[] {
  return items
    .map((it) => ({ description: it.description.trim(), qty: Number(it.qty) || 0, price: Number(it.price) || 0 }))
    .filter((it) => it.description && it.qty > 0);
}

export default function RecurringInvoices({
  rows,
  setRows,
  contacts,
}: {
  rows: RecurringInvoice[];
  setRows: React.Dispatch<React.SetStateAction<RecurringInvoice[]>>;
  contacts: QuoteContact[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RecurringForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirm, renderConfirm] = useConfirm();
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(rows.length >= 100);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/admin/recurring?offset=${rows.length}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setRows((prev) => [...prev, ...data.recurring]);
        setHasMore(data.recurring.length >= 100);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const monthlyTotal = useMemo(
    () =>
      rows
        .filter((r) => r.active)
        .reduce((sum, r) => sum + quoteTotals(r.items, r.discount, r.tax_rate).total, 0),
    [rows]
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (r: RecurringInvoice) => {
    setForm({
      contact_id: r.contact_id ?? "",
      client_name: r.client_name,
      client_email: r.client_email ?? "",
      client_business: r.client_business ?? "",
      items: r.items.map((it) => ({ description: it.description, qty: String(it.qty), price: String(it.price) })),
      discount: r.discount ? String(r.discount) : "",
      tax_rate: r.tax_rate ? String(r.tax_rate) : "",
      notes: r.notes ?? "",
      day_of_month: String(r.day_of_month),
    });
    setEditingId(r.id);
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

  const setItem = (idx: number, field: "description" | "qty" | "price", value: string) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

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
      contact_id: form.contact_id || null,
      client_name: form.client_name,
      client_email: form.client_email,
      client_business: form.client_business,
      items,
      discount: Number(form.discount) || 0,
      tax_rate: Number(form.tax_rate) || 0,
      notes: form.notes,
      day_of_month: Number(form.day_of_month) || 1,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/recurring/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setRows(rows.map((r) => (r.id === editingId ? data.recurring : r)));
      } else {
        const res = await fetch("/api/admin/recurring", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setRows([data.recurring, ...rows]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (r: RecurringInvoice) => {
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/recurring/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !r.active }),
      });
      const data = await res.json();
      if (data.success) setRows(rows.map((x) => (x.id === r.id ? data.recurring : x)));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: RecurringInvoice) => {
    if (!(await confirm({ title: "Fshi faturën e rikurruese", message: `Të fshihet fatura e rikurruese për ${r.client_name}? Faturat e gjeneruara deri tani nuk preken.`, danger: true, confirmText: "Fshi" }))) return;
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/recurring/${r.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRows(rows.filter((x) => x.id !== r.id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{formatMoney(monthlyTotal)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Të ardhura mujore të rikurruese</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">
            {rows.filter((r) => r.active).length} / {rows.length}
          </p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Aktive / gjithsej</p>
        </div>
      </div>

      <button
        onClick={openCreate}
        className="font-ui mb-5 rounded-[2px] bg-accent px-5 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)]"
      >
        ＋ Faturë e rikurruese e re
      </button>

      {/* Form */}
      {showForm && (
        <div className={CARD + " mb-6 p-5"}>
          <p className="mb-4 font-display text-[1.1rem] font-semibold text-[var(--a-text)]">
            {editingId ? "Edito faturën e rikurruese" : "Faturë e rikurruese e re"}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
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
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                Dita e muajit (1–28)
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={form.day_of_month}
                onChange={(e) => setForm((f) => ({ ...f, day_of_month: e.target.value }))}
                className={INPUT + " w-full"}
              />
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

          <label className="mb-1.5 mt-4 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
            Artikujt (çdo muaj)
          </label>
          <div className="space-y-2">
            {form.items.map((it, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Përshkrimi (p.sh. Mirëmbajtje mujore)"
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

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Zbritje (€)</label>
              <input type="number" min="0" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">TVSH (%)</label>
              <input type="number" min="0" max="100" value={form.tax_rate} onChange={(e) => setForm((f) => ({ ...f, tax_rate: e.target.value }))} className={INPUT + " w-full"} />
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Shënime që shfaqen në çdo faturë (ops.)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={INPUT + " mt-3 w-full resize-none"}
          />

          {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={submit}
              disabled={saving}
              className="font-ui rounded-[2px] bg-accent px-6 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)] disabled:opacity-50"
            >
              {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Krijo"}
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
        {rows.length === 0 && (
          <EmptyState text="Asnjë faturë e rikurruese. Krijo të parën për klientët me mirëmbajtje mujore — fatura gjenerohet dhe dërgohet vetë çdo muaj." />
        )}
        {rows.map((r) => {
          const totals = quoteTotals(r.items, r.discount, r.tax_rate);
          return (
            <div key={r.id} className={CARD + " p-5"}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display font-semibold text-[var(--a-text)]">{r.client_name}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        r.active
                          ? "border-emerald-400/30 bg-emerald-400/8 text-emerald-300"
                          : "border-[rgb(var(--a-text-rgb)/0.2)] bg-[rgb(var(--a-text-rgb)/0.05)] text-[rgb(var(--a-text-rgb)/0.55)]"
                      }`}
                    >
                      {r.active ? "Aktive" : "E ndalur"}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
                    {r.client_business ? `${r.client_business} · ` : ""}çdo muaj më datë {r.day_of_month}
                    {r.last_generated ? ` · e fundit: ${r.last_generated}` : " · ende pa gjeneruar"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[1.2rem] font-bold text-accent">{formatMoney(totals.total)}/muaj</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--a-border)] pt-3">
                <button
                  onClick={() => toggleActive(r)}
                  disabled={busyId === r.id}
                  className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-50"
                >
                  {r.active ? "⏸ Ndalo" : "▶ Aktivizo"}
                </button>
                <button
                  onClick={() => openEdit(r)}
                  className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                >
                  Edito
                </button>
                <button
                  onClick={() => remove(r)}
                  disabled={busyId === r.id}
                  className="font-ui rounded-[2px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                >
                  Fshi
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="font-ui rounded-[2px] border border-[var(--a-border)] px-4 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-50"
          >
            {loadingMore ? "Duke ngarkuar…" : "Ngarko më shumë"}
          </button>
        </div>
      )}
      {renderConfirm()}
    </div>
  );
}
