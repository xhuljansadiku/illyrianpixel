"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, EmptyState, useDebounced, useToasts, useConfirm } from "@/components/admin/ui";
import { formatMoney, quoteTotals, type QuoteRecord, type RecurringInvoice } from "@/lib/quotes";

type Expense = {
  id: number;
  description: string;
  category: string;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const EXPENSE_CATEGORIES = [
  "Hosting & Domain",
  "Software & Abonime",
  "Marketing & Reklama",
  "Kontraktorë / Freelancer",
  "Pajisje",
  "Taksa & Kontabilitet",
  "Tjetër",
];

type ExpenseForm = {
  description: string;
  category: string;
  amount: string;
  expense_date: string;
  notes: string;
};

const EMPTY_FORM: ExpenseForm = {
  description: "",
  category: EXPENSE_CATEGORIES[0],
  amount: "",
  expense_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export default function FinancesTab({ quotes, recurring }: { quotes: QuoteRecord[]; recurring: RecurringInvoice[] }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 250);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ExpenseForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    fetch("/api/admin/expenses")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setExpenses(d.expenses);
      })
      .finally(() => setLoading(false));
  }, []);

  const paidInvoices = useMemo(() => quotes.filter((q) => q.kind === "invoice" && q.status === "paid"), [quotes]);
  const totalRevenue = useMemo(
    () => paidInvoices.reduce((sum, q) => sum + quoteTotals(q.items, q.discount, q.tax_rate).total, 0),
    [paidInvoices]
  );
  const mrr = useMemo(
    () => recurring.filter((r) => r.active).reduce((sum, r) => sum + quoteTotals(r.items, r.discount, r.tax_rate).total, 0),
    [recurring]
  );
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
  const netProfit = totalRevenue - totalExpenses;

  const monthly = useMemo(() => {
    const months: { key: string; label: string; revenue: number; expenses: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("sq-AL", { month: "short" }),
        revenue: 0,
        expenses: 0,
      });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    paidInvoices.forEach((q) => {
      const m = byKey.get(monthKey(q.updated_at));
      if (m) m.revenue += quoteTotals(q.items, q.discount, q.tax_rate).total;
    });
    expenses.forEach((e) => {
      const m = byKey.get(monthKey(e.expense_date));
      if (m) m.expenses += Number(e.amount);
    });
    return months;
  }, [paidInvoices, expenses]);
  const monthlyMax = Math.max(1, ...monthly.map((m) => Math.max(m.revenue, m.expenses)));

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount)));
    return Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);
  const categoryMax = Math.max(1, ...byCategory.map((c) => c.total));

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return expenses.filter((e) => {
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (!term) return true;
      return e.description.toLowerCase().includes(term) || e.category.toLowerCase().includes(term);
    });
  }, [expenses, debouncedSearch, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (e: Expense) => {
    setEditingId(e.id);
    setForm({
      description: e.description,
      category: e.category,
      amount: String(e.amount),
      expense_date: e.expense_date,
      notes: e.notes ?? "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.description.trim()) return pushToast("Përshkrimi është i detyrueshëm.", "error");
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return pushToast("Shuma duhet të jetë numër pozitiv.", "error");

    setSaving(true);
    const payload = {
      description: form.description.trim(),
      category: form.category,
      amount,
      expense_date: form.expense_date,
      notes: form.notes || null,
    };
    const res = await fetch(editingId ? `/api/admin/expenses/${editingId}` : "/api/admin/expenses", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());
    setSaving(false);
    if (!res.success) return pushToast(res.error ?? "Gabim.", "error");

    if (editingId) setExpenses((list) => list.map((e) => (e.id === res.expense.id ? res.expense : e)));
    else setExpenses((list) => [res.expense, ...list]);
    setFormOpen(false);
    pushToast(editingId ? "Shpenzimi u përditësua." : "Shpenzimi u shtua.", "success");
  };

  const handleDelete = async (e: Expense) => {
    const ok = await confirm({ title: "Fshi shpenzimin", message: `"${e.description}" do të fshihet.`, danger: true, confirmText: "Fshi" });
    if (!ok) return;
    const res = await fetch(`/api/admin/expenses/${e.id}`, { method: "DELETE" }).then((r) => r.json());
    if (res.success) {
      setExpenses((list) => list.filter((x) => x.id !== e.id));
      pushToast("Shpenzimi u fshi.", "success");
    } else pushToast(res.error ?? "Gabim.", "error");
  };

  return (
    <div className="space-y-6">
      {renderToasts()}
      {renderConfirm()}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Të ardhura (faturat e paguara)</p>
          <p className="mt-1 font-ui text-[20px] font-semibold text-emerald-400">{formatMoney(totalRevenue)}</p>
        </div>
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Shpenzime gjithsej</p>
          <p className="mt-1 font-ui text-[20px] font-semibold text-red-400">{formatMoney(totalExpenses)}</p>
        </div>
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Fitimi neto</p>
          <p className={`mt-1 font-ui text-[20px] font-semibold ${netProfit >= 0 ? "text-accent" : "text-red-400"}`}>
            {formatMoney(netProfit)}
          </p>
        </div>
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">MRR (rekurrente aktive)</p>
          <p className="mt-1 font-ui text-[20px] font-semibold text-accent">{formatMoney(mrr)}/muaj</p>
        </div>
      </div>

      {/* Monthly revenue vs expenses */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Fitime vs. Shpenzime — 6 muajt e fundit
        </p>
        <div className="flex h-36 items-end gap-4">
          {monthly.map((m) => (
            <div key={m.key} className="flex flex-1 items-end justify-center gap-1">
              <div className="group relative flex-1 max-w-[18px]">
                <div
                  className="rounded-sm bg-emerald-400/60 transition-colors group-hover:bg-emerald-400"
                  style={{ height: `${Math.max(3, (m.revenue / monthlyMax) * 128)}px` }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatMoney(m.revenue)}
                </div>
              </div>
              <div className="group relative flex-1 max-w-[18px]">
                <div
                  className="rounded-sm bg-red-400/60 transition-colors group-hover:bg-red-400"
                  style={{ height: `${Math.max(3, (m.expenses / monthlyMax) * 128)}px` }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatMoney(m.expenses)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4">
          {monthly.map((m) => (
            <p key={m.key} className="flex-1 text-center text-[10px] uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.45)]">
              {m.label}
            </p>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-emerald-400/60" /> Fitime
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-red-400/60" /> Shpenzime
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <div className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Shpenzimet sipas kategorisë
          </p>
          <div className="space-y-2.5">
            {byCategory.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-[rgb(var(--a-text-rgb)/0.7)]">{c.category}</span>
                  <span className="font-semibold text-[var(--a-text)]">{formatMoney(c.total)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--a-border)]">
                  <div className="h-full rounded-full bg-red-400/60" style={{ width: `${(c.total / categoryMax) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense list */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko shpenzim…"
          className={INPUT + " w-full max-w-sm"}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={INPUT}>
          <option value="all">Të gjitha kategoritë</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={formOpen ? () => setFormOpen(false) : openCreate} className={BTN_GOLD}>
          {formOpen ? "Anulo" : "+ Shto shpenzim"}
        </button>
      </div>

      {formOpen && (
        <div className={CARD + " space-y-3 p-5"}>
          <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">
            {editingId ? "Redakto shpenzimin" : "Shpenzim i ri"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Përshkrimi *</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Kategoria</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={INPUT + " w-full"}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Shuma (€) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={INPUT + " w-full"}
              />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Data *</label>
              <input
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
                className={INPUT + " w-full"}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Shënime</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className={INPUT + " w-full resize-none"}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !form.description.trim() || !form.amount} className={BTN_GOLD}>
              {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto shpenzimin"}
            </button>
            <button onClick={() => setFormOpen(false)} className={BTN_PLAIN}>
              Anulo
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">Duke ngarkuar…</p>
      ) : filtered.length === 0 ? (
        <div className={CARD}>
          <EmptyState text={expenses.length === 0 ? "Ende s'ka shpenzime të regjistruara." : "Asnjë shpenzim nuk përputhet me kërkimin."} />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((e) => (
            <div key={e.id} className={CARD + " flex flex-wrap items-center justify-between gap-3 p-4"}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-ui text-[13px] font-semibold text-[var(--a-text)]">{e.description}</span>
                  <span className="rounded-full border border-[var(--a-border)] px-2 py-0.5 text-[10px] text-[rgb(var(--a-text-rgb)/0.7)]">
                    {e.category}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">{formatDay(e.expense_date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-ui text-[15px] font-semibold text-red-400">{formatMoney(e.amount)}</p>
                <button onClick={() => openEdit(e)} className={BTN_PLAIN}>
                  Redakto
                </button>
                <button onClick={() => handleDelete(e)} className={BTN_DANGER}>
                  Fshi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
