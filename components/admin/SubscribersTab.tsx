"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD, EmptyState, formatDate, formatDay, useConfirm, useDebounced, useUndoToast } from "@/components/admin/ui";
import type { Subscriber, BroadcastStat } from "@/components/AdminDashboard";

const PAGE_SIZE = 10;

function downloadCSV(rows: Subscriber[]) {
  const header = "email,subscribed_at,unsubscribed\n";
  const body = rows.map((r) => `${r.email},${r.subscribed_at},${r.unsubscribed ? "po" : "jo"}`).join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function SubscribersChart({ subscribers }: { subscribers: Subscriber[] }) {
  const days = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    subscribers.forEach((s) => {
      const key = new Date(s.subscribed_at).toISOString().slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });

    return Array.from(map.entries());
  }, [subscribers]);

  const max = Math.max(1, ...days.map(([, count]) => count));

  return (
    <div className={CARD + " mb-5 p-5"}>
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
        Subscriber-a — 30 ditët e fundit
      </p>
      <div className="flex h-24 items-end gap-[3px]">
        {days.map(([date, count]) => (
          <div key={date} className="group relative flex-1">
            <div
              className="rounded-sm bg-accent/40 transition-colors group-hover:bg-accent"
              style={{ height: `${Math.max(3, (count / max) * 96)}px` }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-[var(--a-text)] opacity-0 transition-opacity group-hover:opacity-100">
              {formatDay(date)}: {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-30"
      >
        ← Prapa
      </button>
      <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-30"
      >
        Tjetër →
      </button>
    </div>
  );
}

export default function SubscribersTab({
  subscribers,
  setSubscribers,
  jumpSearch,
  broadcasts,
}: {
  subscribers: Subscriber[];
  setSubscribers: (s: Subscriber[]) => void;
  jumpSearch?: { term: string; key: number } | null;
  broadcasts: BroadcastStat[];
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [resendDone, setResendDone] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastScheduled, setBroadcastScheduled] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string>("");
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState<BroadcastStat[]>([]);
  const [confirm, renderConfirm] = useConfirm();
  const { showUndo, renderUndoToast } = useUndoToast();
  const debouncedSearch = useDebounced(search, 250);

  const activeCount = subscribers.filter((s) => !s.unsubscribed).length;

  useEffect(() => {
    if (jumpSearch) {
      setSearch(jumpSearch.term);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSearch?.key]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (q && !s.email.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && s.unsubscribed) return false;
      if (statusFilter === "unsubscribed" && !s.unsubscribed) return false;
      return true;
    });
  }, [subscribers, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const remove = async (id: number) => {
    if (!(await confirm({ title: "Fshi subscriber-in", message: "Të fshihet ky subscriber?", danger: true, confirmText: "Fshi" }))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSubscribers(subscribers.filter((s) => s.id !== id));
        setSelected((sel) => {
          const next = new Set(sel);
          next.delete(id);
          return next;
        });
      }
    } finally {
      setDeletingId(null);
    }
  };

  const toggleUnsubscribed = async (s: Subscriber) => {
    setSavingId(s.id);
    try {
      const res = await fetch(`/api/admin/subscribers/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsubscribed: !s.unsubscribed }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(subscribers.map((x) => (x.id === s.id ? { ...x, unsubscribed: !s.unsubscribed } : x)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const resendCode = async (id: number) => {
    setResendingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}/resend`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResendDone((d) => ({ ...d, [id]: true }));
        setTimeout(() => setResendDone((d) => ({ ...d, [id]: false })), 3000);
      }
    } finally {
      setResendingId(null);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!(await confirm({ title: "Fshi subscriber-at", message: `Të fshihen ${selected.size} subscriber-a? Ky veprim nuk kthehet mbrapsht.`, danger: true, confirmText: "Fshi" }))) return;
    const ids = Array.from(selected);
    const removed = subscribers.filter((s) => ids.includes(s.id));
    const remaining = subscribers.filter((s) => !ids.includes(s.id));
    setSubscribers(remaining);
    setSelected(new Set());
    showUndo(
      `${ids.length} subscriber-a u fshinë.`,
      () => setSubscribers([...removed, ...remaining]),
      async () => {
        setBulkBusy(true);
        try {
          await fetch("/api/admin/subscribers/bulk", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
        } finally {
          setBulkBusy(false);
        }
      }
    );
  };

  const sendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;
    const scheduledIso = broadcastScheduled ? new Date(broadcastScheduled).toISOString() : null;
    const willSchedule = !!scheduledIso && new Date(broadcastScheduled).getTime() > Date.now();
    if (
      !(await confirm({
        message: willSchedule
          ? `Të planifikohet ky email për ${new Date(broadcastScheduled).toLocaleString("sq-AL")}?`
          : `Të dërgohet ky email te ${activeCount} subscriber-a aktivë?`,
        confirmText: willSchedule ? "Planifiko" : "Dërgo",
      }))
    )
      return;
    setBroadcastSending(true);
    setBroadcastResult("");
    try {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: broadcastSubject, message: broadcastMessage, scheduled_for: scheduledIso }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.scheduled) {
          setBroadcastResult(`U planifikua për ${new Date(broadcastScheduled).toLocaleString("sq-AL")}.`);
          setScheduledBroadcasts((prev) => [
            {
              id: `pending-${Date.now()}`,
              subject: broadcastSubject,
              created_at: new Date().toISOString(),
              sent_count: activeCount,
              opens: 0,
              clicks: 0,
              scheduled_for: scheduledIso,
              sent_at: null,
            },
            ...prev,
          ]);
        } else {
          setBroadcastResult(`U dërgua te ${data.sent} subscriber-a.`);
        }
        setBroadcastSubject("");
        setBroadcastMessage("");
        setBroadcastScheduled("");
      } else {
        setBroadcastResult(data.error ?? "Gabim i panjohur.");
      }
    } catch {
      setBroadcastResult("Gabim lidhjeje.");
    } finally {
      setBroadcastSending(false);
    }
  };

  const allBroadcasts = useMemo(() => [...scheduledBroadcasts, ...broadcasts], [scheduledBroadcasts, broadcasts]);

  return (
    <div>
      {/* Broadcast composer */}
      <div className={CARD + " mb-5 p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Dërgo email te subscriber-at ({activeCount} aktivë)
        </p>
        <input
          type="text"
          value={broadcastSubject}
          onChange={(e) => setBroadcastSubject(e.target.value)}
          placeholder="Subjekti"
          className="font-ui mb-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          rows={5}
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          placeholder="Mesazhi..."
          className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={sendBroadcast}
            disabled={broadcastSending || !broadcastSubject.trim() || !broadcastMessage.trim() || activeCount === 0}
            className="font-ui rounded-[10px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
          >
            {broadcastSending
              ? "Duke dërguar…"
              : broadcastScheduled && new Date(broadcastScheduled).getTime() > Date.now()
                ? "Planifiko"
                : "Dërgo email"}
          </button>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-[rgb(var(--a-text-rgb)/0.4)]">Dërgo më vonë:</label>
            <input
              type="datetime-local"
              value={broadcastScheduled}
              onChange={(e) => setBroadcastScheduled(e.target.value)}
              className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            {broadcastScheduled && (
              <button
                onClick={() => setBroadcastScheduled("")}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Hiq
              </button>
            )}
          </div>
          {broadcastResult && <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">{broadcastResult}</span>}
        </div>
      </div>

      {/* Statistika broadcast-esh — opens & clicks */}
      {allBroadcasts.length > 0 && (
        <div className={CARD + " mb-5 p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Broadcast-et e fundit — hapje & klikime
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.12em] text-[rgb(var(--a-text-rgb)/0.35)]">
                  <th className="pb-2 pr-4 font-semibold">Subjekti</th>
                  <th className="pb-2 pr-4 font-semibold">Data</th>
                  <th className="pb-2 pr-4 text-right font-semibold">Dërguar</th>
                  <th className="pb-2 pr-4 text-right font-semibold">Hapje</th>
                  <th className="pb-2 pr-4 text-right font-semibold">Open rate</th>
                  <th className="pb-2 pr-4 text-right font-semibold">Klikime</th>
                  <th className="pb-2 text-right font-semibold">CTR</th>
                </tr>
              </thead>
              <tbody>
                {allBroadcasts.map((b) => {
                  const pending = !b.sent_at && !!b.scheduled_for;
                  const openRate = b.sent_count > 0 ? (b.opens / b.sent_count) * 100 : 0;
                  const ctr = b.sent_count > 0 ? (b.clicks / b.sent_count) * 100 : 0;
                  return (
                    <tr key={b.id} className="border-t border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.65)]">
                      <td className="max-w-[220px] truncate py-2.5 pr-4 text-[var(--a-text)]" title={b.subject}>
                        {b.subject}
                        {pending && (
                          <span className="ml-2 rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                            Planifikuar
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        {pending ? formatDate(b.scheduled_for!) : formatDate(b.created_at)}
                      </td>
                      <td className="py-2.5 pr-4 text-right">{pending ? "—" : b.sent_count}</td>
                      <td className="py-2.5 pr-4 text-right">{pending ? "—" : b.opens}</td>
                      <td className="py-2.5 pr-4 text-right text-accent">{pending ? "—" : `${openRate.toFixed(0)}%`}</td>
                      <td className="py-2.5 pr-4 text-right">{pending ? "—" : b.clicks}</td>
                      <td className="py-2.5 text-right text-accent">{pending ? "—" : `${ctr.toFixed(0)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
            Hapjet maten me tracking pixel (disa klientë email-i i bllokojnë), klikimet nga lidhjet e email-it. Numrat janë persona unikë.
          </p>
        </div>
      )}

      {/* Chart */}
      <SubscribersChart subscribers={subscribers} />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko email..."
          className="font-ui min-w-[200px] flex-1 rounded-[10px] border border-[var(--a-border)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          <option value="all">Të gjithë</option>
          <option value="active">Aktivë</option>
          <option value="unsubscribed">Çregjistruar</option>
        </select>
        <button
          onClick={() => downloadCSV(subscribers)}
          disabled={subscribers.length === 0}
          className="font-ui rounded-[10px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[10px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{selected.size} të zgjedhur</span>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[10px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            Fshi të zgjedhurit
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
          >
            Anulo
          </button>
        </div>
      )}

      <div className={CARD}>
        {pageItems.length === 0 && <EmptyState text="Ende nuk ka subscriber-a." />}
        {pageItems.map((s, i) => (
          <div
            key={s.id}
            className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
              i !== pageItems.length - 1 ? "border-b border-[var(--a-border)]" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(s.id)}
                onChange={() => toggleSelect(s.id)}
                className="accent-accent"
              />
              <span className="truncate text-[14px] text-[rgb(var(--a-text-rgb)/0.8)]" title={s.email}>{s.email}</span>
              {s.unsubscribed && (
                <span className="shrink-0 rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.4)]">
                  Çregjistruar
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{formatDate(s.subscribed_at)}</span>
              <button
                onClick={() => resendCode(s.id)}
                disabled={resendingId === s.id}
                className="text-[12px] text-accent/80 transition-colors hover:text-accent disabled:opacity-50"
              >
                {resendingId === s.id ? "Duke dërguar…" : resendDone[s.id] ? "U dërgua ✓" : "Ridërgo kodin"}
              </button>
              <button
                onClick={() => toggleUnsubscribed(s)}
                disabled={savingId === s.id}
                className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)] transition-colors hover:text-[var(--a-text)] disabled:opacity-50"
              >
                {s.unsubscribed ? "Aktivizo" : "Çregjistro"}
              </button>
              <button
                onClick={() => remove(s.id)}
                disabled={deletingId === s.id}
                className="text-[12px] text-red-400/70 transition-colors hover:text-red-400 disabled:opacity-50"
              >
                Fshi
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      {renderConfirm()}
      {renderUndoToast()}
    </div>
  );
}
