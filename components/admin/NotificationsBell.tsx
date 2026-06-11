"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminTab } from "@/components/AdminDashboard";

type NotificationRow = {
  id: number;
  entity: string;
  action: string;
  label: string;
  created_at: string;
};

const WHITELIST_ENTITIES = "client,newsletter,auto";

const ENTITY_META: Record<string, { icon: string; tab: AdminTab }> = {
  client: { icon: "📇", tab: "contacts" },
  newsletter: { icon: "✉️", tab: "subscribers" },
  auto: { icon: "🤖", tab: "history" },
};

const SEEN_KEY = "admin_notif_last_seen";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "tani";
  if (min < 60) return `para ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `para ${hours} or${hours === 1 ? "e" : "ësh"}`;
  const days = Math.floor(hours / 24);
  return `para ${days} dit${days === 1 ? "e" : "ësh"}`;
}

function notificationTab(row: NotificationRow): AdminTab {
  if (row.entity === "client" && (row.action === "accept" || row.action === "decline")) return "quotes";
  return ENTITY_META[row.entity]?.tab ?? "history";
}

function playPing() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // audio not available
  }
}

export default function NotificationsBell({
  setTab,
  collapsed,
}: {
  setTab: (tab: AdminTab) => void;
  collapsed?: boolean;
}) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const lastSeenRef = useRef<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ngarkimi fillestar
  useEffect(() => {
    if (typeof window !== "undefined") {
      lastSeenRef.current = window.localStorage.getItem(SEEN_KEY) || "1970-01-01T00:00:00.000Z";
    }
    (async () => {
      try {
        const res = await fetch(`/api/admin/activity?entities=${WHITELIST_ENTITIES}&limit=20`);
        const data = await res.json();
        if (data.success) {
          setItems(data.activity);
          setUnread(data.activity.filter((r: NotificationRow) => r.created_at > lastSeenRef.current).length);
        }
      } catch {
        // injoro — provo në poll-in tjetër
      }
    })();
  }, []);

  // Poll për njoftime të reja
  useEffect(() => {
    const interval = setInterval(async () => {
      const newest = items[0]?.created_at;
      if (!newest) return;
      try {
        const res = await fetch(`/api/admin/activity?entities=${WHITELIST_ENTITIES}&since=${encodeURIComponent(newest)}&limit=20`);
        const data = await res.json();
        if (data.success && data.activity.length > 0) {
          setItems((prev) => [...data.activity, ...prev].slice(0, 30));
          setUnread((u) => u + data.activity.length);
          playPing();
        }
      } catch {
        // ignore — retry next tick
      }
    }, 45000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Mbyll dropdown-in kur klikohet jashtë
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        const now = new Date().toISOString();
        lastSeenRef.current = now;
        if (typeof window !== "undefined") window.localStorage.setItem(SEEN_KEY, now);
        setUnread(0);
      }
      return next;
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleOpen}
        title="Njoftimet"
        className="relative rounded-[2px] border border-[var(--a-border)] p-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-80 max-w-[80vw] rounded-[2px] border border-[var(--a-border)] bg-[var(--a-card)] shadow-xl backdrop-blur-[12px] ${
            collapsed ? "left-0" : "right-0"
          }`}
        >
          <div className="border-b border-[var(--a-border)] px-4 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
              Njoftimet
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">
                Asnjë njoftim ende.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--a-border)]">
                {items.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => {
                        setTab(notificationTab(r));
                        setOpen(false);
                      }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.04)]"
                    >
                      <span className="mt-0.5 text-[15px]">{ENTITY_META[r.entity]?.icon ?? "•"}</span>
                      <span className="min-w-0 flex-1 text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.75)]">
                        {r.label}
                      </span>
                      <span className="shrink-0 text-[10px] text-[rgb(var(--a-text-rgb)/0.35)]">
                        {relativeTime(r.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
