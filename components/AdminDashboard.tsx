"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

type Contact = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  business_name: string | null;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  discount_code: string | null;
  status: string | null;
  notes: string | null;
  assigned_to: string | null;
  follow_up_date: string | null;
  tags: string[] | null;
};

type ContactLog = {
  id: number;
  contact_id: number;
  action: string;
  detail: string | null;
  created_at: string;
};

type ContactNote = {
  id: number;
  contact_id: string;
  text: string;
  created_at: string;
  updated_at: string;
};

type Subscriber = {
  id: number;
  email: string;
  subscribed_at: string;
  unsubscribed: boolean;
};

type BlogPost = {
  id: number;
  created_at: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
};

type StaticPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
};

type Stats = {
  totalContacts: number;
  totalSubscribers: number;
  contactsThisWeek: number;
  subscribersThisWeek: number;
  discountUsed: number;
  conversionRate: number;
  avgDaysToClose: number | null;
  topServices: { service: string; count: number }[];
};

type AdminLogin = {
  id: number;
  success: boolean;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

type SiteSettings = {
  newsletter_discount_code: string;
  whatsapp_number: string;
};

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[#262626] bg-[rgba(10,10,10,0.72)] backdrop-blur-[12px]";

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<string, string> = {
  new: "I ri",
  "in-progress": "Në proces",
  done: "Mbyllur",
};

const STATUS_COLORS: Record<string, string> = {
  new: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  "in-progress": "border-yellow-400/30 bg-yellow-400/8 text-yellow-300",
  done: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
};

const STATUS_COLUMNS = ["new", "in-progress", "done"] as const;

const LOG_ACTION_LABELS: Record<string, (detail: string | null) => string> = {
  status: (d) => `Statusi u ndryshua → ${d}`,
  assigned_to: (d) => (d ? `U caktua tek ${d}` : "U hoq caktimi"),
  follow_up_date: (d) => (d ? `Data e ndjekjes u vendos: ${formatDay(`${d}T00:00:00`)}` : "U hoq data e ndjekjes"),
};

function isOverdue(c: Contact) {
  if (!c.follow_up_date) return false;
  if ((c.status || "new") === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${c.follow_up_date}T00:00:00`) < today;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit" });
}

function whatsappHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "355" + digits.slice(1);
  if (!digits.startsWith("355") && digits.length <= 9) digits = "355" + digits;
  return `https://wa.me/${digits}`;
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

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

function downloadContactsCSV(rows: Contact[]) {
  const columns = [
    "name", "email", "phone", "business_name", "service", "budget", "timeline",
    "status", "assigned_to", "follow_up_date", "tags", "discount_code", "created_at", "message",
  ];
  const header = columns.join(",") + "\n";
  const body = rows
    .map((c) =>
      [
        c.name, c.email, c.phone, c.business_name ?? "", c.service, c.budget, c.timeline,
        STATUS_LABELS[c.status || "new"] ?? c.status ?? "",
        c.assigned_to ?? "", c.follow_up_date ?? "", (c.tags ?? []).join("; "),
        c.discount_code ?? "", c.created_at, c.message,
      ]
        .map((v) => csvCell(String(v ?? "")))
        .join(",")
    )
    .join("\n");
  const blob = new Blob(["﻿" + header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kontaktet-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({
  contacts: initialContacts,
  subscribers: initialSubscribers,
  blogPosts: initialBlogPosts,
  staticPosts,
  stats,
  adminLogins,
  siteSettings,
}: {
  contacts: Contact[];
  subscribers: Subscriber[];
  blogPosts: BlogPost[];
  staticPosts: StaticPost[];
  stats: Stats;
  adminLogins: AdminLogin[];
  siteSettings: SiteSettings;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "contacts" | "subscribers" | "blog" | "analytics" | "settings">("overview");
  const [contacts, setContacts] = useState(initialContacts);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [contactsJump, setContactsJump] = useState<{ term: string; key: number } | null>(null);
  const [subscribersJump, setSubscribersJump] = useState<{ term: string; key: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("admin_sidebar_collapsed") === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      }
      return next;
    });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const today = new Date().toISOString().slice(0, 10);
  const dueSoonCount = contacts.filter((c) => {
    if ((c.status || "new") === "done") return false;
    if (!c.follow_up_date) return false;
    return c.follow_up_date <= today;
  }).length;

  const NAV_ITEMS: { id: typeof tab; icon: string; label: string; count?: number; alert?: number }[] = [
    { id: "overview", icon: "🏠", label: "Përmbledhje" },
    { id: "contacts", icon: "📇", label: "Kontaktet", count: contacts.length, alert: dueSoonCount },
    { id: "subscribers", icon: "✉️", label: "Newsletter", count: subscribers.length },
    { id: "blog", icon: "📝", label: "Blog", count: blogPosts.length + staticPosts.length },
    { id: "analytics", icon: "📊", label: "Analitika" },
    { id: "settings", icon: "⚙️", label: "Cilësimet" },
  ];

  const TAB_TITLES: Record<typeof tab, { title: string; subtitle: string }> = {
    overview: { title: "Përmbledhje", subtitle: "Pamje e përgjithshme e aktivitetit" },
    contacts: { title: "Kontaktet", subtitle: "Menaxho kontaktet dhe lead-et" },
    subscribers: { title: "Newsletter", subtitle: "Abonentët dhe email broadcast" },
    blog: { title: "Blog", subtitle: "Artikujt e blogut" },
    analytics: { title: "Analitika", subtitle: "Statistika dhe performanca" },
    settings: { title: "Cilësimet", subtitle: "Konfigurime dhe siguria" },
  };

  const globalResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;
    const contactMatches = contacts
      .filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q))
      .slice(0, 4);
    const subscriberMatches = subscribers.filter((s) => s.email.toLowerCase().includes(q)).slice(0, 3);
    const blogMatches = [...blogPosts, ...staticPosts]
      .filter((p) => p.title.toLowerCase().includes(q))
      .slice(0, 3);
    return { contactMatches, subscriberMatches, blogMatches };
  }, [globalSearch, contacts, subscribers, blogPosts, staticPosts]);

  const goToContact = (term: string) => {
    setTab("contacts");
    setContactsJump({ term, key: Date.now() });
    setGlobalSearch("");
  };

  const goToSubscriber = (term: string) => {
    setTab("subscribers");
    setSubscribersJump({ term, key: Date.now() });
    setGlobalSearch("");
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* Sidebar (desktop) */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#262626] bg-[rgba(10,10,10,0.6)] py-8 transition-all duration-200 md:flex ${
          collapsed ? "w-[68px] px-2" : "w-60 px-4"
        }`}
      >
        <div className={`flex items-center justify-between ${collapsed ? "px-0" : "px-2"}`}>
          {!collapsed && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
              <h1 className="mt-2 font-display text-[1.4rem] font-bold text-white">Admin Panel</h1>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Zgjero menynë" : "Mbylle menynë"}
            className={`rounded-[2px] border border-[#262626] p-1.5 text-[12px] text-white/40 transition-colors hover:border-accent/50 hover:text-white ${collapsed ? "mx-auto mt-1" : ""}`}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* Global search */}
        {!collapsed && (
          <div className="relative mt-6 px-2">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="🔍 Kërko gjithçka..."
              className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
            />
            {globalResults && (
              <div className="absolute left-2 right-2 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-[2px] border border-[#262626] bg-[#0a0a0a] shadow-xl">
                {globalResults.contactMatches.length === 0 &&
                globalResults.subscriberMatches.length === 0 &&
                globalResults.blogMatches.length === 0 ? (
                  <p className="px-3 py-3 text-[11px] text-white/35">Asnjë rezultat.</p>
                ) : (
                  <>
                    {globalResults.contactMatches.length > 0 && (
                      <div className="border-b border-[#262626] py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-white/30">Kontakte</p>
                        {globalResults.contactMatches.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => goToContact(c.email)}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            {c.name} <span className="text-white/35">· {c.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {globalResults.subscriberMatches.length > 0 && (
                      <div className="border-b border-[#262626] py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-white/30">Newsletter</p>
                        {globalResults.subscriberMatches.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => goToSubscriber(s.email)}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            {s.email}
                          </button>
                        ))}
                      </div>
                    )}
                    {globalResults.blogMatches.length > 0 && (
                      <div className="py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-white/30">Blog</p>
                        {globalResults.blogMatches.map((p) => (
                          <button
                            key={p.slug}
                            onClick={() => {
                              setTab("blog");
                              setGlobalSearch("");
                            }}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            {p.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`font-ui flex items-center justify-between rounded-[2px] px-3 py-2.5 text-left text-[13px] font-semibold tracking-[0.3px] transition-colors duration-200 ${
                tab === item.id
                  ? "bg-accent/10 text-white border-l-2 border-accent"
                  : "text-white/45 border-l-2 border-transparent hover:text-white/80 hover:bg-white/[0.03]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="relative">
                  {item.icon}
                  {!!item.alert && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                      {item.alert > 9 ? "9+" : item.alert}
                    </span>
                  )}
                </span>
                {!collapsed && item.label}
              </span>
              {!collapsed && item.count !== undefined && (
                <span className="text-[11px] text-white/30">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={logout}
          title={collapsed ? "Dil" : undefined}
          className="font-ui mt-4 rounded-[2px] border border-[#262626] px-5 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-white/60 transition-colors duration-300 hover:border-accent/50 hover:text-white"
        >
          {collapsed ? "⏻" : "Dil"}
        </button>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Mobile header */}
          <div className="flex items-center justify-between md:hidden">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
              <h1 className="mt-2 font-display text-[1.8rem] font-bold text-white">Admin Panel</h1>
            </div>
            <button
              onClick={logout}
              className="font-ui rounded-[2px] border border-[#262626] px-5 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-white/60 transition-colors duration-300 hover:border-accent/50 hover:text-white"
            >
              Dil
            </button>
          </div>

          {/* Mobile tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[#262626] md:hidden">
            {NAV_ITEMS.map((item) => (
              <TabButton key={item.id} active={tab === item.id} onClick={() => setTab(item.id)}>
                {item.icon} {item.label}{item.count !== undefined ? ` (${item.count})` : ""}
                {!!item.alert && <span className="ml-1 text-red-400">●</span>}
              </TabButton>
            ))}
          </div>

          {/* Page title */}
          <div className="mt-6 hidden md:block">
            <h2 className="font-display text-[1.6rem] font-bold text-white">{TAB_TITLES[tab].title}</h2>
            <p className="mt-1 text-[12px] text-white/35">{TAB_TITLES[tab].subtitle}</p>
          </div>

          {tab === "contacts" && (
            <>
              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4 md:mt-4 md:grid-cols-3 lg:grid-cols-5">
                <StatCard label="Kontakte gjithsej" value={stats.totalContacts} />
                <StatCard label="Kjo javë" value={stats.contactsThisWeek} />
                <StatCard label="Subscriber-a" value={stats.totalSubscribers} />
                <StatCard label="Subscriber-a (javë)" value={stats.subscribersThisWeek} />
                <StatCard label="Me kod zbritjeje" value={stats.discountUsed} />
              </div>

              {/* Chart */}
              <ContactsChart contacts={contacts} />
            </>
          )}

          {/* Content */}
          <div className="mt-6">
            {tab === "overview" && (
              <OverviewTab contacts={contacts} subscribers={subscribers} stats={stats} adminLogins={adminLogins} onGoToContact={goToContact} />
            )}
            {tab === "contacts" && <ContactsTab contacts={contacts} setContacts={setContacts} jumpSearch={contactsJump} />}
            {tab === "subscribers" && (
              <SubscribersTab subscribers={subscribers} setSubscribers={setSubscribers} jumpSearch={subscribersJump} />
            )}
            {tab === "blog" && (
              <BlogTab posts={blogPosts} setPosts={setBlogPosts} staticPosts={staticPosts} />
            )}
            {tab === "analytics" && <AnalyticsTab stats={stats} />}
            {tab === "settings" && <SettingsTab adminLogins={adminLogins} initialSettings={siteSettings} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={CARD + " p-5"}>
      <p className="font-display text-[2rem] font-bold text-white">{value}</p>
      <p className="mt-1 text-[12px] text-white/40">{label}</p>
    </div>
  );
}

// ── Tab button ─────────────────────────────────────────────────────────────
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`font-ui px-4 py-3 text-[13px] font-semibold tracking-[0.3px] transition-colors duration-300 ${
        active ? "border-b-2 border-accent text-white" : "text-white/40 hover:text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="p-8 text-center text-[13px] text-white/35">{text}</p>;
}

// ── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  contacts,
  subscribers,
  stats,
  adminLogins,
  onGoToContact,
}: {
  contacts: Contact[];
  subscribers: Subscriber[];
  stats: Stats;
  adminLogins: AdminLogin[];
  onGoToContact: (term: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const followUps = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 2);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return contacts
      .filter((c) => (c.status || "new") !== "done" && c.follow_up_date && c.follow_up_date <= cutoffStr)
      .sort((a, b) => (a.follow_up_date! < b.follow_up_date! ? -1 : 1));
  }, [contacts]);

  const recentContacts = useMemo(
    () => [...contacts].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 5),
    [contacts]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Kontakte gjithsej" value={stats.totalContacts} />
        <StatCard label="Kjo javë" value={stats.contactsThisWeek} />
        <StatCard label="Subscriber-a aktivë" value={subscribers.filter((s) => !s.unsubscribed).length} />
        <StatCard label="Norma e konvertimit (%)" value={Math.round(stats.conversionRate)} />
      </div>

      {/* Follow-ups */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Ndjekje urgjente ({followUps.length})
        </p>
        {followUps.length === 0 ? (
          <EmptyState text="Asnjë ndjekje brenda 48 orëve të ardhshme." />
        ) : (
          <ul className="space-y-2">
            {followUps.map((c) => {
              const overdue = isOverdue(c);
              const label = c.follow_up_date === today ? "Sot" : overdue ? "Vonuar" : formatDay(`${c.follow_up_date}T00:00:00`);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onGoToContact(c.email)}
                    className="flex w-full items-center justify-between rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-left transition-colors hover:border-accent/50"
                  >
                    <span className="text-[13px] text-white/80">
                      {c.name} <span className="text-white/35">· {c.service}</span>
                    </span>
                    <span className={`text-[11px] font-semibold ${overdue ? "text-red-400" : "text-accent"}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">Kontaktet e fundit</p>
          {recentContacts.length === 0 ? (
            <EmptyState text="Ende pa kontakte." />
          ) : (
            <ul className="space-y-2">
              {recentContacts.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onGoToContact(c.email)}
                    className="flex w-full items-center justify-between rounded-[2px] px-2 py-1.5 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="text-[13px] text-white/75">{c.name}</span>
                    <span className="text-[11px] text-white/30">{formatDate(c.created_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">Hyrjet e fundit në admin</p>
          {adminLogins.length === 0 ? (
            <EmptyState text="Asnjë hyrje e regjistruar." />
          ) : (
            <ul className="space-y-2">
              {adminLogins.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between text-[12px]">
                  <span className={l.success ? "text-emerald-400/80" : "text-red-400/80"}>
                    {l.success ? "✓ E suksesshme" : "✗ E dështuar"}
                  </span>
                  <span className="text-white/30">{formatDate(l.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chart ──────────────────────────────────────────────────────────────────
function ContactsChart({ contacts }: { contacts: Contact[] }) {
  const days = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    contacts.forEach((c) => {
      const key = new Date(c.created_at).toISOString().slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });

    return Array.from(map.entries());
  }, [contacts]);

  const max = Math.max(1, ...days.map(([, count]) => count));

  return (
    <div className={CARD + " mt-4 p-5"}>
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Kontakte — 30 ditët e fundit
      </p>
      <div className="flex h-24 items-end gap-[3px]">
        {days.map(([date, count]) => (
          <div key={date} className="group relative flex-1">
            <div
              className="rounded-sm bg-accent/40 transition-colors group-hover:bg-accent"
              style={{ height: `${Math.max(3, (count / max) * 96)}px` }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {formatDay(date)}: {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Subscribers chart ────────────────────────────────────────────────────────
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
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Subscriber-a — 30 ditët e fundit
      </p>
      <div className="flex h-24 items-end gap-[3px]">
        {days.map(([date, count]) => (
          <div key={date} className="group relative flex-1">
            <div
              className="rounded-sm bg-accent/40 transition-colors group-hover:bg-accent"
              style={{ height: `${Math.max(3, (count / max) * 96)}px` }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {formatDay(date)}: {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] space-y-3 rounded-xl p-1 transition-colors ${
        isOver ? "bg-accent/5 ring-1 ring-accent/30" : ""
      }`}
    >
      {children}
    </div>
  );
}

function DraggableCard({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, position: "relative", zIndex: 30 }
    : {};
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-40" : ""}>
      <div className="relative">
        <div
          {...attributes}
          {...listeners}
          title="Zhvendos"
          className="absolute right-3 top-3 z-10 cursor-grab touch-none select-none rounded px-1.5 py-1 text-[14px] leading-none text-white/25 transition-colors hover:text-white/60 active:cursor-grabbing"
        >
          ⠿
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Contacts tab ───────────────────────────────────────────────────────────
function ContactsTab({
  contacts,
  setContacts,
  jumpSearch,
}: {
  contacts: Contact[];
  setContacts: (c: Contact[]) => void;
  jumpSearch?: { term: string; key: number } | null;
}) {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Të gjitha");
  const [tagFilter, setTagFilter] = useState("Të gjitha");
  const [tagDraft, setTagDraft] = useState<Record<number, string>>({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [assignedDraft, setAssignedDraft] = useState<Record<number, string>>({});
  const [followUpDraft, setFollowUpDraft] = useState<Record<number, string>>({});
  const [saveError, setSaveError] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [logs, setLogs] = useState<Record<number, ContactLog[]>>({});
  const [logsLoading, setLogsLoading] = useState<Record<number, boolean>>({});
  const [notesList, setNotesList] = useState<Record<number, ContactNote[]>>({});
  const [notesLoading, setNotesLoading] = useState<Record<number, boolean>>({});
  const [newNoteDraft, setNewNoteDraft] = useState<Record<number, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteDraft, setEditNoteDraft] = useState<Record<number, string>>({});
  const [addingNoteFor, setAddingNoteFor] = useState<number | null>(null);
  const [noteBusy, setNoteBusy] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (jumpSearch) setSearch(jumpSearch.term);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSearch?.key]);

  const services = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.map((c) => c.service).filter(Boolean)))],
    [contacts]
  );

  const allTags = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.flatMap((c) => c.tags ?? []))).sort()],
    [contacts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (q) {
        const haystack = `${c.name} ${c.email} ${c.business_name ?? ""} ${c.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (serviceFilter !== "Të gjitha" && c.service !== serviceFilter) return false;
      if (tagFilter !== "Të gjitha" && !(c.tags ?? []).includes(tagFilter)) return false;
      if (dateFrom && new Date(c.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(c.created_at) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [contacts, search, serviceFilter, tagFilter, dateFrom, dateTo]);

  const loadLogs = async (id: number) => {
    setLogsLoading((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}/logs`);
      const data = await res.json();
      if (data.success) setLogs((l) => ({ ...l, [id]: data.logs }));
    } finally {
      setLogsLoading((s) => ({ ...s, [id]: false }));
    }
  };

  const loadNotes = async (id: number) => {
    setNotesLoading((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}/notes`);
      const data = await res.json();
      if (data.success) setNotesList((l) => ({ ...l, [id]: data.notes }));
    } finally {
      setNotesLoading((s) => ({ ...s, [id]: false }));
    }
  };

  useEffect(() => {
    if (expanded !== null) {
      if (!logs[expanded] && !logsLoading[expanded]) loadLogs(expanded);
      if (!notesList[expanded] && !notesLoading[expanded]) loadNotes(expanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const addNote = async (c: Contact) => {
    const text = (newNoteDraft[c.id] ?? "").trim();
    if (!text) return;
    setAddingNoteFor(c.id);
    try {
      const res = await fetch(`/api/admin/contacts/${c.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({ ...l, [c.id]: [data.note, ...(l[c.id] ?? [])] }));
        setNewNoteDraft((d) => ({ ...d, [c.id]: "" }));
      }
    } finally {
      setAddingNoteFor(null);
    }
  };

  const saveNoteEdit = async (contactId: number, noteId: number) => {
    const text = (editNoteDraft[noteId] ?? "").trim();
    if (!text) return;
    setNoteBusy(noteId);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({
          ...l,
          [contactId]: (l[contactId] ?? []).map((n) => (n.id === noteId ? data.note : n)),
        }));
        setEditingNoteId(null);
      }
    } finally {
      setNoteBusy(null);
    }
  };

  const deleteNote = async (contactId: number, noteId: number) => {
    if (!confirm("Të fshihet ky shënim?")) return;
    setNoteBusy(noteId);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/notes/${noteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({ ...l, [contactId]: (l[contactId] ?? []).filter((n) => n.id !== noteId) }));
      }
    } finally {
      setNoteBusy(null);
    }
  };

  const deleteLegacyNote = (c: Contact) => {
    if (!confirm("Të fshihet ky shënim i vjetër?")) return;
    updateContact(c.id, { notes: "" });
  };

  const updateContact = async (
    id: number,
    update: Partial<Pick<Contact, "status" | "notes" | "assigned_to" | "follow_up_date" | "tags">>
  ) => {
    setSavingId(id);
    setSaveError((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, ...update } : c)));
        if (expanded === id) loadLogs(id);
      } else {
        setSaveError((e) => ({ ...e, [id]: data.error ?? "Gabim i panjohur." }));
      }
    } catch {
      setSaveError((e) => ({ ...e, [id]: "Gabim lidhjeje." }));
    } finally {
      setSavingId(null);
    }
  };

  const saveDetails = (c: Contact) => {
    const update: Partial<Pick<Contact, "assigned_to" | "follow_up_date">> = {};
    const assignedVal = assignedDraft[c.id];
    const followUpVal = followUpDraft[c.id];
    if (assignedVal !== undefined && assignedVal !== (c.assigned_to ?? "")) update.assigned_to = assignedVal;
    if (followUpVal !== undefined && followUpVal !== (c.follow_up_date ?? "")) update.follow_up_date = followUpVal;
    if (Object.keys(update).length === 0) return;
    updateContact(c.id, update);
  };

  const addTag = (c: Contact) => {
    const tag = (tagDraft[c.id] ?? "").trim().slice(0, 30);
    if (!tag) return;
    const current = c.tags ?? [];
    if (current.includes(tag)) {
      setTagDraft((d) => ({ ...d, [c.id]: "" }));
      return;
    }
    updateContact(c.id, { tags: [...current, tag] });
    setTagDraft((d) => ({ ...d, [c.id]: "" }));
  };

  const removeTag = (c: Contact, tag: string) => {
    updateContact(c.id, { tags: (c.tags ?? []).filter((t) => t !== tag) });
  };

  const removeContact = async (id: number) => {
    if (!confirm("Të fshihet ky kontakt? Ky veprim nuk kthehet mbrapsht.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter((c) => c.id !== id));
        setSelected((s) => {
          const next = new Set(s);
          next.delete(id);
          return next;
        });
      }
    } finally {
      setDeletingId(null);
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

  const bulkUpdateStatus = async (status: string) => {
    if (!status || selected.size === 0) return;
    const ids = Array.from(selected);
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/contacts/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map((c) => (ids.includes(c.id) ? { ...c, status } : c)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Të fshihen ${selected.size} kontakte? Ky veprim nuk kthehet mbrapsht.`)) return;
    const ids = Array.from(selected);
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/contacts/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter((c) => !ids.includes(c.id)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = String(over.id);
    const id = Number(active.id);
    const contact = contacts.find((c) => c.id === id);
    if (!contact || (contact.status || "new") === newStatus) return;
    updateContact(id, { status: newStatus });
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko emër, email, telefon..."
          className="font-ui min-w-[200px] flex-1 rounded-[2px] border border-[#262626] bg-transparent px-4 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        >
          {allTags.map((t) => (
            <option key={t} value={t}>{t === "Të gjitha" ? "Të gjitha etiketat" : t}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <button
          onClick={() => downloadContactsCSV(filtered)}
          className="font-ui rounded-[2px] border border-[#262626] px-4 py-2.5 text-[12px] font-semibold text-white/60 transition-colors hover:border-accent/50 hover:text-white"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[2px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-white/70">{selected.size} të zgjedhur</span>
          <select
            defaultValue=""
            disabled={bulkBusy}
            onChange={(e) => {
              bulkUpdateStatus(e.target.value);
              e.target.value = "";
            }}
            className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-1.5 text-[12px] text-white outline-none transition-colors focus:border-accent disabled:opacity-50"
          >
            <option value="" disabled>Ndrysho statusin...</option>
            <option value="new">I ri</option>
            <option value="in-progress">Në proces</option>
            <option value="done">Mbyllur</option>
          </select>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[2px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            Fshi të zgjedhurit
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-ui text-[11px] text-white/40 transition-colors hover:text-white"
          >
            Anulo
          </button>
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_COLUMNS.map((col) => {
            const items = filtered.filter((c) => (c.status || "new") === col);
            return (
              <div key={col}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${STATUS_COLORS[col]}`}>
                    {STATUS_LABELS[col]}
                  </h3>
                  <span className="text-[12px] text-white/35">{items.length}</span>
                </div>
                <KanbanColumn id={col}>
                  {items.length === 0 && <EmptyState text="Asnjë kontakt." />}
                  {items.map((c) => {
                    const status = c.status || "new";
                    const overdue = isOverdue(c);
                    return (
                      <DraggableCard key={c.id} id={c.id}>
                        <div className={CARD}>
                          <div className="flex items-start gap-3 p-5">
                            <input
                              type="checkbox"
                              checked={selected.has(c.id)}
                              onChange={() => toggleSelect(c.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1.5 accent-accent"
                            />
                            <button
                              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                              className="flex flex-1 items-center justify-between gap-4 pr-6 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="font-display font-semibold text-white">{c.name}</span>
                                  <span className="text-[12px] text-white/40">{c.email}</span>
                                  {c.discount_code && (
                                    <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                                      {c.discount_code}
                                    </span>
                                  )}
                                  {overdue && (
                                    <span className="rounded-full border border-red-400/30 bg-red-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400">
                                      ⚠ Vonuar
                                    </span>
                                  )}
                                  {(c.tags ?? []).map((tag) => (
                                    <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-1 text-[12px] text-white/35">
                                  {c.service} · {c.budget} · {c.timeline}
                                </p>
                                {(c.assigned_to || c.follow_up_date) && (
                                  <p className="mt-1 text-[11px] text-white/30">
                                    {c.assigned_to && <>👤 {c.assigned_to}</>}
                                    {c.assigned_to && c.follow_up_date && " · "}
                                    {c.follow_up_date && <>📅 {formatDay(`${c.follow_up_date}T00:00:00`)}</>}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-[11px] text-white/30">{formatDate(c.created_at)}</p>
                                <span className="text-[11px] text-accent/60">{expanded === c.id ? "Mbyll ▲" : "Hap ▼"}</span>
                              </div>
                            </button>
                          </div>

                          {expanded === c.id && (
                            <div className="border-t border-[#262626] p-5 text-[13px] leading-relaxed text-white/60">
                              <p><span className="text-white/35">Telefon:</span> {c.phone}</p>
                              {c.business_name && <p><span className="text-white/35">Biznesi:</span> {c.business_name}</p>}
                              <p className="mt-3 whitespace-pre-wrap"><span className="text-white/35">Mesazhi:</span> {c.message}</p>

                              {/* Quick actions */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <a href={`tel:${c.phone}`} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-accent/50 hover:text-white">
                                  📞 Telefono
                                </a>
                                <a href={`mailto:${c.email}`} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-accent/50 hover:text-white">
                                  ✉️ Email
                                </a>
                                <a href={whatsappHref(c.phone)} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-accent/50 hover:text-white">
                                  💬 WhatsApp
                                </a>
                              </div>

                              {/* Tags */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Etiketa</label>
                                <div className="flex flex-wrap items-center gap-2">
                                  {(c.tags ?? []).map((tag) => (
                                    <span key={tag} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/65">
                                      {tag}
                                      <button
                                        onClick={() => removeTag(c, tag)}
                                        disabled={savingId === c.id}
                                        className="text-white/35 transition-colors hover:text-red-400 disabled:opacity-50"
                                        aria-label={`Hiq etiketën ${tag}`}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                  <input
                                    type="text"
                                    value={tagDraft[c.id] ?? ""}
                                    onChange={(e) => setTagDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag(c);
                                      }
                                    }}
                                    placeholder="Shto etiketë..."
                                    className="font-ui w-28 rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-2.5 py-1 text-[11px] text-white outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addTag(c)}
                                    disabled={savingId === c.id || !(tagDraft[c.id] ?? "").trim()}
                                    className="font-ui rounded-[2px] border border-accent/40 px-2.5 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Status</label>
                                <select
                                  value={status}
                                  onChange={(e) => updateContact(c.id, { status: e.target.value })}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent disabled:opacity-50"
                                >
                                  <option value="new">I ri</option>
                                  <option value="in-progress">Në proces</option>
                                  <option value="done">Mbyllur</option>
                                </select>
                              </div>

                              {/* Assigned to + follow-up date */}
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Caktuar tek</label>
                                  <input
                                    type="text"
                                    value={assignedDraft[c.id] ?? c.assigned_to ?? ""}
                                    onChange={(e) => setAssignedDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="p.sh. Ardit"
                                    className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Ndiq më</label>
                                  <input
                                    type="date"
                                    value={followUpDraft[c.id] ?? c.follow_up_date ?? ""}
                                    onChange={(e) => setFollowUpDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Shënime private</label>

                                {c.notes ? (
                                  <div className="mb-2 rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2">
                                    <p className="whitespace-pre-wrap text-[12px] text-white/70">{c.notes}</p>
                                    <div className="mt-1.5 flex items-center justify-between">
                                      <span className="text-[10px] text-white/30">Shënim i vjetër</span>
                                      <button
                                        onClick={() => deleteLegacyNote(c)}
                                        className="font-ui text-[10px] font-semibold text-red-400/70 transition-colors hover:text-red-400"
                                      >
                                        Fshi
                                      </button>
                                    </div>
                                  </div>
                                ) : null}

                                {notesLoading[c.id] ? (
                                  <p className="text-[11px] text-white/30">Duke ngarkuar…</p>
                                ) : (notesList[c.id] ?? []).length > 0 ? (
                                  <ul className="space-y-2">
                                    {(notesList[c.id] ?? []).map((n) => (
                                      <li key={n.id} className="rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2">
                                        {editingNoteId === n.id ? (
                                          <>
                                            <textarea
                                              rows={2}
                                              value={editNoteDraft[n.id] ?? n.text}
                                              onChange={(e) => setEditNoteDraft((d) => ({ ...d, [n.id]: e.target.value }))}
                                              className="font-ui w-full resize-none rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
                                            />
                                            <div className="mt-1.5 flex gap-3">
                                              <button
                                                onClick={() => saveNoteEdit(c.id, n.id)}
                                                disabled={noteBusy === n.id}
                                                className="font-ui text-[10px] font-semibold text-accent transition-colors hover:text-accent/80 disabled:opacity-50"
                                              >
                                                {noteBusy === n.id ? "Duke ruajtur…" : "Ruaj"}
                                              </button>
                                              <button
                                                onClick={() => setEditingNoteId(null)}
                                                className="font-ui text-[10px] font-semibold text-white/40 transition-colors hover:text-white/70"
                                              >
                                                Anulo
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <p className="whitespace-pre-wrap text-[12px] text-white/70">{n.text}</p>
                                            <div className="mt-1.5 flex items-center justify-between gap-2">
                                              <span className="text-[10px] text-white/35">
                                                {formatDate(n.created_at)}
                                                {n.updated_at !== n.created_at ? " (ndryshuar)" : ""}
                                              </span>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => {
                                                    setEditingNoteId(n.id);
                                                    setEditNoteDraft((d) => ({ ...d, [n.id]: n.text }));
                                                  }}
                                                  className="font-ui text-[10px] font-semibold text-white/40 transition-colors hover:text-white/70"
                                                >
                                                  Edito
                                                </button>
                                                <button
                                                  onClick={() => deleteNote(c.id, n.id)}
                                                  disabled={noteBusy === n.id}
                                                  className="font-ui text-[10px] font-semibold text-red-400/70 transition-colors hover:text-red-400 disabled:opacity-50"
                                                >
                                                  Fshi
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : !c.notes ? (
                                  <p className="text-[11px] text-white/30">Asnjë shënim.</p>
                                ) : null}

                                <div className="mt-2">
                                  <textarea
                                    rows={2}
                                    value={newNoteDraft[c.id] ?? ""}
                                    onChange={(e) => setNewNoteDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="Shto shënim..."
                                    className="font-ui w-full resize-none rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addNote(c)}
                                    disabled={addingNoteFor === c.id || !(newNoteDraft[c.id] ?? "").trim()}
                                    className="font-ui mt-2 rounded-[2px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                  >
                                    {addingNoteFor === c.id ? "Duke ruajtur…" : "Shto shënim"}
                                  </button>
                                </div>
                              </div>

                              {/* Veprime */}
                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={() => saveDetails(c)}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[2px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                >
                                  {savingId === c.id ? "Duke ruajtur…" : "Ruaj"}
                                </button>
                                <button
                                  onClick={() => removeContact(c.id)}
                                  disabled={deletingId === c.id}
                                  className="font-ui rounded-[2px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                                >
                                  {deletingId === c.id ? "Duke fshirë…" : "Fshi kontaktin"}
                                </button>
                              </div>
                              {saveError[c.id] ? (
                                <p className="mt-2 text-[11px] text-red-400/80">{saveError[c.id]}</p>
                              ) : null}

                              {/* History */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">Historiku</label>
                                {logsLoading[c.id] ? (
                                  <p className="text-[11px] text-white/30">Duke ngarkuar…</p>
                                ) : logs[c.id] && logs[c.id].length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {logs[c.id].map((l) => (
                                      <li key={l.id} className="text-[11px] text-white/40">
                                        <span className="text-white/55">
                                          {LOG_ACTION_LABELS[l.action] ? LOG_ACTION_LABELS[l.action](l.detail) : `${l.action}: ${l.detail ?? ""}`}
                                        </span>
                                        {" — "}
                                        {formatDate(l.created_at)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[11px] text-white/30">Asnjë ndryshim i regjistruar.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </DraggableCard>
                    );
                  })}
                </KanbanColumn>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

// ── Subscribers tab ──────────────────────────────────────────────────────────
function SubscribersTab({
  subscribers,
  setSubscribers,
  jumpSearch,
}: {
  subscribers: Subscriber[];
  setSubscribers: (s: Subscriber[]) => void;
  jumpSearch?: { term: string; key: number } | null;
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
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string>("");

  const activeCount = subscribers.filter((s) => !s.unsubscribed).length;

  useEffect(() => {
    if (jumpSearch) {
      setSearch(jumpSearch.term);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSearch?.key]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (q && !s.email.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && s.unsubscribed) return false;
      if (statusFilter === "unsubscribed" && !s.unsubscribed) return false;
      return true;
    });
  }, [subscribers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const remove = async (id: number) => {
    if (!confirm("Të fshihet ky subscriber?")) return;
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
    if (!confirm(`Të fshihen ${selected.size} subscriber-a? Ky veprim nuk kthehet mbrapsht.`)) return;
    const ids = Array.from(selected);
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/subscribers/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(subscribers.filter((s) => !ids.includes(s.id)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;
    if (!confirm(`Të dërgohet ky email te ${activeCount} subscriber-a aktivë?`)) return;
    setBroadcastSending(true);
    setBroadcastResult("");
    try {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: broadcastSubject, message: broadcastMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastResult(`U dërgua te ${data.sent} subscriber-a.`);
        setBroadcastSubject("");
        setBroadcastMessage("");
      } else {
        setBroadcastResult(data.error ?? "Gabim i panjohur.");
      }
    } catch {
      setBroadcastResult("Gabim lidhjeje.");
    } finally {
      setBroadcastSending(false);
    }
  };

  return (
    <div>
      {/* Broadcast composer */}
      <div className={CARD + " mb-5 p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Dërgo email te subscriber-at ({activeCount} aktivë)
        </p>
        <input
          type="text"
          value={broadcastSubject}
          onChange={(e) => setBroadcastSubject(e.target.value)}
          placeholder="Subjekti"
          className="font-ui mb-3 w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <textarea
          rows={5}
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          placeholder="Mesazhi..."
          className="font-ui w-full resize-none rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-4 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={sendBroadcast}
            disabled={broadcastSending || !broadcastSubject.trim() || !broadcastMessage.trim() || activeCount === 0}
            className="font-ui rounded-[2px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
          >
            {broadcastSending ? "Duke dërguar…" : "Dërgo email"}
          </button>
          {broadcastResult && <span className="text-[12px] text-white/50">{broadcastResult}</span>}
        </div>
      </div>

      {/* Chart */}
      <SubscribersChart subscribers={subscribers} />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko email..."
          className="font-ui min-w-[200px] flex-1 rounded-[2px] border border-[#262626] bg-transparent px-4 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        >
          <option value="all">Të gjithë</option>
          <option value="active">Aktivë</option>
          <option value="unsubscribed">Çregjistruar</option>
        </select>
        <button
          onClick={() => downloadCSV(subscribers)}
          disabled={subscribers.length === 0}
          className="font-ui rounded-[2px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[2px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-white/70">{selected.size} të zgjedhur</span>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[2px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            Fshi të zgjedhurit
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-ui text-[11px] text-white/40 transition-colors hover:text-white"
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
              i !== pageItems.length - 1 ? "border-b border-[#262626]" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(s.id)}
                onChange={() => toggleSelect(s.id)}
                className="accent-accent"
              />
              <span className="truncate text-[14px] text-white/80">{s.email}</span>
              {s.unsubscribed && (
                <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  Çregjistruar
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-white/30">{formatDate(s.subscribed_at)}</span>
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
                className="text-[12px] text-white/50 transition-colors hover:text-white disabled:opacity-50"
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
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="font-ui rounded-[2px] border border-[#262626] px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:border-accent/50 hover:text-white disabled:opacity-30"
      >
        ← Prapa
      </button>
      <span className="text-[12px] text-white/40">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="font-ui rounded-[2px] border border-[#262626] px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:border-accent/50 hover:text-white disabled:opacity-30"
      >
        Tjetër →
      </button>
    </div>
  );
}

// ── Blog tab ───────────────────────────────────────────────────────────────
const EMPTY_FORM = { slug: "", title: "", category: "", excerpt: "", date: "", content: "" };

function BlogTab({
  posts,
  setPosts,
  staticPosts,
}: {
  posts: BlogPost[];
  setPosts: (p: BlogPost[]) => void;
  staticPosts: StaticPost[];
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    staticPosts.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [posts, staticPosts]);

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      date: post.date,
      content: post.content.join("\n\n"),
    });
    setIsNewCategory(!categories.includes(post.category));
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsNewCategory(false);
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!form.title || !form.category || !form.excerpt || !form.date || (!editingId && !form.slug)) {
      setError("Plotëso të gjitha fushat e kërkuara.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/blog/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            excerpt: form.excerpt,
            date: form.date,
            content: form.content,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setPosts(
          posts.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: form.title,
                  category: form.category,
                  excerpt: form.excerpt,
                  date: form.date,
                  content: form.content.split("\n\n").map((s) => s.trim()).filter(Boolean),
                }
              : p
          )
        );
      } else {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setPosts([data.post, ...posts]);
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Të fshihet ky artikull?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setPosts(posts.filter((p) => p.id !== id));
      if (editingId === id) cancelEdit();
    }
  };

  return (
    <div>
      {/* Form */}
      <div className={CARD + " mb-6 p-5"}>
        <p className="mb-4 font-display text-[1.1rem] font-semibold text-white">
          {editingId ? "Edito artikullin" : "Shto artikull të ri"}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Slug (p.sh. titulli-im)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            disabled={!!editingId}
            className="font-ui rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent disabled:opacity-50"
          />
          <div>
            <select
              value={isNewCategory ? "__new__" : form.category}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setIsNewCategory(true);
                  setForm((f) => ({ ...f, category: "" }));
                } else {
                  setIsNewCategory(false);
                  setForm((f) => ({ ...f, category: e.target.value }));
                }
              }}
              className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
            >
              <option value="" disabled>
                Zgjedh kategorinë
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__new__">+ Kategori e re</option>
            </select>
            {isNewCategory && (
              <input
                type="text"
                placeholder="Emri i kategorisë së re"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="font-ui mt-2 w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
              />
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Titulli"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbledhje (excerpt)"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <input
          type="text"
          placeholder="Data (p.sh. Qershor 2026)"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbajtja — ndaj paragrafët me një rresht bosh"
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-[13px] leading-relaxed text-white outline-none transition-colors focus:border-accent"
        />

        {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            onClick={submit}
            disabled={saving}
            className="font-ui rounded-[2px] bg-accent px-6 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)] disabled:opacity-50"
          >
            {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto artikullin"}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="font-ui rounded-[2px] border border-[#262626] px-6 py-2.5 text-[12px] font-semibold text-white/60 transition-colors hover:text-white"
            >
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-white/35">
        Artikuj nga admin ({posts.length})
      </p>
      <div className="space-y-3">
        {posts.length === 0 && <EmptyState text="Ende nuk ka artikuj nga admin." />}
        {posts.map((p) => (
          <div key={p.id} className={CARD + " flex items-center justify-between gap-4 p-5"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-white">{p.title}</p>
              <p className="mt-1 text-[12px] text-white/35">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="font-ui rounded-[2px] border border-[#262626] px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-accent/50 hover:text-white"
              >
                Edito
              </button>
              <button
                onClick={() => remove(p.id)}
                className="font-ui rounded-[2px] border border-[#262626] px-3 py-1.5 text-[11px] text-red-400/70 transition-colors hover:border-red-400/50 hover:text-red-400"
              >
                Fshi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Static articles (from code) */}
      <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.15em] text-white/35">
        Artikuj ekzistues në kod ({staticPosts.length}) — vetëm lexim
      </p>
      <div className="space-y-3">
        {staticPosts.map((p) => (
          <div key={p.slug} className={CARD + " flex items-center justify-between gap-4 p-5 opacity-70"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-white">{p.title}</p>
              <p className="mt-1 text-[12px] text-white/35">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <span className="shrink-0 rounded-[2px] border border-[#262626] px-3 py-1.5 text-[11px] text-white/35">
              Statik
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/30">
        Artikujt statikë janë pjesë e kodit (lib/blogPosts.ts) dhe nuk mund të editohen apo fshihen nga paneli.
      </p>
    </div>
  );
}

// ── Analytics tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
          <p className="mt-1 text-[12px] text-white/40">Norma e konvertimit (Mbyllur / Total)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-white">
            {stats.avgDaysToClose !== null ? stats.avgDaysToClose.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-[12px] text-white/40">Ditë mesatare deri në mbyllje</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-white">{stats.totalContacts}</p>
          <p className="mt-1 text-[12px] text-white/40">Kontakte gjithsej</p>
        </div>
      </div>

      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Shërbimet më të kërkuara
        </p>
        {stats.topServices.length === 0 ? (
          <EmptyState text="Nuk ka të dhëna." />
        ) : (
          <div className="space-y-3">
            {stats.topServices.map(({ service, count }) => {
              const max = stats.topServices[0].count;
              return (
                <div key={service}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-white/60">
                    <span>{service}</span>
                    <span className="text-white/35">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-accent/50"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings tab ──────────────────────────────────────────────────────────────
function SettingsTab({ adminLogins, initialSettings }: { adminLogins: AdminLogin[]; initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      } else {
        setError(data.error ?? "Gabim i panjohur.");
      }
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Cilësime të faqes
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">
              Kodi i zbritjes (newsletter)
            </label>
            <input
              type="text"
              value={settings.newsletter_discount_code}
              onChange={(e) => setSettings((s) => ({ ...s, newsletter_discount_code: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-white/35">
              Numri WhatsApp (pa +, p.sh. 355...)
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings((s) => ({ ...s, whatsapp_number: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-[12px] text-white outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="font-ui rounded-[2px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            {saving ? "Duke ruajtur…" : "Ruaj"}
          </button>
          {saved && <span className="text-[11px] text-emerald-400/80">U ruajt.</span>}
          {error && <span className="text-[11px] text-red-400/80">{error}</span>}
        </div>
        <p className="mt-3 text-[11px] text-white/30">
          Këto vlera përdoren në email-et e newsletter-it (kodi i zbritjes dhe lidhja WhatsApp).
        </p>
      </div>

      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Hyrjet në admin (20 të fundit)
        </p>
        {adminLogins.length === 0 ? (
          <EmptyState text="Asnjë hyrje e regjistruar." />
        ) : (
          <ul className="space-y-1.5">
            {adminLogins.map((l) => (
              <li key={l.id} className="flex items-center justify-between text-[11px]">
                <span className={l.success ? "text-emerald-400/80" : "text-red-400/80"}>
                  {l.success ? "✓ Hyrje e suksesshme" : "✗ Tentativë e dështuar"}
                </span>
                <span className="text-white/35">{l.ip ?? "—"}</span>
                <span className="text-white/35">{formatDate(l.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
