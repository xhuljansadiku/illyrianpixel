"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import QuotesTab, { type QuoteContact } from "@/components/admin/QuotesTab";
import ContentTab, { type PricingCatalogEntry } from "@/components/admin/ContentTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ActivityTab from "@/components/admin/ActivityTab";
import NotificationsBell from "@/components/admin/NotificationsBell";
import type { QuoteRecord, RecurringInvoice } from "@/lib/quotes";
import { quoteTotals, formatMoney } from "@/lib/quotes";
import type { ProjectRecord } from "@/lib/projects";
import type { TestimonialRow, PortfolioRow, FaqRow } from "@/lib/publicContent";
import type { PricingOverrides } from "@/lib/pricingOverrides";
import { leadScore, LEAD_LABEL_STYLES, LEAD_LABEL_TEXT } from "@/lib/leadScore";

const VALID_TABS = [
  "overview",
  "contacts",
  "quotes",
  "projects",
  "subscribers",
  "blog",
  "content",
  "analytics",
  "history",
  "settings",
] as const;

export type AdminTab = (typeof VALID_TABS)[number];

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
  value: number | null;
  source_path: string | null;
};

type BroadcastStat = {
  id: string;
  subject: string;
  created_at: string;
  sent_count: number;
  opens: number;
  clicks: number;
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
  published?: boolean;
  scheduled_for?: string | null;
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
  popup_enabled: string;
  popup_eyebrow: string;
  popup_title: string;
  popup_text: string;
  popup_cta: string;
};

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[var(--a-border)] bg-[var(--a-card)] backdrop-blur-[12px]";

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
  value: (d) => (d ? `Vlera u vendos: ${d}` : "U hoq vlera"),
  email: (d) => `📧 Email i dërguar: ${d ?? ""}`,
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

function printMonthlyReport(contacts: Contact[], stats: Stats) {
  const now = new Date();
  const monthLabel = now.toLocaleDateString("sq-AL", { month: "long", year: "numeric" });
  const monthContacts = contacts.filter((c) => {
    const d = new Date(c.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const rows = monthContacts
    .map(
      (c) => `<tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.service}</td>
        <td>${STATUS_LABELS[c.status || "new"] ?? c.status ?? ""}</td>
        <td>${formatDate(c.created_at)}</td>
      </tr>`
    )
    .join("");

  const servicesRows = stats.topServices
    .map(({ service, count }) => `<tr><td>${service}</td><td>${count}</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="UTF-8">
<title>Raporti — ${monthLabel}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 14px; margin-top: 28px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #555; }
  p.subtitle { color: #777; margin-top: 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  th { background: #f3f3f3; }
  .stats { display: flex; gap: 24px; margin-top: 16px; }
  .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px 20px; }
  .stat strong { display: block; font-size: 22px; }
  .stat span { font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 0.05em; }
</style>
</head>
<body>
  <h1>Illyrian Pixel — Raporti Mujor</h1>
  <p class="subtitle">${monthLabel}</p>

  <div class="stats">
    <div class="stat"><strong>${stats.totalContacts}</strong><span>Kontakte gjithsej</span></div>
    <div class="stat"><strong>${monthContacts.length}</strong><span>Këtë muaj</span></div>
    <div class="stat"><strong>${stats.conversionRate.toFixed(1)}%</strong><span>Norma e konvertimit</span></div>
    <div class="stat"><strong>${stats.avgDaysToClose !== null ? stats.avgDaysToClose.toFixed(1) : "—"}</strong><span>Ditë mesatare deri në mbyllje</span></div>
  </div>

  <h2>Shërbimet më të kërkuara</h2>
  <table><thead><tr><th>Shërbimi</th><th>Numri</th></tr></thead><tbody>${servicesRows || "<tr><td colspan=2>Nuk ka të dhëna.</td></tr>"}</tbody></table>

  <h2>Kontaktet e ${monthLabel} (${monthContacts.length})</h2>
  <table><thead><tr><th>Emri</th><th>Email</th><th>Shërbimi</th><th>Statusi</th><th>Data</th></tr></thead><tbody>${rows || "<tr><td colspan=5>Asnjë kontakt këtë muaj.</td></tr>"}</tbody></table>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

function playNotificationSound() {
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
    // ignore — audio not available
  }
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
  quotes: initialQuotes,
  testimonials: initialTestimonials,
  portfolioItems: initialPortfolioItems,
  pricingCatalog,
  pricingOverrides,
  broadcasts,
  visitors30,
  recurring,
  projects,
  faqs,
}: {
  contacts: Contact[];
  subscribers: Subscriber[];
  blogPosts: BlogPost[];
  staticPosts: StaticPost[];
  stats: Stats;
  adminLogins: AdminLogin[];
  siteSettings: SiteSettings;
  quotes: QuoteRecord[];
  testimonials: TestimonialRow[];
  portfolioItems: PortfolioRow[];
  pricingCatalog: PricingCatalogEntry[];
  pricingOverrides: PricingOverrides;
  broadcasts: BroadcastStat[];
  visitors30: number;
  recurring: RecurringInvoice[];
  projects: ProjectRecord[];
  faqs: FaqRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<
    "overview" | "contacts" | "quotes" | "projects" | "subscribers" | "blog" | "content" | "analytics" | "history" | "settings"
  >("overview");
  const [contacts, setContacts] = useState(initialContacts);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [portfolioItems, setPortfolioItems] = useState(initialPortfolioItems);
  // Gjendja mbahet këtu (jo brenda tab-eve) që të mos humbasë kur ndërrohen tab-et
  const [projectsList, setProjectsList] = useState(projects);
  const [recurringList, setRecurringList] = useState(recurring);
  const [faqsList, setFaqsList] = useState(faqs);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [globalSearch, setGlobalSearch] = useState("");
  const [contactsJump, setContactsJump] = useState<{ term: string; key: number } | null>(null);
  const [subscribersJump, setSubscribersJump] = useState<{ term: string; key: number } | null>(null);
  const [quotePrefill, setQuotePrefill] = useState<{ contact: QuoteContact; key: number } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const lastCheckRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("admin_sidebar_collapsed") === "1") setCollapsed(true);
    if (window.localStorage.getItem("admin_theme") === "light") setTheme("light");
    const savedTab = window.localStorage.getItem("admin_active_tab");
    if (savedTab && VALID_TABS.includes(savedTab as typeof tab)) setTab(savedTab as typeof tab);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("admin_active_tab", tab);
  }, [tab]);

  // Poll for new contacts and show a toast + sound
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/contacts/since?after=${encodeURIComponent(lastCheckRef.current)}`);
        const data = await res.json();
        if (data.success && data.contacts.length > 0) {
          const newOnes: Contact[] = data.contacts;
          setContacts((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            return [...newOnes.filter((c) => !existingIds.has(c.id)), ...prev];
          });
          setToasts((t) => [
            ...t,
            ...newOnes.map((c) => ({ id: `${c.id}-${Date.now()}`, text: `Kontakt i ri: ${c.name} (${c.service})` })),
          ]);
          playNotificationSound();
        }
        lastCheckRef.current = new Date().toISOString();
      } catch {
        // ignore — will retry on next tick
      }
    }, 45000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((t) => t.slice(1)), 6000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") window.localStorage.setItem("admin_theme", next);
      return next;
    });
  };

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
    { id: "quotes", icon: "🧾", label: "Oferta & Fatura", count: quotes.length },
    { id: "projects", icon: "📁", label: "Projektet", count: projectsList.length },
    { id: "subscribers", icon: "✉️", label: "Newsletter", count: subscribers.length },
    { id: "blog", icon: "📝", label: "Blog", count: blogPosts.length + staticPosts.length },
    { id: "content", icon: "🎨", label: "Përmbajtja" },
    { id: "analytics", icon: "📊", label: "Analitika" },
    { id: "history", icon: "🕘", label: "Historia" },
    { id: "settings", icon: "⚙️", label: "Cilësimet" },
  ];

  const TAB_TITLES: Record<typeof tab, { title: string; subtitle: string }> = {
    overview: { title: "Përmbledhje", subtitle: "Pamje e përgjithshme e aktivitetit" },
    contacts: { title: "Kontaktet", subtitle: "Menaxho kontaktet dhe lead-et" },
    quotes: { title: "Oferta & Fatura", subtitle: "Krijo, dërgo dhe gjurmo oferta e fatura" },
    projects: { title: "Projektet", subtitle: "Ndiq fazat dhe detyrat e çdo projekti" },
    subscribers: { title: "Newsletter", subtitle: "Abonentët, broadcast dhe statistika" },
    blog: { title: "Blog", subtitle: "Artikujt e blogut dhe publikimi i planifikuar" },
    content: { title: "Përmbajtja", subtitle: "Testimoniale, portofol dhe çmime — pa deploy" },
    analytics: { title: "Analitika", subtitle: "Funnel, burime dhe performanca" },
    history: { title: "Historia", subtitle: "Çdo veprim i regjistruar — çfarë ke bërë dhe kur" },
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

  // Kontakt → Ofertë me një klik: hap tab-in e ofertave me klientin të parambushur
  const createQuoteForContact = (c: Contact) => {
    setQuotePrefill({
      contact: { id: c.id, name: c.name, email: c.email, business_name: c.business_name },
      key: Date.now(),
    });
    setTab("quotes");
  };

  return (
    <div data-theme={theme} className="admin-shell flex min-h-screen bg-[var(--a-bg)] text-[var(--a-text)]">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="rounded-[2px] border border-accent/40 bg-[var(--a-card)] px-4 py-3 text-[12px] text-[var(--a-text)] shadow-xl backdrop-blur-[12px] animate-[fadeIn_0.2s_ease-out]"
            >
              🔔 {t.text}
            </div>
          ))}
        </div>
      )}

      {/* Sidebar (desktop) */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--a-border)] bg-[var(--a-card2)] py-8 transition-all duration-200 md:flex ${
          collapsed ? "w-[68px] px-2" : "w-60 px-4"
        }`}
      >
        <div className={`flex items-center justify-between ${collapsed ? "px-0" : "px-2"}`}>
          {!collapsed && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
              <h1 className="mt-2 font-display text-[1.4rem] font-bold text-[var(--a-text)]">Admin Panel</h1>
            </div>
          )}
          <div className={`flex items-center gap-1.5 ${collapsed ? "mx-auto mt-1 flex-col" : ""}`}>
            <NotificationsBell setTab={setTab} collapsed={collapsed} />
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Mënyra e ndritshme" : "Mënyra e errët"}
              className="rounded-[2px] border border-[var(--a-border)] p-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <button
              onClick={toggleCollapsed}
              title={collapsed ? "Zgjero menynë" : "Mbylle menynë"}
              className="rounded-[2px] border border-[var(--a-border)] p-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
            >
              {collapsed ? "»" : "«"}
            </button>
          </div>
        </div>

        {/* Global search */}
        {!collapsed && (
          <div className="relative mt-6 px-2">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="🔍 Kërko gjithçka..."
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            {globalResults && (
              <div className="absolute left-2 right-2 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] shadow-xl">
                {globalResults.contactMatches.length === 0 &&
                globalResults.subscriberMatches.length === 0 &&
                globalResults.blogMatches.length === 0 ? (
                  <p className="px-3 py-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">Asnjë rezultat.</p>
                ) : (
                  <>
                    {globalResults.contactMatches.length > 0 && (
                      <div className="border-b border-[var(--a-border)] py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">Kontakte</p>
                        {globalResults.contactMatches.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => goToContact(c.email)}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                          >
                            {c.name} <span className="text-[rgb(var(--a-text-rgb)/0.35)]">· {c.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {globalResults.subscriberMatches.length > 0 && (
                      <div className="border-b border-[var(--a-border)] py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">Newsletter</p>
                        {globalResults.subscriberMatches.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => goToSubscriber(s.email)}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                          >
                            {s.email}
                          </button>
                        ))}
                      </div>
                    )}
                    {globalResults.blogMatches.length > 0 && (
                      <div className="py-1.5">
                        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">Blog</p>
                        {globalResults.blogMatches.map((p) => (
                          <button
                            key={p.slug}
                            onClick={() => {
                              setTab("blog");
                              setGlobalSearch("");
                            }}
                            className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
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
                  ? "bg-accent/10 text-[var(--a-text)] border-l-2 border-accent"
                  : "text-[rgb(var(--a-text-rgb)/0.45)] border-l-2 border-transparent hover:text-[rgb(var(--a-text-rgb)/0.8)] hover:bg-[rgb(var(--a-text-rgb)/0.03)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="relative">
                  {item.icon}
                  {!!item.alert && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-[var(--a-text)]">
                      {item.alert > 9 ? "9+" : item.alert}
                    </span>
                  )}
                </span>
                {!collapsed && item.label}
              </span>
              {!collapsed && item.count !== undefined && (
                <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={logout}
          title={collapsed ? "Dil" : undefined}
          className="font-ui mt-4 rounded-[2px] border border-[var(--a-border)] px-5 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors duration-300 hover:border-accent/50 hover:text-[var(--a-text)]"
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
              <h1 className="mt-2 font-display text-[1.8rem] font-bold text-[var(--a-text)]">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsBell setTab={setTab} />
              <button
                onClick={logout}
                className="font-ui rounded-[2px] border border-[var(--a-border)] px-5 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors duration-300 hover:border-accent/50 hover:text-[var(--a-text)]"
              >
                Dil
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[var(--a-border)] md:hidden">
            {NAV_ITEMS.map((item) => (
              <TabButton key={item.id} active={tab === item.id} onClick={() => setTab(item.id)}>
                {item.icon} {item.label}{item.count !== undefined ? ` (${item.count})` : ""}
                {!!item.alert && <span className="ml-1 text-red-400">●</span>}
              </TabButton>
            ))}
          </div>

          {/* Page title */}
          <div className="mt-6 hidden md:block">
            <h2 className="font-display text-[1.6rem] font-bold text-[var(--a-text)]">{TAB_TITLES[tab].title}</h2>
            <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">{TAB_TITLES[tab].subtitle}</p>
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
            {tab === "contacts" && (
              <ContactsTab contacts={contacts} setContacts={setContacts} jumpSearch={contactsJump} onCreateQuote={createQuoteForContact} />
            )}
            {tab === "quotes" && (
              <QuotesTab
                quotes={quotes}
                setQuotes={setQuotes}
                contacts={contacts.map((c) => ({ id: c.id, name: c.name, email: c.email, business_name: c.business_name }))}
                recurring={recurringList}
                setRecurring={setRecurringList}
                prefill={quotePrefill}
              />
            )}
            {tab === "projects" && (
              <ProjectsTab
                projects={projectsList}
                setProjects={setProjectsList}
                contacts={contacts.map((c) => ({ id: c.id, name: c.name, email: c.email, business_name: c.business_name }))}
              />
            )}
            {tab === "subscribers" && (
              <SubscribersTab
                subscribers={subscribers}
                setSubscribers={setSubscribers}
                jumpSearch={subscribersJump}
                broadcasts={broadcasts}
              />
            )}
            {tab === "blog" && (
              <BlogTab posts={blogPosts} setPosts={setBlogPosts} staticPosts={staticPosts} />
            )}
            {tab === "content" && (
              <ContentTab
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                portfolioItems={portfolioItems}
                setPortfolioItems={setPortfolioItems}
                pricingCatalog={pricingCatalog}
                initialOverrides={pricingOverrides}
                faqs={faqsList}
                setFaqs={setFaqsList}
              />
            )}
            {tab === "analytics" && (
              <AnalyticsTab stats={stats} contacts={contacts} quotes={quotes} visitors30={visitors30} />
            )}
            {tab === "history" && <ActivityTab />}
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
      <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{value}</p>
      <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">{label}</p>
    </div>
  );
}

// ── Tab button ─────────────────────────────────────────────────────────────
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`font-ui px-4 py-3 text-[13px] font-semibold tracking-[0.3px] transition-colors duration-300 ${
        active ? "border-b-2 border-accent text-[var(--a-text)]" : "text-[rgb(var(--a-text-rgb)/0.4)] hover:text-[rgb(var(--a-text-rgb)/0.7)]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="p-8 text-center text-[13px] text-[rgb(var(--a-text-rgb)/0.35)]">{text}</p>;
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
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
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
                    className="flex w-full items-center justify-between rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-left transition-colors hover:border-accent/50"
                  >
                    <span className="text-[13px] text-[rgb(var(--a-text-rgb)/0.8)]">
                      {c.name} <span className="text-[rgb(var(--a-text-rgb)/0.35)]">· {c.service}</span>
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
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">Kontaktet e fundit</p>
          {recentContacts.length === 0 ? (
            <EmptyState text="Ende pa kontakte." />
          ) : (
            <ul className="space-y-2">
              {recentContacts.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onGoToContact(c.email)}
                    className="flex w-full items-center justify-between rounded-[2px] px-2 py-1.5 text-left transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)]"
                  >
                    <span className="text-[13px] text-[rgb(var(--a-text-rgb)/0.75)]">{c.name}</span>
                    <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{formatDate(c.created_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">Hyrjet e fundit në admin</p>
          {adminLogins.length === 0 ? (
            <EmptyState text="Asnjë hyrje e regjistruar." />
          ) : (
            <ul className="space-y-2">
              {adminLogins.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between text-[12px]">
                  <span className={l.success ? "text-emerald-400/80" : "text-red-400/80"}>
                    {l.success ? "✓ E suksesshme" : "✗ E dështuar"}
                  </span>
                  <span className="text-[rgb(var(--a-text-rgb)/0.3)]">{formatDate(l.created_at)}</span>
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
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
        Kontakte — 30 ditët e fundit
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
          className="absolute right-3 top-3 z-10 cursor-grab touch-none select-none rounded px-1.5 py-1 text-[14px] leading-none text-[rgb(var(--a-text-rgb)/0.25)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.6)] active:cursor-grabbing"
        >
          ⠿
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Contacts tab ───────────────────────────────────────────────────────────
const REPLY_TEMPLATES: {
  id: string;
  label: string;
  subject: string;
  message: (c: Contact) => string;
}[] = [
  {
    id: "thanks",
    label: "Falënderim + hapi tjetër",
    subject: "Faleminderit për kërkesën — Illyrian Pixel",
    message: (c) =>
      `Faleminderit që na kontaktuat për ${c.service || "projektin tuaj"}.\n\nE kemi marrë kërkesën tuaj dhe do t'ju kontaktojmë brenda 24 orëve me një plan konkret.\n\nNëse dëshironi të flasim më shpejt, na shkruani direkt në WhatsApp ose rezervoni një konsultë falas në faqen tonë.`,
  },
  {
    id: "quote",
    label: "Dërgim oferte",
    subject: "Oferta juaj nga Illyrian Pixel",
    message: (c) =>
      `Bazuar në kërkesën tuaj për ${c.service || "shërbimin e zgjedhur"}, kemi përgatitur një ofertë të personalizuar.\n\nDo ta gjeni të bashkëngjitur / në vijim të këtij emaili. Mos hezitoni të na pyesni për çdo paqartësi — me kënaqësi e përshtatim sipas nevojave tuaja.`,
  },
  {
    id: "followup",
    label: "Follow-up i sjellshëm",
    subject: "A keni pasur kohë të shihni propozimin tonë?",
    message: () =>
      `Donim thjesht të sigurohemi që e keni marrë mesazhin tonë të mëparshëm.\n\nJemi këtu për çdo pyetje dhe mund ta përshtatim ofertën sipas nevojave tuaja. Nëse preferoni një bisedë të shkurtër, na tregoni kur ju përshtatet.`,
  },
];

function ContactsTab({
  contacts,
  setContacts,
  jumpSearch,
  onCreateQuote,
}: {
  contacts: Contact[];
  setContacts: (c: Contact[]) => void;
  jumpSearch?: { term: string; key: number } | null;
  onCreateQuote: (c: Contact) => void;
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
  const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban");
  const [valueDraft, setValueDraft] = useState<Record<number, string>>({});
  const [replyOpenFor, setReplyOpenFor] = useState<number | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyResult, setReplyResult] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const jumpToContact = (c: Contact) => {
    setViewMode("kanban");
    setSearch(c.email);
    setExpanded(c.id);
  };

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
    const update: Partial<Pick<Contact, "assigned_to" | "follow_up_date" | "value">> = {};
    const assignedVal = assignedDraft[c.id];
    const followUpVal = followUpDraft[c.id];
    const valueVal = valueDraft[c.id];
    if (assignedVal !== undefined && assignedVal !== (c.assigned_to ?? "")) update.assigned_to = assignedVal;
    if (followUpVal !== undefined && followUpVal !== (c.follow_up_date ?? "")) update.follow_up_date = followUpVal;
    if (valueVal !== undefined && valueVal !== (c.value === null || c.value === undefined ? "" : String(c.value))) {
      update.value = valueVal === "" ? null : Number(valueVal);
    }
    if (Object.keys(update).length === 0) return;
    updateContact(c.id, update);
  };

  const openReply = (c: Contact) => {
    if (replyOpenFor === c.id) {
      setReplyOpenFor(null);
      return;
    }
    const tpl = REPLY_TEMPLATES[0];
    setReplyOpenFor(c.id);
    setReplySubject(tpl.subject);
    setReplyMessage(tpl.message(c));
    setReplyResult("");
  };

  const applyTemplate = (c: Contact, id: string) => {
    const tpl = REPLY_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setReplySubject(tpl.subject);
    setReplyMessage(tpl.message(c));
  };

  const sendReply = async (c: Contact) => {
    if (!replySubject.trim() || !replyMessage.trim()) return;
    setReplySending(true);
    setReplyResult("");
    try {
      const res = await fetch(`/api/admin/contacts/${c.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyResult(`✓ U dërgua te ${c.email}`);
        if (data.note) setNotesList((l) => ({ ...l, [c.id]: [data.note, ...(l[c.id] ?? [])] }));
        loadLogs(c.id);
        setTimeout(() => setReplyOpenFor(null), 1600);
      } else {
        setReplyResult(data.error ?? "Dërgimi dështoi.");
      }
    } catch {
      setReplyResult("Gabim lidhjeje.");
    } finally {
      setReplySending(false);
    }
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
          className="font-ui min-w-[200px] flex-1 rounded-[2px] border border-[var(--a-border)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {allTags.map((t) => (
            <option key={t} value={t}>{t === "Të gjitha" ? "Të gjitha etiketat" : t}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <button
          onClick={() => downloadContactsCSV(filtered)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ⬇ Export CSV
        </button>
        <div className="flex rounded-[2px] border border-[var(--a-border)]">
          <button
            onClick={() => setViewMode("kanban")}
            className={`font-ui px-4 py-2.5 text-[12px] font-semibold transition-colors ${
              viewMode === "kanban" ? "bg-accent/10 text-accent" : "text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            📋 Kanban
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`font-ui border-l border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold transition-colors ${
              viewMode === "calendar" ? "bg-accent/10 text-accent" : "text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            📅 Kalendar
          </button>
        </div>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[2px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{selected.size} të zgjedhur</span>
          <select
            defaultValue=""
            disabled={bulkBusy}
            onChange={(e) => {
              bulkUpdateStatus(e.target.value);
              e.target.value = "";
            }}
            className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
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
            className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
          >
            Anulo
          </button>
        </div>
      )}

      {viewMode === "calendar" && <FollowUpCalendar contacts={filtered} onSelectContact={jumpToContact} />}

      {viewMode === "kanban" && (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_COLUMNS.map((col) => {
            const items = filtered.filter((c) => (c.status || "new") === col);
            const colValue = items.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
            return (
              <div key={col}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${STATUS_COLORS[col]}`}>
                    {STATUS_LABELS[col]}
                  </h3>
                  <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">
                    {colValue > 0 && <span className="mr-2 font-semibold text-accent/80">{formatMoney(colValue)}</span>}
                    {items.length}
                  </span>
                </div>
                <KanbanColumn id={col}>
                  {items.length === 0 && <EmptyState text="Asnjë kontakt." />}
                  {items.map((c) => {
                    const status = c.status || "new";
                    const overdue = isOverdue(c);
                    const score = leadScore(c);
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
                                  <span className="font-display font-semibold text-[var(--a-text)]">{c.name}</span>
                                  <span
                                    title={`Lead score: ${score.score}/100\n${score.reasons.join("\n")}`}
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${LEAD_LABEL_STYLES[score.label]}`}
                                  >
                                    {LEAD_LABEL_TEXT[score.label]} · {score.score}
                                  </span>
                                  {c.value != null && (
                                    <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold text-accent">
                                      {formatMoney(Number(c.value))}
                                    </span>
                                  )}
                                  <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">{c.email}</span>
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
                                    <span key={tag} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.55)]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">
                                  {c.service} · {c.budget} · {c.timeline}
                                </p>
                                {(c.assigned_to || c.follow_up_date) && (
                                  <p className="mt-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
                                    {c.assigned_to && <>👤 {c.assigned_to}</>}
                                    {c.assigned_to && c.follow_up_date && " · "}
                                    {c.follow_up_date && <>📅 {formatDay(`${c.follow_up_date}T00:00:00`)}</>}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{formatDate(c.created_at)}</p>
                                <span className="text-[11px] text-accent/60">{expanded === c.id ? "Mbyll ▲" : "Hap ▼"}</span>
                              </div>
                            </button>
                          </div>

                          {expanded === c.id && (
                            <div className="border-t border-[var(--a-border)] p-5 text-[13px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.6)]">
                              <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Telefon:</span> {c.phone}</p>
                              {c.business_name && <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Biznesi:</span> {c.business_name}</p>}
                              {c.source_path && <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Erdhi nga faqja:</span> {c.source_path}</p>}
                              <p className="mt-3 whitespace-pre-wrap"><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Mesazhi:</span> {c.message}</p>

                              {/* Quick actions */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <a href={`tel:${c.phone}`} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  📞 Telefono
                                </a>
                                <a href={`mailto:${c.email}`} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  ✉️ Email
                                </a>
                                <a href={whatsappHref(c.phone)} target="_blank" rel="noreferrer" className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  💬 WhatsApp
                                </a>
                                <button
                                  onClick={() => openReply(c)}
                                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                                    replyOpenFor === c.id
                                      ? "border-accent/60 bg-accent/10 text-accent"
                                      : "border-accent/40 text-accent hover:bg-accent/10"
                                  }`}
                                >
                                  📨 Përgjigju nga paneli
                                </button>
                                <button
                                  onClick={() => onCreateQuote(c)}
                                  className="rounded-full border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10"
                                >
                                  🧾 Krijo ofertë
                                </button>
                              </div>

                              {/* Reply composer */}
                              {replyOpenFor === c.id && (
                                <div className="mt-3 rounded-[2px] border border-accent/25 bg-accent/[0.04] p-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <label className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                                      Template:
                                    </label>
                                    {REPLY_TEMPLATES.map((t) => (
                                      <button
                                        key={t.id}
                                        onClick={() => applyTemplate(c, t.id)}
                                        className="font-ui rounded-full border border-[var(--a-border)] px-3 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                                      >
                                        {t.label}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    placeholder="Subjekti"
                                    className="font-ui mt-3 w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <textarea
                                    rows={5}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Mesazhi..."
                                    className="font-ui mt-2 w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] leading-relaxed text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <div className="mt-2 flex items-center gap-3">
                                    <button
                                      onClick={() => sendReply(c)}
                                      disabled={replySending || !replySubject.trim() || !replyMessage.trim()}
                                      className="font-ui rounded-[2px] bg-accent px-4 py-2 text-[11px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
                                    >
                                      {replySending ? "Duke dërguar…" : `Dërgo te ${c.email}`}
                                    </button>
                                    <button
                                      onClick={() => setReplyOpenFor(null)}
                                      className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
                                    >
                                      Anulo
                                    </button>
                                    {replyResult && (
                                      <span className={`text-[11px] ${replyResult.startsWith("✓") ? "text-emerald-400/80" : "text-red-400/80"}`}>
                                        {replyResult}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-2 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
                                    Email-i dërgohet i brenduar nga info@illyrianpixel.com dhe ruhet automatikisht te shënimet.
                                  </p>
                                </div>
                              )}

                              {/* Tags */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Etiketa</label>
                                <div className="flex flex-wrap items-center gap-2">
                                  {(c.tags ?? []).map((tag) => (
                                    <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2.5 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.65)]">
                                      {tag}
                                      <button
                                        onClick={() => removeTag(c, tag)}
                                        disabled={savingId === c.id}
                                        className="text-[rgb(var(--a-text-rgb)/0.35)] transition-colors hover:text-red-400 disabled:opacity-50"
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
                                    className="font-ui w-28 rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-2.5 py-1 text-[11px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Status</label>
                                <select
                                  value={status}
                                  onChange={(e) => updateContact(c.id, { status: e.target.value })}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
                                >
                                  <option value="new">I ri</option>
                                  <option value="in-progress">Në proces</option>
                                  <option value="done">Mbyllur</option>
                                </select>
                              </div>

                              {/* Assigned to + follow-up date + vlera */}
                              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Caktuar tek</label>
                                  <input
                                    type="text"
                                    value={assignedDraft[c.id] ?? c.assigned_to ?? ""}
                                    onChange={(e) => setAssignedDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="p.sh. Ardit"
                                    className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Ndiq më</label>
                                  <input
                                    type="date"
                                    value={followUpDraft[c.id] ?? c.follow_up_date ?? ""}
                                    onChange={(e) => setFollowUpDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Vlera e mundshme (€)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={valueDraft[c.id] ?? (c.value === null || c.value === undefined ? "" : String(c.value))}
                                    onChange={(e) => setValueDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="p.sh. 900"
                                    className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Shënime private</label>

                                {c.notes ? (
                                  <div className="mb-2 rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
                                    <p className="whitespace-pre-wrap text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{c.notes}</p>
                                    <div className="mt-1.5 flex items-center justify-between">
                                      <span className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">Shënim i vjetër</span>
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
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Duke ngarkuar…</p>
                                ) : (notesList[c.id] ?? []).length > 0 ? (
                                  <ul className="space-y-2">
                                    {(notesList[c.id] ?? []).map((n) => (
                                      <li key={n.id} className="rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
                                        {editingNoteId === n.id ? (
                                          <>
                                            <textarea
                                              rows={2}
                                              value={editNoteDraft[n.id] ?? n.text}
                                              onChange={(e) => setEditNoteDraft((d) => ({ ...d, [n.id]: e.target.value }))}
                                              className="font-ui w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                                                className="font-ui text-[10px] font-semibold text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.7)]"
                                              >
                                                Anulo
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <p className="whitespace-pre-wrap text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{n.text}</p>
                                            <div className="mt-1.5 flex items-center justify-between gap-2">
                                              <span className="text-[10px] text-[rgb(var(--a-text-rgb)/0.35)]">
                                                {formatDate(n.created_at)}
                                                {n.updated_at !== n.created_at ? " (ndryshuar)" : ""}
                                              </span>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => {
                                                    setEditingNoteId(n.id);
                                                    setEditNoteDraft((d) => ({ ...d, [n.id]: n.text }));
                                                  }}
                                                  className="font-ui text-[10px] font-semibold text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.7)]"
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
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Asnjë shënim.</p>
                                ) : null}

                                <div className="mt-2">
                                  <textarea
                                    rows={2}
                                    value={newNoteDraft[c.id] ?? ""}
                                    onChange={(e) => setNewNoteDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="Shto shënim..."
                                    className="font-ui w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Historiku</label>
                                {logsLoading[c.id] ? (
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Duke ngarkuar…</p>
                                ) : logs[c.id] && logs[c.id].length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {logs[c.id].map((l) => (
                                      <li key={l.id} className="text-[11px] text-[rgb(var(--a-text-rgb)/0.4)]">
                                        <span className="text-[rgb(var(--a-text-rgb)/0.55)]">
                                          {LOG_ACTION_LABELS[l.action] ? LOG_ACTION_LABELS[l.action](l.detail) : `${l.action}: ${l.detail ?? ""}`}
                                        </span>
                                        {" — "}
                                        {formatDate(l.created_at)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Asnjë ndryshim i regjistruar.</p>
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
      )}
    </div>
  );
}

// ── Follow-up calendar ──────────────────────────────────────────────────────
const WEEKDAY_LABELS = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

function FollowUpCalendar({ contacts, onSelectContact }: { contacts: Contact[]; onSelectContact: (c: Contact) => void }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { label, weeks, todayStr } = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    const year = base.getFullYear();
    const month = base.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday-first offset (0 = Monday)
    const startOffset = (firstDay.getDay() + 6) % 7;

    const cells: { date: Date; key: string }[] = [];
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, 1 - (startOffset - i));
      cells.push({ date: d, key: d.toISOString().slice(0, 10) });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      cells.push({ date, key: date.toISOString().slice(0, 10) });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      cells.push({ date: d, key: d.toISOString().slice(0, 10) });
    }

    const weeks: { date: Date; key: string }[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return {
      label: base.toLocaleDateString("sq-AL", { month: "long", year: "numeric" }),
      weeks,
      todayStr: new Date().toISOString().slice(0, 10),
    };
  }, [monthOffset]);

  const byDate = useMemo(() => {
    const map = new Map<string, Contact[]>();
    contacts.forEach((c) => {
      if (!c.follow_up_date) return;
      const list = map.get(c.follow_up_date) ?? [];
      list.push(c);
      map.set(c.follow_up_date, list);
    });
    return map;
  }, [contacts]);

  const currentMonth = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    return base.getMonth();
  }, [monthOffset]);

  return (
    <div className={CARD + " p-5"}>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((m) => m - 1)}
          className="rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ← Para
        </button>
        <p className="font-display text-[1.1rem] font-semibold capitalize text-[var(--a-text)]">{label}</p>
        <button
          onClick={() => setMonthOffset((m) => m + 1)}
          className="rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          Pas →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.35)]">
            {d}
          </div>
        ))}
        {weeks.flat().map(({ date, key }) => {
          const inMonth = date.getMonth() === currentMonth;
          const items = byDate.get(key) ?? [];
          const isToday = key === todayStr;
          return (
            <div
              key={key}
              className={`min-h-[80px] rounded-[2px] border border-[var(--a-border)] p-1.5 ${
                inMonth ? "" : "opacity-30"
              } ${isToday ? "ring-1 ring-accent/50" : ""}`}
            >
              <p className={`text-[11px] ${isToday ? "font-bold text-accent" : "text-[rgb(var(--a-text-rgb)/0.4)]"}`}>
                {date.getDate()}
              </p>
              <div className="mt-1 space-y-1">
                {items.slice(0, 3).map((c) => {
                  const overdue = isOverdue(c);
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectContact(c)}
                      title={`${c.name} · ${c.service}`}
                      className={`block w-full truncate rounded-[2px] px-1.5 py-0.5 text-left text-[10px] transition-colors ${
                        overdue
                          ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
                {items.length > 3 && (
                  <p className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">+{items.length - 3} më shumë</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Subscribers tab ──────────────────────────────────────────────────────────
function SubscribersTab({
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
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Dërgo email te subscriber-at ({activeCount} aktivë)
        </p>
        <input
          type="text"
          value={broadcastSubject}
          onChange={(e) => setBroadcastSubject(e.target.value)}
          placeholder="Subjekti"
          className="font-ui mb-3 w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          rows={5}
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          placeholder="Mesazhi..."
          className="font-ui w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={sendBroadcast}
            disabled={broadcastSending || !broadcastSubject.trim() || !broadcastMessage.trim() || activeCount === 0}
            className="font-ui rounded-[2px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
          >
            {broadcastSending ? "Duke dërguar…" : "Dërgo email"}
          </button>
          {broadcastResult && <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">{broadcastResult}</span>}
        </div>
      </div>

      {/* Statistika broadcast-esh — opens & clicks */}
      {broadcasts.length > 0 && (
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
                {broadcasts.map((b) => {
                  const openRate = b.sent_count > 0 ? (b.opens / b.sent_count) * 100 : 0;
                  const ctr = b.sent_count > 0 ? (b.clicks / b.sent_count) * 100 : 0;
                  return (
                    <tr key={b.id} className="border-t border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.65)]">
                      <td className="max-w-[220px] truncate py-2.5 pr-4 text-[var(--a-text)]">{b.subject}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">{formatDate(b.created_at)}</td>
                      <td className="py-2.5 pr-4 text-right">{b.sent_count}</td>
                      <td className="py-2.5 pr-4 text-right">{b.opens}</td>
                      <td className="py-2.5 pr-4 text-right text-accent">{openRate.toFixed(0)}%</td>
                      <td className="py-2.5 pr-4 text-right">{b.clicks}</td>
                      <td className="py-2.5 text-right text-accent">{ctr.toFixed(0)}%</td>
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
          className="font-ui min-w-[200px] flex-1 rounded-[2px] border border-[var(--a-border)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
          <span className="font-ui text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{selected.size} të zgjedhur</span>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[2px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
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
              <span className="truncate text-[14px] text-[rgb(var(--a-text-rgb)/0.8)]">{s.email}</span>
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
        className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-30"
      >
        ← Prapa
      </button>
      <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-30"
      >
        Tjetër →
      </button>
    </div>
  );
}

// ── Blog tab ───────────────────────────────────────────────────────────────
const EMPTY_FORM = { slug: "", title: "", category: "", excerpt: "", date: "", content: "", scheduled: "" };

// ISO → vlerë për input datetime-local (në orën lokale)
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
      scheduled: post.published === false ? isoToLocalInput(post.scheduled_for) : "",
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
      const scheduledIso = form.scheduled ? new Date(form.scheduled).toISOString() : null;
      const willBeScheduled = !!scheduledIso && new Date(form.scheduled).getTime() > Date.now();

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
            scheduled_for: scheduledIso,
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
                  published: !willBeScheduled,
                  scheduled_for: willBeScheduled ? scheduledIso : null,
                }
              : p
          )
        );
      } else {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, scheduled_for: scheduledIso }),
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
        <p className="mb-4 font-display text-[1.1rem] font-semibold text-[var(--a-text)]">
          {editingId ? "Edito artikullin" : "Shto artikull të ri"}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Slug (p.sh. titulli-im)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            disabled={!!editingId}
            className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
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
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                className="font-ui mt-2 w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Titulli"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbledhje (excerpt)"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <input
          type="text"
          placeholder="Data (p.sh. Qershor 2026)"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbajtja — ndaj paragrafët me një rresht bosh"
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />

        <div className="mt-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
            ⏰ Planifiko publikimin (ops. — lëre bosh për publikim të menjëhershëm)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="datetime-local"
              value={form.scheduled}
              onChange={(e) => setForm((f) => ({ ...f, scheduled: e.target.value }))}
              className="font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            {form.scheduled && (
              <button
                onClick={() => setForm((f) => ({ ...f, scheduled: "" }))}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Hiq planifikimin
              </button>
            )}
          </div>
        </div>

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
              className="font-ui rounded-[2px] border border-[var(--a-border)] px-6 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
        Artikuj nga admin ({posts.length})
      </p>
      <div className="space-y-3">
        {posts.length === 0 && <EmptyState text="Ende nuk ka artikuj nga admin." />}
        {posts.map((p) => (
          <div key={p.id} className={CARD + " flex items-center justify-between gap-4 p-5"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[var(--a-text)]">
                {p.title}
                {p.published === false && p.scheduled_for && (
                  <span className="ml-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-300">
                    ⏰ Planifikuar · {formatDate(p.scheduled_for)}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
              >
                Edito
              </button>
              <button
                onClick={() => remove(p.id)}
                className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-red-400/70 transition-colors hover:border-red-400/50 hover:text-red-400"
              >
                Fshi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Static articles (from code) */}
      <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
        Artikuj ekzistues në kod ({staticPosts.length}) — vetëm lexim
      </p>
      <div className="space-y-3">
        {staticPosts.map((p) => (
          <div key={p.slug} className={CARD + " flex items-center justify-between gap-4 p-5 opacity-70"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[var(--a-text)]">{p.title}</p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <span className="shrink-0 rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">
              Statik
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
        Artikujt statikë janë pjesë e kodit (lib/blogPosts.ts) dhe nuk mund të editohen apo fshihen nga paneli.
      </p>
    </div>
  );
}

// ── Analytics tab ────────────────────────────────────────────────────────────
function AnalyticsTab({
  stats,
  contacts,
  quotes,
  visitors30,
}: {
  stats: Stats;
  contacts: Contact[];
  quotes: QuoteRecord[];
  visitors30: number;
}) {
  const funnel = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    const contacts30 = contacts.filter((c) => new Date(c.created_at).getTime() >= cutoff);
    const quotes30 = quotes.filter((q) => new Date(q.created_at).getTime() >= cutoff && q.status !== "draft");
    const won30 = contacts30.filter((c) => (c.status || "new") === "done");
    return [
      { label: "Vizitorë", value: visitors30 },
      { label: "Kontakte", value: contacts30.length },
      { label: "Oferta të dërguara", value: quotes30.length },
      { label: "Fituar (mbyllur)", value: won30.length },
    ];
  }, [contacts, quotes, visitors30]);

  const pipeline = useMemo(() => {
    const open = contacts
      .filter((c) => (c.status || "new") !== "done")
      .reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const won = contacts
      .filter((c) => (c.status || "new") === "done")
      .reduce((sum, c) => sum + (Number(c.value) || 0), 0);
    const invoicesPaid = quotes
      .filter((q) => q.kind === "invoice" && q.status === "paid")
      .reduce((sum, q) => sum + quoteTotals(q.items, q.discount, q.tax_rate).total, 0);
    return { open, won, invoicesPaid };
  }, [contacts, quotes]);

  const sources = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const key = c.source_path || "(e panjohur)";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [contacts]);

  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => printMonthlyReport(contacts, stats)}
          className="font-ui rounded-[2px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          🖨 Eksporto raport (PDF)
        </button>
      </div>

      {/* Pipeline value */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-accent">{formatMoney(pipeline.open)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Pipeline i hapur (vlera e kontakteve aktive)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-emerald-400">{formatMoney(pipeline.won)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Vlera e fituar (kontakte të mbyllura)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{formatMoney(pipeline.invoicesPaid)}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Fatura të paguara (gjithsej)</p>
        </div>
      </div>

      {/* Funnel */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Funnel i konvertimit — 30 ditët e fundit
        </p>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const prev = i > 0 ? funnel[i - 1].value : null;
            const rate = prev && prev > 0 ? (step.value / prev) * 100 : null;
            return (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-[rgb(var(--a-text-rgb)/0.65)]">{step.label}</span>
                  <span className="text-[rgb(var(--a-text-rgb)/0.45)]">
                    {step.value.toLocaleString("sq-AL")}
                    {rate !== null && <span className="ml-2 text-accent/70">({rate.toFixed(1)}%)</span>}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-accent/70 to-accent/35 transition-all"
                    style={{ width: `${Math.max(2, (step.value / funnelMax) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Vizitorët maten nga tracking i brendshëm i faqeve (pa cookies). Oferta = dokumente jo-draft të krijuara në 30 ditët e fundit.
        </p>
      </div>

      {/* Burimet e lead-eve */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Nga cilat faqe vijnë kontaktet
        </p>
        {sources.length === 0 ? (
          <EmptyState text="Ende pa të dhëna burimi." />
        ) : (
          <div className="space-y-3">
            {sources.map(([path, count]) => {
              const max = sources[0][1];
              return (
                <div key={path}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
                    <span className="truncate pr-3 font-mono text-[11px]">{path}</span>
                    <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
                    <div className="h-2 rounded-full bg-accent/50" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
          “(e panjohur)” janë kontakte të ardhura para aktivizimit të gjurmimit të burimit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{stats.conversionRate.toFixed(1)}%</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Norma e konvertimit (Mbyllur / Total)</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">
            {stats.avgDaysToClose !== null ? stats.avgDaysToClose.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Ditë mesatare deri në mbyllje</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{stats.totalContacts}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Kontakte gjithsej</p>
        </div>
      </div>

      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
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
                  <div className="mb-1 flex items-center justify-between text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
                    <span>{service}</span>
                    <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgb(var(--a-text-rgb)/0.05)]">
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

// ── 2FA card ─────────────────────────────────────────────────────────────────
function TwoFactorCard() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<{ secret: string; uri: string; qr: string } | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    fetch("/api/admin/2fa")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      // QR gjenerohet lokalisht — sekreti nuk del te asnjë shërbim i jashtëm
      const QRCode = (await import("qrcode")).default;
      const qr = await QRCode.toDataURL(data.uri, { margin: 1, width: 192 });
      setSetup({ secret: data.secret, uri: data.uri, qr });
      setToken("");
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  const confirmEnable = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", token }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      setEnabled(true);
      setSetup(null);
      setToken("");
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDisable = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", token }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      setEnabled(false);
      setDisabling(false);
      setToken("");
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={CARD + " p-5"}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Verifikim me dy hapa (2FA)
        </p>
        {enabled !== null && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
              enabled
                ? "border-emerald-400/30 bg-emerald-400/8 text-emerald-300"
                : "border-[rgb(var(--a-text-rgb)/0.2)] text-[rgb(var(--a-text-rgb)/0.45)]"
            }`}
          >
            {enabled ? "✓ Aktiv" : "Joaktiv"}
          </span>
        )}
      </div>

      {enabled === null && <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">Duke kontrolluar…</p>}

      {enabled === false && !setup && (
        <>
          <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.5)]">
            Shto një shtresë të dytë sigurie: pas fjalëkalimit do të kërkohet një kod 6-shifror nga
            aplikacioni autentifikues (Google Authenticator, 1Password, Authy etj.).
          </p>
          <button
            onClick={startSetup}
            disabled={busy}
            className="font-ui mt-4 rounded-[2px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            {busy ? "Duke përgatitur…" : "Aktivizo 2FA"}
          </button>
        </>
      )}

      {setup && (
        <div className="flex flex-wrap items-start gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qr} alt="Kodi QR për 2FA" className="h-44 w-44 rounded-lg bg-white p-2" />
          <div className="min-w-[240px] flex-1">
            <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.6)]">
              1. Skano kodin QR me aplikacionin autentifikues.<br />
              2. Ose shtoje manualisht me këtë sekret:
            </p>
            <code className="mt-2 block break-all rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 font-mono text-[11px] text-accent">
              {setup.secret}
            </code>
            <p className="mt-3 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">3. Shkruaj kodin 6-shifror për ta konfirmuar:</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="font-mono w-32 rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-center text-[16px] tracking-[0.3em] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <button
                onClick={confirmEnable}
                disabled={busy || token.length !== 6}
                className="font-ui rounded-[2px] bg-accent px-4 py-2 text-[12px] font-bold text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
              >
                {busy ? "…" : "Konfirmo"}
              </button>
              <button
                onClick={() => setSetup(null)}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Anulo
              </button>
            </div>
          </div>
        </div>
      )}

      {enabled === true && (
        <>
          <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.5)]">
            Hyrja kërkon fjalëkalimin + kodin 6-shifror nga aplikacioni autentifikues.
          </p>
          {!disabling ? (
            <button
              onClick={() => {
                setDisabling(true);
                setToken("");
                setError("");
              }}
              className="font-ui mt-4 rounded-[2px] border border-red-400/30 px-4 py-2 text-[12px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10"
            >
              Çaktivizo 2FA
            </button>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="Kodi aktual"
                className="font-mono w-36 rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-center text-[14px] tracking-[0.25em] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <button
                onClick={confirmDisable}
                disabled={busy || token.length !== 6}
                className="font-ui rounded-[2px] border border-red-400/40 px-4 py-2 text-[12px] font-semibold text-red-400 transition-colors hover:bg-red-400/10 disabled:opacity-40"
              >
                {busy ? "…" : "Konfirmo çaktivizimin"}
              </button>
              <button
                onClick={() => setDisabling(false)}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Anulo
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="mt-3 text-[12px] text-red-400/80">{error}</p>}
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
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Cilësime të faqes
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Kodi i zbritjes (newsletter)
            </label>
            <input
              type="text"
              value={settings.newsletter_discount_code}
              onChange={(e) => setSettings((s) => ({ ...s, newsletter_discount_code: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Numri WhatsApp (pa +, p.sh. 355...)
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings((s) => ({ ...s, whatsapp_number: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
        <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Këto vlera përdoren në email-et e newsletter-it (kodi i zbritjes dhe lidhja WhatsApp).
        </p>
      </div>

      <div className={CARD + " p-5"}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Popup &quot;Para se të largoheni&quot; (exit-intent)
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
            <input
              type="checkbox"
              checked={settings.popup_enabled === "1"}
              onChange={(e) => setSettings((s) => ({ ...s, popup_enabled: e.target.checked ? "1" : "0" }))}
              className="h-3.5 w-3.5 accent-[#ab8339]"
            />
            Aktiv
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Mbititulli
            </label>
            <input
              type="text"
              value={settings.popup_eyebrow}
              onChange={(e) => setSettings((s) => ({ ...s, popup_eyebrow: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Titulli
            </label>
            <input
              type="text"
              value={settings.popup_title}
              onChange={(e) => setSettings((s) => ({ ...s, popup_title: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Teksti
            </label>
            <input
              type="text"
              value={settings.popup_text}
              onChange={(e) => setSettings((s) => ({ ...s, popup_text: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Butoni (CTA)
            </label>
            <input
              type="text"
              value={settings.popup_cta}
              onChange={(e) => setSettings((s) => ({ ...s, popup_cta: e.target.value }))}
              className="font-ui w-full rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
        <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Popup-i shfaqet një herë për sesion kur vizitori bëhet gati të largohet nga faqja. Ndryshimet hyjnë në fuqi brenda ~5 minutash.
        </p>
      </div>

      <TwoFactorCard />

      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
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
                <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{l.ip ?? "—"}</span>
                <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{formatDate(l.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
