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

type ClientRow = {
  key: string;
  name: string;
  business: string | null;
  email: string | null;
  phone: string | null;
  contact: Contact | null;
  projects: ProjectRecord[];
  paidTotal: number;
  pendingTotal: number;
  recurringMonthly: number;
  recurringCount: number;
  lastActivity: string;
};

function normalize(name: string) {
  return name.trim().toLowerCase();
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
    contact: Contact | null,
    at: string
  ) => {
    let row = map.get(key);
    if (!row) {
      row = { key, name, business, email, phone, contact, projects: [], paidTotal: 0, pendingTotal: 0, recurringMonthly: 0, recurringCount: 0, lastActivity: at };
      map.set(key, row);
    }
    if (!row.contact && contact) row.contact = contact;
    if (!row.business && business) row.business = business;
    if (!row.email && email) row.email = email;
    if (!row.phone && phone) row.phone = phone;
    if (at && at > row.lastActivity) row.lastActivity = at;
    return row;
  };

  for (const c of contacts) {
    if ((c.status || "new") !== "done") continue;
    const key = keyFor(c.id, c.name);
    ensure(key, c.name, c.business_name, c.email, c.phone, c, c.created_at);
  }

  for (const p of projects) {
    const name = p.client_name || "Klient pa emër";
    const contact = findContact(p.contact_id);
    const key = keyFor(p.contact_id, name);
    const row = ensure(key, name, contact?.business_name ?? null, contact?.email ?? null, contact?.phone ?? null, contact, p.updated_at || p.created_at);
    row.projects.push(p);
  }

  for (const q of quotes) {
    const contact = findContact(q.contact_id);
    const key = keyFor(q.contact_id, q.client_name);
    const row = ensure(key, q.client_name, q.client_business, q.client_email, contact?.phone ?? null, contact, q.updated_at || q.created_at);
    const totals = quoteTotals(q.items, q.discount, q.tax_rate);
    if (q.status === "paid") row.paidTotal += totals.total;
    else if (q.status === "sent" || q.status === "accepted") row.pendingTotal += totals.total;
  }

  for (const r of recurring) {
    if (!r.active) continue;
    const contact = findContact(r.contact_id);
    const key = keyFor(r.contact_id, r.client_name);
    const row = ensure(key, r.client_name, r.client_business, r.client_email, contact?.phone ?? null, contact, r.created_at);
    const totals = quoteTotals(r.items, r.discount, r.tax_rate);
    row.recurringMonthly += totals.total;
    row.recurringCount += 1;
  }

  return Array.from(map.values()).sort(
    (a, b) => b.paidTotal + b.recurringMonthly * 12 - (a.paidTotal + a.recurringMonthly * 12)
  );
}

function formatDay(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
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
  const { renderToasts } = useToasts();

  const clients = useMemo(() => buildClients(contacts, projects, quotes, recurring), [contacts, projects, quotes, recurring]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.business ?? "").toLowerCase().includes(term) ||
        (c.email ?? "").toLowerCase().includes(term)
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

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Kërko klient, biznes ose email…"
        className={INPUT + " w-full max-w-sm"}
      />

      {filtered.length === 0 ? (
        <div className={CARD}>
          <EmptyState
            text={
              clients.length === 0
                ? "Ende s'ka klientë. Një kontakt bëhet klient kur shënohet 'Përfunduar' te Kontaktet, ose kur i krijohet një projekt/faturë/pagesë rekurrente."
                : "Asnjë klient nuk përputhet me kërkimin."
            }
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((row) => (
            <div key={row.key} className={CARD + " p-4"}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onGoToContact(row.name)}
                      className="font-ui text-[14px] font-semibold text-[var(--a-text)] hover:text-accent"
                    >
                      {row.name}
                    </button>
                    {row.business && (
                      <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">{row.business}</span>
                    )}
                    {row.recurringCount > 0 && (
                      <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        rekurrent
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.55)]">
                    {row.email && (
                      <a href={`mailto:${row.email}`} className="hover:text-accent">
                        {row.email}
                      </a>
                    )}
                    {row.phone && (
                      <a href={`tel:${row.phone}`} className="hover:text-accent">
                        {row.phone}
                      </a>
                    )}
                    <span>Aktivitet i fundit: {formatDay(row.lastActivity)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    {row.paidTotal > 0 && (
                      <p className="font-ui text-[14px] font-semibold text-emerald-400">{formatMoney(row.paidTotal)}</p>
                    )}
                    {row.recurringMonthly > 0 && (
                      <p className="text-[11px] text-accent">{formatMoney(row.recurringMonthly)}/muaj</p>
                    )}
                    {row.pendingTotal > 0 && (
                      <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.45)]">{formatMoney(row.pendingTotal)} në pritje</p>
                    )}
                  </div>
                  {row.contact?.portal_token && (
                    <button onClick={() => copyPortalLink(row)} className={BTN_PLAIN}>
                      {copiedKey === row.key ? "U kopjua ✓" : "Lidhja e portalit"}
                    </button>
                  )}
                </div>
              </div>

              {row.projects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--a-border)] pt-3">
                  {row.projects.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--a-border)] px-2.5 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.65)]"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
                      {p.name} · {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ClientPortalSettings />
    </div>
  );
}

function ClientPortalSettings() {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [pinForm, setPinForm] = useState({ pin: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    fetch("/api/admin/clients-pin")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHasPin(d.hasPin);
      })
      .catch(() => setHasPin(false));
  }, []);

  const handleSetPin = async () => {
    if (pinForm.pin.length < 4) return pushToast("PIN-i duhet të jetë të paktën 4 shifra.", "error");
    if (pinForm.pin !== pinForm.confirm) return pushToast("PIN-at nuk përputhen.", "error");
    setSaving(true);
    const res = await fetch("/api/admin/clients-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinForm.pin }),
    }).then((r) => r.json());
    setSaving(false);
    if (res.success) {
      setHasPin(true);
      setPinForm({ pin: "", confirm: "" });
      pushToast("PIN-i u vendos me sukses.", "success");
    } else pushToast(res.error ?? "Gabim.", "error");
  };

  const handleRemovePin = async () => {
    const ok = await confirm({ title: "Hiq PIN-in", message: "Zona e klientëve do të bëhet e aksesueshme pa PIN.", danger: true, confirmText: "Hiq PIN" });
    if (!ok) return;
    const res = await fetch("/api/admin/clients-pin", { method: "DELETE" }).then((r) => r.json());
    if (res.success) {
      setHasPin(false);
      pushToast("PIN-i u hoq.", "success");
    } else pushToast(res.error ?? "Gabim.", "error");
  };

  return (
    <div className={CARD + " p-5 space-y-4"}>
      {renderToasts()}
      {renderConfirm()}
      <div>
        <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">PIN i portalit individual (opsionale)</p>
        <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.55)]">
          Çdo klient ka linkun e vet (<span className="text-[var(--a-text)]">/klienti/token</span>) te lista më sipër. Ky PIN shtesë kërkohet çdo herë që hapet ai link, si mbrojtje shtesë.
        </p>
      </div>

      {hasPin === null ? (
        <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Duke ngarkuar…</p>
      ) : hasPin ? (
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-emerald-400">● PIN aktiv</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setHasPin(false);
                setTimeout(() => setHasPin(null), 0);
                setPinForm({ pin: "", confirm: "" });
              }}
              className={BTN_PLAIN}
            >
              Ndrysho PIN
            </button>
            <button onClick={handleRemovePin} className={BTN_DANGER}>
              Hiq PIN
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-xs space-y-3">
          <div>
            <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">PIN i ri (4–12 shifra)</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinForm.pin}
              onChange={(e) => setPinForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 12) }))}
              placeholder="••••"
              className={INPUT + " w-full"}
            />
          </div>
          <div>
            <label className="mb-1 block font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)]">Konfirmo PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinForm.confirm}
              onChange={(e) => setPinForm((f) => ({ ...f, confirm: e.target.value.replace(/\D/g, "").slice(0, 12) }))}
              placeholder="••••"
              className={INPUT + " w-full"}
            />
          </div>
          <button
            onClick={handleSetPin}
            disabled={saving || pinForm.pin.length < 4 || pinForm.pin !== pinForm.confirm}
            className={BTN_GOLD}
          >
            {saving ? "Duke ruajtur…" : "Vendos PIN"}
          </button>
        </div>
      )}
    </div>
  );
}
