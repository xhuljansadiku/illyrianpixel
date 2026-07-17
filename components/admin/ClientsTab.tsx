"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, EmptyState, useDebounced, useToasts, useConfirm } from "@/components/admin/ui";
import type { Contact } from "@/components/AdminDashboard";
import { PROJECT_STATUS_LABELS, type ProjectRecord } from "@/lib/projects";
import { formatMoney, quoteTotals, type QuoteRecord, type RecurringInvoice } from "@/lib/quotes";

const STATUS_DOT: Record<ProjectRecord["status"], string> = {
  active: "bg-blue-400",
  paused: "bg-yellow-400",
  done: "bg-emerald-400",
};

type ManualClient = {
  id: number;
  contact_id: string | null;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  since_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ClientRow = {
  key: string;
  manualId: number | null;
  contactId: string | null;
  name: string;
  business: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  notes: string | null;
  contact: Contact | null;
  projects: ProjectRecord[];
  paidTotal: number;
  pendingTotal: number;
  recurringMonthly: number;
  recurringCount: number;
  since: string;
  lastActivity: string;
};

function normalize(name: string) {
  return name.trim().toLowerCase();
}

// Fallback "service" when there's no linked contact to pull a clean label from —
// truncate so a full invoice line item doesn't blow out the table column.
function shortService(text: string | null | undefined): string | null {
  if (!text) return null;
  return text.length > 40 ? `${text.slice(0, 40).trim()}…` : text;
}

function keyFor(contactId: string | number | null | undefined, name: string) {
  if (contactId !== null && contactId !== undefined && contactId !== "") return `c:${contactId}`;
  return `n:${normalize(name || "klient")}`;
}

function buildClients(contacts: Contact[], projects: ProjectRecord[], quotes: QuoteRecord[], recurring: RecurringInvoice[]): ClientRow[] {
  const map = new Map<string, ClientRow>();

  const findContact = (contactId: string | null) =>
    contactId ? contacts.find((c) => String(c.id) === String(contactId)) ?? null : null;

  const ensure = (
    key: string,
    name: string,
    business: string | null,
    email: string | null,
    phone: string | null,
    service: string | null,
    contact: Contact | null,
    contactId: string | null,
    at: string
  ) => {
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        manualId: null,
        contactId,
        name,
        business,
        email,
        phone,
        service,
        notes: null,
        contact,
        projects: [],
        paidTotal: 0,
        pendingTotal: 0,
        recurringMonthly: 0,
        recurringCount: 0,
        since: at,
        lastActivity: at,
      };
      map.set(key, row);
    }
    if (!row.contact && contact) row.contact = contact;
    if (!row.contactId && contactId) row.contactId = contactId;
    if (!row.business && business) row.business = business;
    if (!row.email && email) row.email = email;
    if (!row.phone && phone) row.phone = phone;
    if (!row.service && service) row.service = service;
    if (at && at < row.since) row.since = at;
    if (at && at > row.lastActivity) row.lastActivity = at;
    return row;
  };

  for (const p of projects) {
    const name = p.client_name || "Klient pa emër";
    const contact = findContact(p.contact_id);
    const key = keyFor(p.contact_id, name);
    const service = contact?.service || p.tags?.[0] || null;
    const row = ensure(key, name, contact?.business_name ?? null, contact?.email ?? null, contact?.phone ?? null, service, contact, p.contact_id, p.updated_at || p.created_at);
    row.projects.push(p);
  }

  for (const q of quotes) {
    const contact = findContact(q.contact_id);
    const key = keyFor(q.contact_id, q.client_name);
    const service = contact?.service || shortService(q.items?.[0]?.description) || null;
    const row = ensure(key, q.client_name, q.client_business, q.client_email, contact?.phone ?? null, service, contact, q.contact_id, q.updated_at || q.created_at);
    const totals = quoteTotals(q.items, q.discount, q.tax_rate);
    if (q.status === "paid") row.paidTotal += totals.total;
    else if (q.status === "sent" || q.status === "accepted") row.pendingTotal += totals.total;
  }

  for (const r of recurring) {
    if (!r.active) continue;
    const contact = findContact(r.contact_id);
    const key = keyFor(r.contact_id, r.client_name);
    const service = contact?.service || shortService(r.items?.[0]?.description) || null;
    const row = ensure(key, r.client_name, r.client_business, r.client_email, contact?.phone ?? null, service, contact, r.contact_id, r.created_at);
    const totals = quoteTotals(r.items, r.discount, r.tax_rate);
    row.recurringMonthly += totals.total;
    row.recurringCount += 1;
  }

  return Array.from(map.values());
}

// Overlays manually-added/edited client records onto the auto-derived rows —
// matched by the same key (contact_id, falling back to normalized name) so
// editing an auto-derived row and editing a freestanding manual entry behave
// the same way. Manual fields win when present; financial totals always come
// from real projects/quotes/recurring since those reflect actual transactions.
function applyManualOverrides(autoRows: ClientRow[], manual: ManualClient[]): ClientRow[] {
  const rows = [...autoRows];

  for (const m of manual) {
    const key = keyFor(m.contact_id, m.name);
    const idx = rows.findIndex((r) => r.key === key);
    if (idx >= 0) {
      const r = rows[idx];
      rows[idx] = {
        ...r,
        manualId: m.id,
        contactId: m.contact_id ?? r.contactId,
        name: m.name || r.name,
        business: m.business_name ?? r.business,
        email: m.email ?? r.email,
        phone: m.phone ?? r.phone,
        service: m.service ?? r.service,
        notes: m.notes,
        since: m.since_date ?? r.since,
      };
    } else {
      rows.push({
        key,
        manualId: m.id,
        contactId: m.contact_id,
        name: m.name,
        business: m.business_name,
        email: m.email,
        phone: m.phone,
        service: m.service,
        notes: m.notes,
        contact: null,
        projects: [],
        paidTotal: 0,
        pendingTotal: 0,
        recurringMonthly: 0,
        recurringCount: 0,
        since: m.since_date || m.created_at,
        lastActivity: m.updated_at || m.created_at,
      });
    }
  }

  return rows.sort((a, b) => b.paidTotal + b.recurringMonthly * 12 - (a.paidTotal + a.recurringMonthly * 12));
}

type ClientForm = {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  service: string;
  since_date: string;
  notes: string;
};

const EMPTY_CLIENT_FORM: ClientForm = {
  name: "",
  business_name: "",
  email: "",
  phone: "",
  service: "",
  since_date: "",
  notes: "",
};

function formatMonth(iso: string) {
  if (!iso) return "—";
  const label = new Date(iso).toLocaleDateString("sq-AL", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function ClientsTab({
  contacts,
  projects,
  quotes,
  recurring,
  onGoToContact,
}: {
  contacts: Contact[];
  projects: ProjectRecord[];
  quotes: QuoteRecord[];
  recurring: RecurringInvoice[];
  onGoToContact: (term: string) => void;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 250);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [offerBusyKey, setOfferBusyKey] = useState<string | null>(null);
  const [offerSentKeys, setOfferSentKeys] = useState<Set<string>>(new Set());
  const [manualClients, setManualClients] = useState<ManualClient[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ClientForm>(EMPTY_CLIENT_FORM);
  const [editingRow, setEditingRow] = useState<ClientRow | null>(null);
  const [saving, setSaving] = useState(false);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setManualClients(d.clients);
      });
  }, []);

  const autoClients = useMemo(() => buildClients(contacts, projects, quotes, recurring), [contacts, projects, quotes, recurring]);
  const clients = useMemo(() => applyManualOverrides(autoClients, manualClients), [autoClients, manualClients]);

  const openCreate = () => {
    setEditingRow(null);
    setForm(EMPTY_CLIENT_FORM);
    setFormOpen(true);
  };

  const openEdit = (row: ClientRow) => {
    setEditingRow(row);
    setForm({
      name: row.name,
      business_name: row.business ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      service: row.service ?? "",
      since_date: row.since ? row.since.slice(0, 10) : "",
      notes: row.notes ?? "",
    });
    setFormOpen(true);
  };

  const handleSaveClient = async () => {
    if (!form.name.trim()) return pushToast("Emri i klientit është i detyrueshëm.", "error");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      business_name: form.business_name || null,
      email: form.email || null,
      phone: form.phone || null,
      service: form.service || null,
      since_date: form.since_date || null,
      notes: form.notes || null,
      contact_id: editingRow?.contactId ?? null,
    };
    const isEdit = !!editingRow?.manualId;
    const res = await fetch(isEdit ? `/api/admin/clients/${editingRow!.manualId}` : "/api/admin/clients", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());
    setSaving(false);
    if (!res.success) return pushToast(res.error ?? "Gabim.", "error");

    if (isEdit) setManualClients((list) => list.map((c) => (c.id === res.client.id ? res.client : c)));
    else setManualClients((list) => [res.client, ...list]);
    setFormOpen(false);
    pushToast(isEdit ? "Klienti u përditësua." : "Klienti u shtua.", "success");
  };

  const handleDeleteClient = async (row: ClientRow) => {
    if (!row.manualId) return;
    const ok = await confirm({
      title: "Fshi klientin",
      message: `"${row.name}" do të hiqet nga lista. Nëse ka projekte/fatura reale të lidhura, ai do të vazhdojë të shfaqet automatikisht me të dhënat origjinale.`,
      danger: true,
      confirmText: "Fshi",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/clients/${row.manualId}`, { method: "DELETE" }).then((r) => r.json());
    if (res.success) {
      setManualClients((list) => list.filter((c) => c.id !== row.manualId));
      pushToast("Klienti u fshi.", "success");
    } else pushToast(res.error ?? "Gabim.", "error");
  };

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.business ?? "").toLowerCase().includes(term) ||
        (c.email ?? "").toLowerCase().includes(term) ||
        (c.service ?? "").toLowerCase().includes(term)
    );
  }, [clients, debouncedSearch]);

  const totals = useMemo(
    () => ({
      count: clients.length,
      paid: clients.reduce((s, c) => s + c.paidTotal, 0),
      mrr: clients.reduce((s, c) => s + c.recurringMonthly, 0),
    }),
    [clients]
  );

  const sendMaintenanceOffer = async (row: ClientRow) => {
    if (!row.email) return;
    const ok = await confirm({
      title: "Ofertë mirëmbajtjeje",
      message: `T'i dërgohet ${row.name} (${row.email}) email-i me planet e mirëmbajtjes (€49/€99/€149 muaj)?`,
      confirmText: "Dërgo",
    });
    if (!ok) return;
    setOfferBusyKey(row.key);
    try {
      const res = await fetch("/api/admin/clients/maintenance-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: row.email, name: row.name, contact_id: row.contactId }),
      }).then((r) => r.json());
      if (res.success) {
        setOfferSentKeys((prev) => new Set(prev).add(row.key));
        pushToast(`Oferta e mirëmbajtjes iu dërgua ${row.name}.`, "success");
      } else {
        pushToast(res.error ?? "Dërgimi dështoi.", "error");
      }
    } catch {
      pushToast("Gabim lidhjeje.", "error");
    } finally {
      setOfferBusyKey(null);
    }
  };

  const copyPortalLink = async (row: ClientRow) => {
    if (!row.contact?.portal_token) return;
    const url = `${window.location.origin}/klienti/${row.contact.portal_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(row.key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      prompt("Kopjoje lidhjen manualisht:", url);
    }
  };

  return (
    <div className="space-y-6">
      {renderToasts()}
      {renderConfirm()}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Klientë</p>
          <p className="mt-1 font-ui text-[22px] font-semibold text-[var(--a-text)]">{totals.count}</p>
        </div>
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Të ardhura të paguara</p>
          <p className="mt-1 font-ui text-[22px] font-semibold text-emerald-400">{formatMoney(totals.paid)}</p>
        </div>
        <div className={CARD + " p-4"}>
          <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">MRR (rekurrente aktive)</p>
          <p className="mt-1 font-ui text-[22px] font-semibold text-accent">{formatMoney(totals.mrr)}/muaj</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko klient, biznes ose email…"
          className={INPUT + " w-full max-w-sm"}
        />
        <button onClick={formOpen ? () => setFormOpen(false) : openCreate} className={BTN_GOLD}>
          {formOpen ? "Anulo" : "+ Shto klient"}
        </button>
      </div>

      {formOpen && (
        <div className={CARD + " space-y-3 p-5"}>
          <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">
            {editingRow ? `Redakto klientin — ${editingRow.name}` : "Klient i ri"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Emri *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Biznesi</label>
              <input value={form.business_name} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Shërbimi</label>
              <input
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                placeholder="p.sh. Website, SEO, Social Media…"
                className={INPUT + " w-full"}
              />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Telefoni</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={INPUT + " w-full"} />
            </div>
            <div>
              <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Klient që nga</label>
              <input type="date" value={form.since_date} onChange={(e) => setForm((f) => ({ ...f, since_date: e.target.value }))} className={INPUT + " w-full"} />
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
            <button onClick={handleSaveClient} disabled={saving || !form.name.trim()} className={BTN_GOLD}>
              {saving ? "Duke ruajtur…" : editingRow ? "Ruaj ndryshimet" : "Shto klientin"}
            </button>
            <button onClick={() => setFormOpen(false)} className={BTN_PLAIN}>
              Anulo
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={CARD}>
          <EmptyState
            text={
              clients.length === 0
                ? "Ende s'ka klientë. Një klient shfaqet këtu kur i krijohet një projekt, faturë e paguar ose pagesë rekurrente — ose shtoje manualisht me '+ Shto klient'."
                : "Asnjë klient nuk përputhet me kërkimin."
            }
          />
        </div>
      ) : (
        <div className={CARD + " overflow-x-auto"}>
          <table className="w-full min-w-[920px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[var(--a-border)] text-left text-[10px] uppercase tracking-[0.08em] text-[rgb(var(--a-text-rgb)/0.45)]">
                <th className="px-4 py-3 font-medium">Klienti</th>
                <th className="px-4 py-3 font-medium">Shërbimi</th>
                <th className="px-4 py-3 font-medium">Klient që nga</th>
                <th className="px-4 py-3 font-medium">Projektet</th>
                <th className="px-4 py-3 text-right font-medium">Paguar / Mujore</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.key} className="border-b border-[var(--a-border)] last:border-0 hover:bg-[rgb(var(--a-text-rgb)/0.02)]">
                  <td className="px-4 py-3 align-top">
                    <button
                      onClick={() => onGoToContact(row.name)}
                      className="block font-ui text-[13px] font-semibold text-[var(--a-text)] hover:text-accent"
                    >
                      {row.name}
                    </button>
                    {row.business && <p className="mt-0.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">{row.business}</p>}
                    {row.recurringCount > 0 ? (
                      <span className="mt-1 inline-block rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        rekurrent
                      </span>
                    ) : (
                      (row.paidTotal > 0 || row.projects.length > 0) && (
                        <span
                          className="mt-1 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400/90"
                          title="Klient pa plan mirëmbajtjeje — mundësi upsell-i"
                        >
                          pa mirëmbajtje
                        </span>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-[rgb(var(--a-text-rgb)/0.7)]">{row.service || "—"}</td>
                  <td className="px-4 py-3 align-top text-[rgb(var(--a-text-rgb)/0.7)]">{formatMonth(row.since)}</td>
                  <td className="px-4 py-3 align-top">
                    {row.projects.length === 0 ? (
                      <span className="text-[rgb(var(--a-text-rgb)/0.35)]">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {row.projects.map((p) => (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--a-border)] px-2 py-0.5 text-[10.5px] text-[rgb(var(--a-text-rgb)/0.65)]"
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
                            {p.name} · {PROJECT_STATUS_LABELS[p.status]}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    {row.paidTotal > 0 && (
                      <p className="font-ui text-[13px] font-semibold text-emerald-400">{formatMoney(row.paidTotal)}</p>
                    )}
                    {row.recurringMonthly > 0 && (
                      <p className="text-[11px] text-accent">{formatMoney(row.recurringMonthly)}/muaj</p>
                    )}
                    {row.pendingTotal > 0 && (
                      <p className="text-[10.5px] text-[rgb(var(--a-text-rgb)/0.45)]">{formatMoney(row.pendingTotal)} në pritje</p>
                    )}
                    {row.paidTotal === 0 && row.recurringMonthly === 0 && row.pendingTotal === 0 && (
                      <span className="text-[rgb(var(--a-text-rgb)/0.35)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-0.5">
                      {row.email && (
                        <a href={`mailto:${row.email}`} className="text-[rgb(var(--a-text-rgb)/0.6)] hover:text-accent">
                          {row.email}
                        </a>
                      )}
                      {row.phone && (
                        <a href={`tel:${row.phone}`} className="text-[rgb(var(--a-text-rgb)/0.6)] hover:text-accent">
                          {row.phone}
                        </a>
                      )}
                      {!row.email && !row.phone && <span className="text-[rgb(var(--a-text-rgb)/0.35)]">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => openEdit(row)} className={BTN_PLAIN}>
                        Redakto
                      </button>
                      {row.contact?.portal_token && (
                        <button onClick={() => copyPortalLink(row)} className={BTN_PLAIN}>
                          {copiedKey === row.key ? "U kopjua ✓" : "Portali"}
                        </button>
                      )}
                      {row.recurringCount === 0 && row.email && (
                        <button
                          onClick={() => sendMaintenanceOffer(row)}
                          disabled={offerBusyKey === row.key || offerSentKeys.has(row.key)}
                          className={BTN_PLAIN + " disabled:opacity-40"}
                          title="Dërgo email me planet e mirëmbajtjes"
                        >
                          {offerBusyKey === row.key ? "Duke dërguar…" : offerSentKeys.has(row.key) ? "Oferta u dërgua ✓" : "🛡 Mirëmbajtja"}
                        </button>
                      )}
                      {row.manualId && (
                        <button onClick={() => handleDeleteClient(row)} className={BTN_DANGER}>
                          Fshi
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
