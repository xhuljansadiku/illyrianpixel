"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD, INPUT, EmptyState, SkeletonRows, useDebounced } from "@/components/admin/ui";

type ActivityRow = {
  id: number;
  entity: string;
  action: string;
  label: string;
  created_at: string;
};

const ENTITY_META: Record<string, { icon: string; label: string }> = {
  blog: { icon: "📝", label: "Blog" },
  quote: { icon: "🧾", label: "Oferta & Fatura" },
  recurring: { icon: "🔁", label: "Të rikurrueshme" },
  project: { icon: "📁", label: "Projekte" },
  task: { icon: "☑️", label: "Detyra" },
  faq: { icon: "❓", label: "FAQ" },
  testimonial: { icon: "💬", label: "Testimoniale" },
  portfolio: { icon: "🖼️", label: "Portofoli" },
  pricing: { icon: "💶", label: "Çmime" },
  contact: { icon: "📇", label: "Kontakte" },
  newsletter: { icon: "✉️", label: "Newsletter" },
  settings: { icon: "⚙️", label: "Cilësime" },
  auto: { icon: "🤖", label: "Automatike" },
  client: { icon: "👤", label: "Nga klientët" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "tani";
  if (min < 60) return `para ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `para ${hours} or${hours === 1 ? "e" : "ësh"}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `para ${days} dit${days === 1 ? "e" : "ësh"}`;
  return new Date(iso).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Sot";
  if (sameDay(d, yesterday)) return "Dje";
  return d.toLocaleDateString("sq-AL", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export default function ActivityTab() {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const debouncedSearch = useDebounced(search, 250);

  const buildParams = () => {
    const params = new URLSearchParams();
    const limit = dateFrom || dateTo ? "1000" : "300";
    params.set("limit", limit);
    if (dateFrom) params.set("since", new Date(`${dateFrom}T00:00:00`).toISOString());
    if (dateTo) params.set("until", new Date(`${dateTo}T23:59:59.999`).toISOString());
    return { params, limit: Number(limit) };
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const { params, limit } = buildParams();
        const res = await fetch(`/api/admin/activity?${params}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setRows(data.activity);
          setHasMore(data.activity.length >= limit);
        } else setError(data.error ?? "Gabim në ngarkim.");
      } catch {
        if (!cancelled) setError("Gabim lidhjeje.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { params, limit } = buildParams();
      params.set("offset", String(rows.length));
      const res = await fetch(`/api/admin/activity?${params}`);
      const data = await res.json();
      if (data.success) {
        setRows([...rows, ...data.activity]);
        setHasMore(data.activity.length >= limit);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return rows.filter((r) => {
      if (entityFilter !== "all" && r.entity !== entityFilter) return false;
      if (q && !r.label.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, entityFilter, debouncedSearch]);

  // Grupimi sipas ditës
  const grouped = useMemo(() => {
    const groups: { day: string; items: ActivityRow[] }[] = [];
    for (const r of filtered) {
      const day = dayLabel(r.created_at);
      const last = groups[groups.length - 1];
      if (last && last.day === day) last.items.push(r);
      else groups.push({ day, items: [r] });
    }
    return groups;
  }, [filtered]);

  const usedEntities = useMemo(
    () => Array.from(new Set(rows.map((r) => r.entity))).filter((e) => ENTITY_META[e]),
    [rows]
  );

  return (
    <div>
      {/* Filtrat */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Kërko në histori…"
          className={INPUT + " min-w-[220px]"}
        />
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className={INPUT}>
          <option value="all">Të gjitha llojet</option>
          {usedEntities.map((e) => (
            <option key={e} value={e}>
              {ENTITY_META[e].icon} {ENTITY_META[e].label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo || undefined}
            className={INPUT}
            title="Nga data"
          />
          <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || undefined}
            className={INPUT}
            title="Deri më"
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] underline-offset-2 hover:text-accent hover:underline"
            >
              Pastro
            </button>
          )}
        </div>
        <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">{filtered.length} veprime</span>
      </div>

      {loading && <SkeletonRows rows={6} />}
      {error && <p className="p-8 text-center text-[13px] text-red-400/80">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState text="Asnjë veprim ende — historia mbushet vetë teksa punon në panel." />
      )}

      <div className="space-y-5">
        {grouped.map((g) => (
          <div key={g.day}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.35)]">
              {g.day}
            </p>
            <div className={CARD}>
              <ul className="divide-y divide-[var(--a-border)]">
                {g.items.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-0.5 text-[15px]" title={ENTITY_META[r.entity]?.label ?? r.entity}>
                      {ENTITY_META[r.entity]?.icon ?? "•"}
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.75)]">
                      {r.label}
                    </span>
                    <span
                      className="shrink-0 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]"
                      title={new Date(r.created_at).toLocaleString("sq-AL")}
                    >
                      {relativeTime(r.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
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
    </div>
  );
}
