"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD, INPUT, EmptyState, SkeletonRows, useDebounced } from "@/components/admin/ui";

type AssistantMessage = {
  id: number;
  session_id: string;
  role: "you" | "bot";
  content: string;
  matched: boolean;
  created_at: string;
};

type Conversation = {
  sessionId: string;
  messages: AssistantMessage[];
  lastAt: string;
  hasUnmatched: boolean;
};

const LIMIT = 200;

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

export default function AssistantTab() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [onlyUnmatched, setOnlyUnmatched] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debouncedSearch = useDebounced(search, 250);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams({ limit: String(LIMIT) });
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
        const res = await fetch(`/api/admin/assistant?${params}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setMessages(data.messages);
          setHasMore(data.messages.length >= LIMIT);
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
  }, [debouncedSearch]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(messages.length) });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      const res = await fetch(`/api/admin/assistant?${params}`);
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, ...data.messages]);
        setHasMore(data.messages.length >= LIMIT);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, AssistantMessage[]>();
    for (const m of messages) {
      const arr = map.get(m.session_id) ?? [];
      arr.push(m);
      map.set(m.session_id, arr);
    }
    const list: Conversation[] = [];
    for (const [sessionId, msgs] of map) {
      const sorted = [...msgs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      list.push({
        sessionId,
        messages: sorted,
        lastAt: sorted[sorted.length - 1].created_at,
        hasUnmatched: sorted.some((m) => m.role === "bot" && !m.matched),
      });
    }
    return list
      .filter((c) => !onlyUnmatched || c.hasUnmatched)
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  }, [messages, onlyUnmatched]);

  const toggle = (sessionId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Kërko në mesazhe…"
          className={INPUT + " min-w-[220px]"}
        />
        <label className="flex items-center gap-2 font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.6)]">
          <input type="checkbox" checked={onlyUnmatched} onChange={(e) => setOnlyUnmatched(e.target.checked)} />
          Vetëm pa përgjigje të sigurt
        </label>
        <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">{conversations.length} biseda</span>
      </div>

      {loading && <SkeletonRows rows={6} />}
      {error && <p className="p-8 text-center text-[13px] text-red-400/80">{error}</p>}

      {!loading && !error && conversations.length === 0 && (
        <EmptyState text="Asnjë bisedë ende — kur vizitorët pyesin Mbretin Genti, biseda shfaqet këtu." />
      )}

      <div className="space-y-3">
        {conversations.map((c) => {
          const isOpen = expanded.has(c.sessionId);
          const preview = c.messages.find((m) => m.role === "you");
          return (
            <div key={c.sessionId} className={CARD}>
              <button
                type="button"
                onClick={() => toggle(c.sessionId)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-[rgb(var(--a-text-rgb)/0.8)]">
                    {preview ? preview.content : c.messages[0]?.content}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">
                    {c.messages.length} mesazhe · {relativeTime(c.lastAt)}
                  </p>
                </div>
                {c.hasUnmatched && (
                  <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">
                    pa përgjigje
                  </span>
                )}
                <span className="shrink-0 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-[var(--a-border)] px-5 py-3">
                  {c.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-lg border px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                        m.role === "bot"
                          ? `border-white/10 bg-white/[0.03] text-[rgb(var(--a-text-rgb)/0.75)] ${
                              !m.matched ? "border-amber-400/25" : ""
                            }`
                          : "border-accent/25 bg-accent/[0.06] text-[rgb(var(--a-text-rgb)/0.88)]"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>
              )}
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
    </div>
  );
}
