"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import QuotesTab, { type QuoteContact, type TrashedQuote } from "@/components/admin/QuotesTab";
import ContentTab, { type PricingCatalogEntry } from "@/components/admin/ContentTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ActivityTab from "@/components/admin/ActivityTab";
import AssistantTab from "@/components/admin/AssistantTab";
import NotesTab from "@/components/admin/NotesTab";
import TodosTab from "@/components/admin/TodosTab";
import ClientsTab from "@/components/admin/ClientsTab";
import FinancesTab from "@/components/admin/FinancesTab";
import NotificationsBell from "@/components/admin/NotificationsBell";
import CommandPalette, { type CommandPaletteAction } from "@/components/admin/CommandPalette";
import AttachmentsPanel from "@/components/admin/AttachmentsPanel";
import type { QuoteRecord, RecurringInvoice } from "@/lib/quotes";
import { quoteTotals, formatMoney } from "@/lib/quotes";
import { PROJECT_PHASE_LABELS, type ProjectRecord } from "@/lib/projects";
import type { TestimonialRow, PortfolioRow, FaqRow } from "@/lib/publicContent";
import type { PricingOverrides } from "@/lib/pricingOverrides";
import { leadScore, LEAD_LABEL_STYLES, LEAD_LABEL_TEXT } from "@/lib/leadScore";
import SettingsTab from "@/components/admin/SettingsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import BlogTab from "@/components/admin/BlogTab";
import SubscribersTab from "@/components/admin/SubscribersTab";
import { CARD, EmptyState, Skeleton, STATUS_LABELS, formatDate, formatDay, useDebounced, useConfirm, useUndoToast } from "@/components/admin/ui";
import { AdminIcon, type AdminIconName } from "@/components/admin/icons";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

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
  "assistant",
  "settings",
  "notes",
  "todos",
  "clients",
  "finances",
] as const;

export type AdminTab = (typeof VALID_TABS)[number];

export type Contact = {
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
  viewed_at: string | null;
  portal_token: string | null;
};

export type TrashedContact = {
  id: number;
  name: string;
  email: string;
  business_name: string | null;
  service: string;
  deleted_at: string;
};

type AutoActivity = {
  entity: string;
  action: string;
  label: string;
  created_at: string;
};

export type BroadcastStat = {
  id: string;
  subject: string;
  created_at: string;
  sent_count: number;
  opens: number;
  clicks: number;
  scheduled_for?: string | null;
  sent_at?: string | null;
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

export type Subscriber = {
  id: number;
  email: string;
  subscribed_at: string;
  unsubscribed: boolean;
};

export type BlogPost = {
  id: number;
  created_at: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
  meta_description?: string | null;
  published?: boolean;
  scheduled_for?: string | null;
};

export type StaticPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
};

export type Stats = {
  totalContacts: number;
  totalSubscribers: number;
  contactsThisWeek: number;
  subscribersThisWeek: number;
  discountUsed: number;
  conversionRate: number;
  avgDaysToClose: number | null;
  topServices: { service: string; count: number }[];
};

export type AdminLogin = {
  id: number;
  success: boolean;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

type SavedContactFilter = {
  name: string;
  search: string;
  serviceFilter: string;
  tagFilter: string;
  dateFrom: string;
  dateTo: string;
  followUpFilter: "all" | "none" | "overdue" | "upcoming";
};

const CONTACT_FILTERS_KEY = "ip_admin_contact_saved_filters";

export type SiteSettings = {
  newsletter_discount_code: string;
  whatsapp_number: string;
  popup_enabled: string;
  popup_eyebrow: string;
  popup_title: string;
  popup_text: string;
  popup_cta: string;
  popup_eyebrow_en: string;
  popup_title_en: string;
  popup_text_en: string;
  popup_cta_en: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  "in-progress": "border-yellow-400/30 bg-yellow-400/8 text-yellow-300",
  done: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
};

const STATUS_COLUMNS = ["new", "in-progress", "done"] as const;

// Statike (jo toLocaleDateString) qëllimisht — Node.js në server shpesh s'ka
// të dhëna të plota ICU për "sq-AL" dhe prodhon tekst tjetër nga browser-i,
// duke shkaktuar hydration mismatch. Kjo garanton identitet server/klient.
const SHORT_MONTH_LABELS = ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj"];

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

function whatsappHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "355" + digits.slice(1);
  if (!digits.startsWith("355") && digits.length <= 9) digits = "355" + digits;
  return `https://wa.me/${digits}`;
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
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
  trashedContacts: initialTrashedContacts,
  trashedQuotes: initialTrashedQuotes,
  autoActivity,
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
  trashedContacts: TrashedContact[];
  trashedQuotes: TrashedQuote[];
  autoActivity: AutoActivity[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
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
  const [trashedContacts, setTrashedContacts] = useState(initialTrashedContacts);
  const [trashedQuotes, setTrashedQuotes] = useState(initialTrashedQuotes);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [globalSearch, setGlobalSearch] = useState("");
  const [contactsJump, setContactsJump] = useState<{ term: string; key: number } | null>(null);
  const [subscribersJump, setSubscribersJump] = useState<{ term: string; key: number } | null>(null);
  const [quotesJump, setQuotesJump] = useState<{ term: string; key: number } | null>(null);
  const [projectsJump, setProjectsJump] = useState<{ term: string; key: number } | null>(null);
  const [quotePrefill, setQuotePrefill] = useState<{ contact: QuoteContact; key: number } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const lastCheckRef = useRef(new Date().toISOString());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("admin_theme") === "light") setTheme("light");
    const urlTab = new URLSearchParams(window.location.search).get("tab");
    if (urlTab && VALID_TABS.includes(urlTab as typeof tab)) {
      setTab(urlTab as typeof tab);
      return;
    }
    const savedTab = window.localStorage.getItem("admin_active_tab");
    if (savedTab && VALID_TABS.includes(savedTab as typeof tab)) setTab(savedTab as typeof tab);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("admin_active_tab", tab);
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== tab) {
      params.set("tab", tab);
      router.replace(`/admin?${params.toString()}`, { scroll: false });
    }
  }, [tab, router]);

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

  // Bllokon scroll-in e sfondit dhe mbyll me Escape kur menyja mobile është hapur
  useEffect(() => {
    if (!mobileNavOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileNavOpen]);

  // Mbyll menynë mobile automatikisht nëse ekrani bëhet desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileNavOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") window.localStorage.setItem("admin_theme", next);
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

  const NAV_ITEMS: { id: typeof tab; icon: AdminIconName; label: string; count?: number; alert?: number }[] = [
    { id: "overview", icon: "home", label: "Përmbledhje" },
    { id: "contacts", icon: "inbox", label: "Kontaktet", count: contacts.length, alert: dueSoonCount },
    { id: "quotes", icon: "receipt", label: "Oferta & Fatura", count: quotes.length },
    { id: "projects", icon: "folder", label: "Projektet", count: projectsList.length },
    { id: "clients", icon: "briefcase", label: "Klientët" },
    { id: "finances", icon: "wallet", label: "Financat" },
    { id: "blog", icon: "pen", label: "Blog", count: blogPosts.length + staticPosts.length },
    { id: "subscribers", icon: "mail", label: "Newsletter", count: subscribers.length },
    { id: "content", icon: "layers", label: "Përmbajtja" },
    { id: "analytics", icon: "chart", label: "Analitika" },
    { id: "notes", icon: "note", label: "Notes" },
    { id: "todos", icon: "check", label: "To Do" },
    { id: "history", icon: "clock", label: "Historia" },
    { id: "assistant", icon: "crown", label: "Mbreti Genti" },
    { id: "settings", icon: "settings", label: "Cilësimet" },
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
    assistant: { title: "Mbreti Genti", subtitle: "Bisedat me asistentin virtual — çfarë pyesin vizitorët" },
    settings: { title: "Cilësimet", subtitle: "Konfigurime dhe siguria" },
    clients: { title: "Klientët", subtitle: "Klientët që kanë paguar — projektet, pagesat dhe rekurrenca" },
    notes: { title: "Notes", subtitle: "Shënime të shpejta, personale" },
    todos: { title: "To Do", subtitle: "Lista jote e detyrave" },
    finances: { title: "Financat", subtitle: "Fitime, shpenzime dhe fitimi neto" },
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
    const quoteMatches = quotes
      .filter((doc) => `${doc.number} ${doc.client_name} ${doc.client_email ?? ""}`.toLowerCase().includes(q))
      .slice(0, 4);
    const projectMatches = projectsList
      .filter((p) => `${p.name} ${p.client_name ?? ""}`.toLowerCase().includes(q))
      .slice(0, 3);
    const faqMatches = faqsList.filter((f) => f.question.toLowerCase().includes(q)).slice(0, 3);
    return { contactMatches, subscriberMatches, blogMatches, quoteMatches, projectMatches, faqMatches };
  }, [globalSearch, contacts, subscribers, blogPosts, staticPosts, quotes, projectsList, faqsList]);

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

  const goToQuote = (term: string) => {
    setTab("quotes");
    setQuotesJump({ term, key: Date.now() });
    setGlobalSearch("");
  };

  const goToProject = (term: string) => {
    setTab("projects");
    setProjectsJump({ term, key: Date.now() });
    setGlobalSearch("");
  };

  const goToFaq = () => {
    setTab("content");
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

  const paletteActions: CommandPaletteAction[] = [
    ...NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      icon: <AdminIcon name={item.icon} className="h-4 w-4" />,
      label: TAB_TITLES[item.id].title,
      hint: "Shko te",
      onRun: () => setTab(item.id),
    })),
    {
      id: "new-quote",
      icon: <AdminIcon name="plus" className="h-4 w-4" />,
      label: "Ofertë / Faturë e re",
      hint: "Krijo",
      onRun: () => setTab("quotes"),
    },
    {
      id: "new-project",
      icon: <AdminIcon name="plus" className="h-4 w-4" />,
      label: "Projekt i ri",
      hint: "Krijo",
      onRun: () => setTab("projects"),
    },
    {
      id: "new-post",
      icon: <AdminIcon name="plus" className="h-4 w-4" />,
      label: "Artikull i ri blogu",
      hint: "Krijo",
      onRun: () => setTab("blog"),
    },
    {
      id: "toggle-theme",
      icon: theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />,
      label: theme === "dark" ? "Mënyra e ndritshme" : "Mënyra e errët",
      hint: "Pamja",
      onRun: () => toggleTheme(),
    },
    {
      id: "export-backup",
      icon: <AdminIcon name="download" className="h-4 w-4" />,
      label: "Shkarko backup (JSON)",
      hint: "Eksport",
      onRun: () => {
        if (typeof window !== "undefined") window.location.href = "/api/admin/export";
      },
    },
    {
      id: "logout",
      icon: <AdminIcon name="logout" className="h-4 w-4" />,
      label: "Dil nga llogaria",
      hint: "Siguri",
      onRun: () => logout(),
    },
  ];

  return (
    <div data-theme={theme} className="admin-shell flex min-h-screen flex-col bg-[var(--a-bg)] text-[var(--a-text)] md:flex-row">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={paletteActions} />
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-accent/40 bg-[var(--a-card)] px-4 py-3 text-[12px] text-[var(--a-text)] shadow-xl backdrop-blur-[12px] animate-[fadeIn_0.2s_ease-out]"
            >
              🔔 {t.text}
            </div>
          ))}
        </div>
      )}

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menyja kryesore"
            className="animate-drawer-in absolute left-0 top-0 flex h-full w-72 max-w-[82vw] flex-col border-r border-[var(--a-border)] bg-[var(--a-card2)] p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-display text-[15px] font-bold text-accent">
                IP
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
                <h1 className="font-display text-[1.15rem] font-bold leading-tight text-[var(--a-text)]">Admin Panel</h1>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Mbyll menynë"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--a-border)] text-[14px] text-[rgb(var(--a-text-rgb)/0.5)] transition-colors hover:text-[var(--a-text)]"
              >
                ✕
              </button>
            </div>

            <nav className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto">
              <SidebarNav navItems={NAV_ITEMS} tab={tab} setTab={setTab} onNavigate={() => setMobileNavOpen(false)} />
              <div className="mt-1 px-1">
                <NotificationsBell
                  setTab={(t) => {
                    setTab(t);
                    setMobileNavOpen(false);
                  }}
                  inline
                  dropUp={false}
                />
              </div>
            </nav>

            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--a-border)] pt-3">
              <button
                onClick={toggleTheme}
                className="font-ui flex items-center justify-center gap-2 rounded-xl border border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
              >
                {theme === "dark" ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
                {theme === "dark" ? "Mënyra e ndritshme" : "Mënyra e errët"}
              </button>
              <button
                onClick={logout}
                className="font-ui flex items-center justify-center gap-2 rounded-xl border border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-red-400/40 hover:text-red-400"
              >
                ⏻ Dil
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 z-40 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[var(--a-border)] bg-[var(--a-card2)] md:flex">
        <div className="relative flex items-center gap-2.5 px-5 pb-4 pt-5">
          <div className="pointer-events-none absolute left-1 top-1 h-14 w-14">
            <div className="admin-glow" />
          </div>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-display text-[14px] font-bold text-accent">
            IP
          </div>
          <div className="relative min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
            <p className="font-display text-[0.95rem] font-bold leading-tight text-[var(--a-text)]">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 pt-1">
          <SidebarNav navItems={NAV_ITEMS} tab={tab} setTab={setTab} />
        </nav>

        <div className="border-t border-[var(--a-border)] p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-ui flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.45)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.04)] hover:text-[var(--a-text)]"
          >
            <AdminIcon name="external" className="h-3.5 w-3.5" />
            Shiko faqen live
          </a>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">

      {/* Top bar (desktop) */}
      <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center gap-2 border-b border-[var(--a-border)] bg-[var(--a-bg)]/85 px-6 backdrop-blur-md md:flex lg:px-8">

        {/* Global search */}
        <div className="relative w-full max-w-sm">
          <AdminIcon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[rgb(var(--a-text-rgb)/0.35)]"
          />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Kërko kontakte, oferta, projekte…"
            className="font-ui w-full rounded-xl border border-[var(--a-border)] bg-[var(--a-input)] py-2 pl-9 pr-14 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
          />
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title="Hap command palette (Ctrl/⌘ + K)"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[6px] border border-[var(--a-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.35)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
          >
            ⌘K
          </button>
          {globalResults && (
            <div className="absolute left-0 top-full z-40 mt-2 max-h-96 w-96 overflow-y-auto rounded-xl border border-[var(--a-card-border)] bg-[var(--a-card)] shadow-2xl backdrop-blur-[12px]">
              {globalResults.contactMatches.length === 0 &&
              globalResults.subscriberMatches.length === 0 &&
              globalResults.blogMatches.length === 0 &&
              globalResults.quoteMatches.length === 0 &&
              globalResults.projectMatches.length === 0 &&
              globalResults.faqMatches.length === 0 ? (
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
                    <div className="border-b border-[var(--a-border)] py-1.5">
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
                  {globalResults.quoteMatches.length > 0 && (
                    <div className="border-b border-[var(--a-border)] py-1.5">
                      <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">Oferta / Fatura</p>
                      {globalResults.quoteMatches.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => goToQuote(doc.number)}
                          className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                        >
                          {doc.number} <span className="text-[rgb(var(--a-text-rgb)/0.35)]">· {doc.client_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {globalResults.projectMatches.length > 0 && (
                    <div className="border-b border-[var(--a-border)] py-1.5">
                      <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">Projekte</p>
                      {globalResults.projectMatches.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => goToProject(p.name)}
                          className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                        >
                          {p.name} {p.client_name && <span className="text-[rgb(var(--a-text-rgb)/0.35)]">· {p.client_name}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {globalResults.faqMatches.length > 0 && (
                    <div className="py-1.5">
                      <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">FAQ</p>
                      {globalResults.faqMatches.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => goToFaq()}
                          className="block w-full px-3 py-1.5 text-left text-[12px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                        >
                          {f.question}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <NotificationsBell setTab={setTab} />

        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Mënyra e ndritshme" : "Mënyra e errët"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          {theme === "dark" ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
        </button>

        <div className="mx-1 h-7 w-px shrink-0 bg-[var(--a-border)]" />

        <button
          onClick={logout}
          title="Dil"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:border-red-400/40 hover:text-red-400"
        >
          <AdminIcon name="logout" className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 py-8 md:px-8 md:py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 -mx-5 mb-1 flex items-center gap-3 border-b border-[var(--a-border)] bg-[var(--a-bg)]/85 px-5 py-3 backdrop-blur-md md:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Hap menynë"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--a-border)] text-[15px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              ☰
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
              <h1 className="truncate font-display text-[1.15rem] font-bold leading-tight text-[var(--a-text)]">{TAB_TITLES[tab].title}</h1>
            </div>
            <NotificationsBell setTab={setTab} />
          </div>

          {/* Page title (desktop) */}
          <div className="hidden md:block">
            <h2 className="font-display text-[1.7rem] font-bold tracking-[-0.01em] text-[var(--a-text)]">{TAB_TITLES[tab].title}</h2>
            <p className="mt-1.5 text-[12.5px] text-[rgb(var(--a-text-rgb)/0.45)]">{TAB_TITLES[tab].subtitle}</p>
          </div>

          {tab === "contacts" && (
            <>
              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4 md:mt-4 md:grid-cols-3 lg:grid-cols-5">
                <StatCard label="Kontakte gjithsej" value={stats.totalContacts} featured />
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
              <OverviewTab
                contacts={contacts}
                subscribers={subscribers}
                stats={stats}
                adminLogins={adminLogins}
                projects={projectsList}
                quotes={quotes}
                broadcasts={broadcasts}
                onGoToContact={goToContact}
                onGoToQuote={goToQuote}
                onGoToProject={goToProject}
                autoActivity={autoActivity}
              />
            )}
            {tab === "contacts" && (
              <ContactsTab
                contacts={contacts}
                setContacts={setContacts}
                jumpSearch={contactsJump}
                onCreateQuote={createQuoteForContact}
                trashedContacts={trashedContacts}
                setTrashedContacts={setTrashedContacts}
              />
            )}
            {tab === "quotes" && (
              <QuotesTab
                quotes={quotes}
                setQuotes={setQuotes}
                contacts={contacts.map((c) => ({ id: c.id, name: c.name, email: c.email, business_name: c.business_name }))}
                recurring={recurringList}
                setRecurring={setRecurringList}
                prefill={quotePrefill}
                jumpSearch={quotesJump}
                trashedQuotes={trashedQuotes}
                setTrashedQuotes={setTrashedQuotes}
              />
            )}
            {tab === "projects" && (
              <ProjectsTab
                projects={projectsList}
                setProjects={setProjectsList}
                contacts={contacts.map((c) => ({ id: c.id, name: c.name, email: c.email, business_name: c.business_name }))}
                jumpSearch={projectsJump}
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
              <AnalyticsTab stats={stats} contacts={contacts} quotes={quotes} visitors30={visitors30} recurring={recurringList} />
            )}
            {tab === "history" && <ActivityTab />}
            {tab === "assistant" && <AssistantTab />}
            {tab === "settings" && <SettingsTab adminLogins={adminLogins} initialSettings={siteSettings} />}
            {tab === "notes" && <NotesTab />}
            {tab === "todos" && <TodosTab />}
            {tab === "clients" && (
              <ClientsTab contacts={contacts} projects={projectsList} quotes={quotes} recurring={recurringList} onGoToContact={goToContact} />
            )}
            {tab === "finances" && <FinancesTab quotes={quotes} recurring={recurringList} />}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, featured }: { label: string; value: number; featured?: boolean }) {
  return (
    <div className={CARD + (featured ? " border-accent/30 p-5" : " p-5")}>
      <p className="font-ui text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--a-text-rgb)/0.45)]">
        {label}
      </p>
      <p
        className={`mt-2 font-display font-bold leading-none tabular-nums ${
          featured ? "text-[2.1rem] text-accent" : "text-[1.8rem] text-[var(--a-text)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// Numri i item-eve "kryesore" para ndarëses "Menaxhimi" në sidebar
const MAIN_NAV_COUNT = 7;

// ── Sidebar / drawer navigation (e ndarë mes desktop dhe mobile) ────────────
function SidebarNav({
  navItems,
  tab,
  setTab,
  collapsed,
  onNavigate,
}: {
  navItems: { id: AdminTab; icon: AdminIconName; label: string; count?: number; alert?: number }[];
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map((item, i) => (
        <Fragment key={item.id}>
          {i === MAIN_NAV_COUNT &&
            (collapsed ? (
              <div className="my-2 border-t border-[var(--a-border)]" />
            ) : (
              <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[rgb(var(--a-text-rgb)/0.25)]">
                Menaxhimi
              </p>
            ))}
          <button
            onClick={() => {
              setTab(item.id);
              onNavigate?.();
            }}
            title={collapsed ? item.label : undefined}
            className={`font-ui relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[13px] font-semibold tracking-[0.3px] transition-all duration-200 ${
              tab === item.id
                ? "bg-[rgb(var(--a-text-rgb)/0.07)] text-[var(--a-text)]"
                : "text-[rgb(var(--a-text-rgb)/0.45)] hover:bg-[rgb(var(--a-text-rgb)/0.03)] hover:text-[rgb(var(--a-text-rgb)/0.8)]"
            } ${collapsed ? "justify-center" : "justify-between"}`}
          >
            {tab === item.id && (
              <span className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-full bg-accent" />
            )}
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  tab === item.id ? "bg-accent/15 text-accent" : "bg-[rgb(var(--a-text-rgb)/0.04)]"
                }`}
              >
                <AdminIcon name={item.icon} className="h-[15px] w-[15px]" />
                {!!item.alert && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-[var(--a-card2)]">
                    {item.alert > 9 ? "9+" : item.alert}
                  </span>
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </span>
            {!collapsed && item.count !== undefined && (
              <span className="shrink-0 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{item.count}</span>
            )}
          </button>
        </Fragment>
      ))}
    </>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  contacts,
  subscribers,
  stats,
  adminLogins,
  projects,
  quotes,
  broadcasts,
  onGoToContact,
  onGoToQuote,
  onGoToProject,
  autoActivity,
}: {
  contacts: Contact[];
  subscribers: Subscriber[];
  stats: Stats;
  adminLogins: AdminLogin[];
  projects: ProjectRecord[];
  quotes: QuoteRecord[];
  broadcasts: BroadcastStat[];
  onGoToContact: (term: string) => void;
  onGoToQuote: (term: string) => void;
  onGoToProject: (term: string) => void;
  autoActivity: AutoActivity[];
}) {
  const today = new Date().toISOString().slice(0, 10);

  const overdueFollowUps = useMemo(() => contacts.filter(isOverdue).length, [contacts]);

  const overdueInvoices = useMemo(
    () =>
      quotes
        .filter((q) => q.kind === "invoice" && q.status !== "paid" && q.status !== "draft" && q.due_at && q.due_at < today)
        .sort((a, b) => (a.due_at! < b.due_at! ? -1 : 1)),
    [quotes, today]
  );
  const overdueInvoicesTotal = useMemo(
    () => overdueInvoices.reduce((sum, q) => sum + quoteTotals(q.items, q.discount, q.tax_rate).total, 0),
    [overdueInvoices]
  );

  const upcomingDeadlines = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 3);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return projects
      .filter((p) => p.status !== "done" && p.deadline && p.deadline <= cutoffStr)
      .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));
  }, [projects]);
  const overdueDeadlinesCount = useMemo(
    () => upcomingDeadlines.filter((p) => p.deadline! < today).length,
    [upcomingDeadlines, today]
  );

  const needsAttention = overdueInvoices.length > 0 || overdueFollowUps > 0 || upcomingDeadlines.length > 0;

  const lastBackup = useMemo(
    () => autoActivity.find((a) => a.action === "backup") ?? null,
    [autoActivity]
  );
  const daysSinceBackup = lastBackup
    ? Math.floor((Date.now() - new Date(lastBackup.created_at).getTime()) / 86400000)
    : null;
  const backupHealthy = daysSinceBackup !== null && daysSinceBackup <= 8;

  // SLA — koha mesatare deri sa admini hap kontaktin e ri për herë të parë
  // (viewed_at), llogaritur nga kontaktet e 30 ditëve të fundit. Përdor vetëm
  // të dhëna që ekzistojnë tashmë (viewed_at bulk-loaded), pa query të re.
  const avgResponseHours = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    const durations = contacts
      .filter((c) => c.viewed_at && new Date(c.created_at).getTime() >= cutoff)
      .map((c) => (new Date(c.viewed_at!).getTime() - new Date(c.created_at).getTime()) / 3600000)
      .filter((h) => h >= 0);
    if (durations.length === 0) return null;
    return durations.reduce((sum, h) => sum + h, 0) / durations.length;
  }, [contacts]);
  const responseHealthy = avgResponseHours !== null && avgResponseHours <= 24;

  // KPI Marketing — leads/muaj (6 muajt e fundit), konvertimi ofertë→klient
  // (oferta të dërguara që u pranuan/u paguan) dhe burimet kryesore të leads.
  // Gjithçka nga contacts/quotes që ekzistojnë tashmë si props, pa query të re.
  const leadsByMonth = useMemo(() => {
    const counts = new Map<string, number>();
    const months: string[] = [];
    const ref = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      months.push(key);
      counts.set(key, 0);
    }
    for (const c of contacts) {
      const key = c.created_at.slice(0, 7);
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return months.map((key) => {
      const monthIdx = Number(key.slice(5, 7)) - 1;
      return { key, label: SHORT_MONTH_LABELS[monthIdx], count: counts.get(key) ?? 0 };
    });
  }, [contacts]);
  const maxLeadsInMonth = Math.max(1, ...leadsByMonth.map((m) => m.count));

  const quoteConversion = useMemo(() => {
    const sent = quotes.filter((q) => q.kind === "quote" && q.status !== "draft");
    const won = sent.filter((q) => q.status === "accepted" || q.status === "paid");
    return {
      sent: sent.length,
      won: won.length,
      rate: sent.length > 0 ? (won.length / sent.length) * 100 : null,
    };
  }, [quotes]);

  const topLeadSources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of contacts) {
      const src = c.source_path?.trim() || "(i panjohur)";
      counts.set(src, (counts.get(src) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [contacts]);

  const scheduledBroadcasts = useMemo(
    () =>
      broadcasts
        .filter((b) => !b.sent_at && b.scheduled_for)
        .sort((a, b) => (a.scheduled_for! < b.scheduled_for! ? -1 : 1)),
    [broadcasts]
  );

  const projectsSummary = useMemo(() => {
    const active = projects.filter((p) => p.status === "active");
    const withTasks = projects.filter((p) => p.tasks.length > 0);
    const avgPct =
      withTasks.length === 0
        ? null
        : Math.round(
            (withTasks.reduce((sum, p) => sum + p.tasks.filter((t) => t.done).length / p.tasks.length, 0) /
              withTasks.length) *
              100
          );
    const byPhase = new Map<string, number>();
    active.forEach((p) => byPhase.set(p.phase, (byPhase.get(p.phase) ?? 0) + 1));
    return { active: active.length, total: projects.length, avgPct, byPhase };
  }, [projects]);

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
        <StatCard label="Norma e konvertimit (%)" value={Math.round(stats.conversionRate)} featured />
      </div>

      {/* Kërkon vëmendjen sot — bashkon fatura të vonuara, follow-up të vonuara dhe afate projektesh */}
      <div className={`${CARD} p-5 ${needsAttention ? "border-red-400/25" : ""}`}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Kërkon vëmendjen sot
        </p>
        {!needsAttention ? (
          <p className="text-[13px] text-emerald-300">✅ Asgjë urgjente — fatura, follow-up dhe afate janë në rregull.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              onClick={() => onGoToQuote("")}
              disabled={overdueInvoices.length === 0}
              className={`rounded-[10px] border px-4 py-3 text-left transition-colors ${
                overdueInvoices.length === 0
                  ? "border-emerald-400/25 bg-emerald-400/5"
                  : "border-red-400/25 bg-red-400/5 hover:border-red-400/45"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Fatura të vonuara</p>
              <p className={`mt-1 text-[14px] font-semibold ${overdueInvoices.length === 0 ? "text-emerald-300" : "text-red-300"}`}>
                {overdueInvoices.length === 0
                  ? "✅ Asnjë"
                  : `🔴 ${overdueInvoices.length} · ${formatMoney(overdueInvoicesTotal)}`}
              </p>
            </button>
            <button
              onClick={() => onGoToContact("")}
              disabled={overdueFollowUps === 0}
              className={`rounded-[10px] border px-4 py-3 text-left transition-colors ${
                overdueFollowUps === 0
                  ? "border-emerald-400/25 bg-emerald-400/5"
                  : "border-red-400/25 bg-red-400/5 hover:border-red-400/45"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Follow-up të vonuara</p>
              <p className={`mt-1 text-[14px] font-semibold ${overdueFollowUps === 0 ? "text-emerald-300" : "text-red-300"}`}>
                {overdueFollowUps === 0 ? "✅ Asnjë" : `🔴 ${overdueFollowUps}`}
              </p>
            </button>
            <button
              onClick={() => onGoToProject("")}
              disabled={upcomingDeadlines.length === 0}
              className={`rounded-[10px] border px-4 py-3 text-left transition-colors ${
                upcomingDeadlines.length === 0
                  ? "border-emerald-400/25 bg-emerald-400/5"
                  : overdueDeadlinesCount > 0
                    ? "border-red-400/25 bg-red-400/5 hover:border-red-400/45"
                    : "border-yellow-400/25 bg-yellow-400/5 hover:border-yellow-400/45"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Afate projektesh (3 ditë)</p>
              <p
                className={`mt-1 text-[14px] font-semibold ${
                  upcomingDeadlines.length === 0 ? "text-emerald-300" : overdueDeadlinesCount > 0 ? "text-red-300" : "text-yellow-300"
                }`}
              >
                {upcomingDeadlines.length === 0
                  ? "✅ Asnjë"
                  : `${overdueDeadlinesCount > 0 ? "🔴" : "⏳"} ${upcomingDeadlines.length}${overdueDeadlinesCount > 0 ? ` (${overdueDeadlinesCount} vonuar)` : ""}`}
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Shëndeti i sistemit */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Shëndeti i sistemit
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className={`rounded-[10px] border px-4 py-3 ${backupHealthy ? "border-emerald-400/25 bg-emerald-400/5" : "border-yellow-400/25 bg-yellow-400/5"}`}>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Backup javor</p>
            <p className={`mt-1 text-[14px] font-semibold ${backupHealthy ? "text-emerald-300" : "text-yellow-300"}`}>
              {lastBackup
                ? `${backupHealthy ? "✅" : "⚠️"} ${daysSinceBackup === 0 ? "sot" : `${daysSinceBackup} ditë më parë`}`
                : "⚠️ Asnjë backup ende"}
            </p>
          </div>
          <div
            className={`rounded-[10px] border px-4 py-3 ${avgResponseHours === null ? "border-[var(--a-border)]" : responseHealthy ? "border-emerald-400/25 bg-emerald-400/5" : "border-yellow-400/25 bg-yellow-400/5"}`}
            title="Koha mesatare deri sa admini hap kontaktin e ri për herë të parë, 30 ditët e fundit"
          >
            <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">SLA · Koha e parë përgjigjeje</p>
            <p className={`mt-1 text-[14px] font-semibold ${avgResponseHours === null ? "text-[var(--a-text)]" : responseHealthy ? "text-emerald-300" : "text-yellow-300"}`}>
              {avgResponseHours === null
                ? "— pa të dhëna ende"
                : `${responseHealthy ? "✅" : "⚠️"} ${avgResponseHours < 1 ? "< 1 orë" : avgResponseHours < 24 ? `${Math.round(avgResponseHours)} orë` : `${Math.round(avgResponseHours / 24)} ditë`} mesatarisht`}
            </p>
          </div>
          <div className="rounded-[10px] border border-[var(--a-border)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Automatizimi i fundit</p>
            <p className="mt-1 truncate text-[13px] font-medium text-[var(--a-text)]" title={autoActivity[0]?.label}>
              {autoActivity[0] ? autoActivity[0].label : "Asnjë veprim ende"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Marketing */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          KPI Marketing
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">
              Leads / muaj (6 muajt e fundit)
            </p>
            <div className="flex items-end gap-2.5" style={{ height: 84 }}>
              {leadsByMonth.map((m) => (
                <div key={m.key} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-[2px] bg-accent/70"
                    style={{ height: `${Math.max(4, (m.count / maxLeadsInMonth) * 56)}px` }}
                    title={`${m.count} leads`}
                  />
                  <span className="text-[10px] font-semibold text-[var(--a-text)]">{m.count}</span>
                  <span className="text-[9px] uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.35)]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-[1.7rem] font-bold text-accent">
                {quoteConversion.rate !== null ? `${quoteConversion.rate.toFixed(0)}%` : "—"}
              </p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
                Konvertimi ofertë→klient ({quoteConversion.won}/{quoteConversion.sent})
              </p>
            </div>
            <div>
              <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">
                {leadsByMonth[leadsByMonth.length - 1]?.count ?? 0}
              </p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Leads këtë muaj</p>
            </div>
          </div>
        </div>

        {topLeadSources.length > 0 && (
          <div className="mt-5 border-t border-[var(--a-border)] pt-4">
            <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">Burimet kryesore</p>
            <div className="flex flex-wrap gap-2">
              {topLeadSources.map(([src, count]) => (
                <span
                  key={src}
                  className="rounded-full border border-[var(--a-border)] bg-[var(--a-input)] px-2.5 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)]"
                  title={src}
                >
                  {src} · {count}
                </span>
              ))}
            </div>
          </div>
        )}
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
                    className="flex w-full items-center justify-between rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5 text-left transition-colors hover:border-accent/50"
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

      {/* Projects progress */}
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Projektet
        </p>
        {projectsSummary.total === 0 ? (
          <EmptyState text="Ende pa projekte." />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="font-display text-[1.7rem] font-bold text-accent">{projectsSummary.active}</p>
                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Projekte aktive</p>
              </div>
              <div>
                <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">{projectsSummary.total}</p>
                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Gjithsej</p>
              </div>
              <div>
                <p className="font-display text-[1.7rem] font-bold text-[var(--a-text)]">
                  {projectsSummary.avgPct !== null ? `${projectsSummary.avgPct}%` : "—"}
                </p>
                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Përfundimi mesatar i checklist-ave</p>
              </div>
            </div>
            {projectsSummary.byPhase.size > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(projectsSummary.byPhase.entries()).map(([phase, count]) => (
                  <span
                    key={phase}
                    className="rounded-full border border-accent/30 bg-accent/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent"
                  >
                    {PROJECT_PHASE_LABELS[phase as keyof typeof PROJECT_PHASE_LABELS] ?? phase} · {count}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Scheduled newsletter broadcasts */}
      {scheduledBroadcasts.length > 0 && (
        <div className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Broadcast-e të planifikuara ({scheduledBroadcasts.length})
          </p>
          <ul className="space-y-2">
            {scheduledBroadcasts.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-4 py-2.5"
              >
                <span className="text-[13px] text-[rgb(var(--a-text-rgb)/0.8)]">{b.subject}</span>
                <span className="text-[11px] font-semibold text-accent">
                  {formatDate(b.scheduled_for!)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
                    className="flex w-full items-center justify-between rounded-[10px] px-2 py-1.5 text-left transition-colors hover:bg-[rgb(var(--a-text-rgb)/0.05)]"
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
  const isEmpty = days.every(([, count]) => count === 0);

  return (
    <div className={CARD + " mt-4 p-5"}>
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
        Kontakte — 30 ditët e fundit
      </p>
      <div className="relative flex h-24 items-end gap-[3px]">
        {isEmpty && (
          <p className="absolute inset-0 flex items-center justify-center text-[12px] text-[rgb(var(--a-text-rgb)/0.3)]">
            Asnjë kontakt ende këtë periudhë.
          </p>
        )}
        {days.map(([date, count]) => (
          <div key={date} className="group relative flex-1">
            <div
              className="rounded-sm bg-gradient-to-t from-accent/40 to-accent/90 transition-colors group-hover:to-accent"
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
  trashedContacts,
  setTrashedContacts,
}: {
  contacts: Contact[];
  setContacts: (c: Contact[]) => void;
  jumpSearch?: { term: string; key: number } | null;
  onCreateQuote: (c: Contact) => void;
  trashedContacts: TrashedContact[];
  setTrashedContacts: (c: TrashedContact[]) => void;
}) {
  const [showTrash, setShowTrash] = useState(false);
  const [trashBusyId, setTrashBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Të gjitha");
  const [tagFilter, setTagFilter] = useState("Të gjitha");
  const [tagDraft, setTagDraft] = useState<Record<number, string>>({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<"all" | "none" | "overdue" | "upcoming">("all");
  const [savedFilters, setSavedFilters] = useState<SavedContactFilter[]>([]);
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
  const [confirm, renderConfirm] = useConfirm();
  const { showUndo, renderUndoToast } = useUndoToast();
  const debouncedSearch = useDebounced(search, 250);
  const [valueDraft, setValueDraft] = useState<Record<number, string>>({});
  const [replyOpenFor, setReplyOpenFor] = useState<number | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyResult, setReplyResult] = useState("");
  const [copiedPortalId, setCopiedPortalId] = useState<number | null>(null);

  const copyPortalLink = async (c: Contact) => {
    if (!c.portal_token) return;
    const url = `${window.location.origin}/klienti/${c.portal_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPortalId(c.id);
      setTimeout(() => setCopiedPortalId(null), 2500);
    } catch {
      prompt("Kopjoje lidhjen manualisht:", url);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const jumpToContact = (c: Contact) => {
    setViewMode("kanban");
    setSearch(c.email);
    setExpanded(c.id);
    markViewed(c);
  };

  useEffect(() => {
    if (jumpSearch) setSearch(jumpSearch.term);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSearch?.key]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTACT_FILTERS_KEY);
      if (raw) setSavedFilters(JSON.parse(raw));
    } catch {
      // injoro
    }
  }, []);

  const applySavedFilter = (f: SavedContactFilter) => {
    setSearch(f.search);
    setServiceFilter(f.serviceFilter);
    setTagFilter(f.tagFilter);
    setDateFrom(f.dateFrom);
    setDateTo(f.dateTo);
    setFollowUpFilter(f.followUpFilter);
  };

  const saveCurrentFilter = () => {
    const name = prompt("Emri i filtrit:");
    if (!name || !name.trim()) return;
    const next = [
      ...savedFilters.filter((f) => f.name !== name.trim()),
      { name: name.trim(), search, serviceFilter, tagFilter, dateFrom, dateTo, followUpFilter },
    ];
    setSavedFilters(next);
    localStorage.setItem(CONTACT_FILTERS_KEY, JSON.stringify(next));
  };

  const deleteSavedFilter = (name: string) => {
    const next = savedFilters.filter((f) => f.name !== name);
    setSavedFilters(next);
    localStorage.setItem(CONTACT_FILTERS_KEY, JSON.stringify(next));
  };

  const services = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.map((c) => c.service).filter(Boolean)))],
    [contacts]
  );

  const allTags = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.flatMap((c) => c.tags ?? []))).sort()],
    [contacts]
  );

  const duplicateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of contacts) {
      const key = c.email.trim().toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return contacts.filter((c) => {
      if (q) {
        const haystack = `${c.name} ${c.email} ${c.business_name ?? ""} ${c.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (serviceFilter !== "Të gjitha" && c.service !== serviceFilter) return false;
      if (tagFilter !== "Të gjitha" && !(c.tags ?? []).includes(tagFilter)) return false;
      if (dateFrom && new Date(c.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(c.created_at) > new Date(dateTo + "T23:59:59")) return false;
      if (followUpFilter === "none" && c.follow_up_date) return false;
      if (followUpFilter === "overdue" && !(c.follow_up_date && c.follow_up_date < new Date().toISOString().slice(0, 10))) return false;
      if (followUpFilter === "upcoming" && !(c.follow_up_date && c.follow_up_date >= new Date().toISOString().slice(0, 10))) return false;
      return true;
    });
  }, [contacts, debouncedSearch, serviceFilter, tagFilter, dateFrom, dateTo, followUpFilter]);

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
    if (!(await confirm({ title: "Fshi shënimin", message: "Të fshihet ky shënim?", danger: true, confirmText: "Fshi" }))) return;
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

  const deleteLegacyNote = async (c: Contact) => {
    if (!(await confirm({ title: "Fshi shënimin", message: "Të fshihet ky shënim i vjetër?", danger: true, confirmText: "Fshi" }))) return;
    updateContact(c.id, { notes: "" });
  };

  const markViewed = (c: Contact) => {
    if (c.viewed_at) return;
    const now = new Date().toISOString();
    setContacts(contacts.map((x) => (x.id === c.id ? { ...x, viewed_at: now } : x)));
    fetch(`/api/admin/contacts/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewed: true }),
    }).catch(() => {});
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
    if (!(await confirm({ title: "Fshi kontaktin", message: "Të fshihet ky kontakt? Mund ta rikthesh nga koshi më vonë.", danger: true, confirmText: "Fshi" }))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const removed = contacts.find((c) => c.id === id);
        setContacts(contacts.filter((c) => c.id !== id));
        if (removed) {
          setTrashedContacts([
            { id: removed.id, name: removed.name, email: removed.email, business_name: removed.business_name, service: removed.service, deleted_at: new Date().toISOString() },
            ...trashedContacts,
          ]);
        }
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
    if (!(await confirm({ title: "Fshi kontaktet", message: `Të fshihen ${selected.size} kontakte? Mund t'i rikthesh nga koshi më vonë.`, danger: true, confirmText: "Fshi" }))) return;
    const ids = Array.from(selected);
    const removed = contacts.filter((c) => ids.includes(c.id));
    const remaining = contacts.filter((c) => !ids.includes(c.id));
    setContacts(remaining);
    setSelected(new Set());
    showUndo(
      `${ids.length} kontakte u fshinë.`,
      () => setContacts([...removed, ...remaining]),
      async () => {
        setBulkBusy(true);
        try {
          await fetch("/api/admin/contacts/bulk", {
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

  const restoreContact = async (tc: TrashedContact) => {
    setTrashBusyId(tc.id);
    try {
      const res = await fetch(`/api/admin/contacts/${tc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      const data = await res.json();
      if (data.success && data.contact) {
        setTrashedContacts(trashedContacts.filter((c) => c.id !== tc.id));
        setContacts([data.contact, ...contacts]);
      }
    } finally {
      setTrashBusyId(null);
    }
  };

  const permanentlyDeleteContact = async (tc: TrashedContact) => {
    if (!(await confirm({ title: "Fshi përgjithmonë", message: `Të fshihet "${tc.name}" përgjithmonë? Ky veprim NUK kthehet mbrapsht.`, danger: true, confirmText: "Fshi përgjithmonë" }))) return;
    setTrashBusyId(tc.id);
    try {
      const res = await fetch(`/api/admin/contacts/${tc.id}?permanent=1`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTrashedContacts(trashedContacts.filter((c) => c.id !== tc.id));
      }
    } finally {
      setTrashBusyId(null);
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
          className="font-ui min-w-[200px] flex-1 rounded-[10px] border border-[var(--a-border)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {allTags.map((t) => (
            <option key={t} value={t}>{t === "Të gjitha" ? "Të gjitha etiketat" : t}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={followUpFilter}
          onChange={(e) => setFollowUpFilter(e.target.value as typeof followUpFilter)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          <option value="all">Çdo ndjekje</option>
          <option value="none">Pa datë ndjekjeje</option>
          <option value="overdue">Ndjekje e vonuar</option>
          <option value="upcoming">Ndjekje e ardhshme</option>
        </select>
        <button
          onClick={() => downloadContactsCSV(filtered)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ⬇ Export CSV
        </button>
        <div className="flex rounded-[10px] border border-[var(--a-border)]">
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
        <button
          onClick={() => setShowTrash((v) => !v)}
          className={`font-ui rounded-[10px] border px-4 py-2.5 text-[12px] font-semibold transition-colors ${
            showTrash ? "border-accent/50 bg-accent/10 text-accent" : "border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
          }`}
        >
          🗑 Koshi {trashedContacts.length > 0 ? `(${trashedContacts.length})` : ""}
        </button>
      </div>

      {showTrash && (
        <div className="mb-5 rounded-[10px] border border-[var(--a-border)] p-4">
          <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Kontakte të fshira — rikthej ose fshi përgjithmonë
          </p>
          {trashedContacts.length === 0 ? (
            <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.4)]">Koshi është bosh.</p>
          ) : (
            <div className="space-y-2">
              {trashedContacts.map((tc) => (
                <div key={tc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[var(--a-border)] px-3 py-2.5">
                  <div>
                    <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">{tc.name} <span className="text-[rgb(var(--a-text-rgb)/0.4)]">— {tc.service}</span></p>
                    <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.4)]">{tc.email} · fshirë më {formatDate(tc.deleted_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreContact(tc)}
                      disabled={trashBusyId === tc.id}
                      className="font-ui rounded-[10px] border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                    >
                      ↩ Rikthe
                    </button>
                    <button
                      onClick={() => permanentlyDeleteContact(tc)}
                      disabled={trashBusyId === tc.id}
                      className="font-ui rounded-[10px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                    >
                      Fshi përgjithmonë
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Filtra të ruajtur:</span>
        {savedFilters.length === 0 && (
          <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.3)]">asnjë ende</span>
        )}
        {savedFilters.map((f) => (
          <span key={f.name} className="flex items-center gap-1 rounded-full border border-[var(--a-border)] pl-3 pr-1 py-1 text-[11px]">
            <button onClick={() => applySavedFilter(f)} className="font-ui text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-accent">
              {f.name}
            </button>
            <button
              onClick={() => deleteSavedFilter(f.name)}
              className="font-ui px-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.3)] transition-colors hover:text-red-400"
              aria-label="Fshi filtrin"
            >
              ×
            </button>
          </span>
        ))}
        <button
          onClick={saveCurrentFilter}
          className="font-ui rounded-full border border-accent/40 px-3 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ＋ Ruaj filtrin aktual
        </button>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{selected.size} të zgjedhur</span>
          <select
            defaultValue=""
            disabled={bulkBusy}
            onChange={(e) => {
              bulkUpdateStatus(e.target.value);
              e.target.value = "";
            }}
            className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
          >
            <option value="" disabled>Ndrysho statusin...</option>
            <option value="new">I ri</option>
            <option value="in-progress">Në proces</option>
            <option value="done">Mbyllur</option>
          </select>
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
                    const score = leadScore(c, duplicateCounts.get(c.email.trim().toLowerCase()) ?? 1);
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
                              onClick={() => {
                                const next = expanded === c.id ? null : c.id;
                                setExpanded(next);
                                if (next !== null) markViewed(c);
                              }}
                              className="flex flex-1 items-center justify-between gap-4 pr-6 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="font-display font-semibold text-[var(--a-text)]">{c.name}</span>
                                  {c.viewed_at ? (
                                    <span className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.4)]">
                                      ✓ E lexuar
                                    </span>
                                  ) : (
                                    <span className="animate-pulse rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
                                      🆕 I ri
                                    </span>
                                  )}
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
                                  {(duplicateCounts.get(c.email.trim().toLowerCase()) ?? 1) > 1 && (
                                    <span
                                      title="Ky email ka shkruar më parë"
                                      className="rounded-full border border-blue-400/30 bg-blue-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300"
                                    >
                                      🔁 {duplicateCounts.get(c.email.trim().toLowerCase())}×
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
                                <button
                                  onClick={() => copyPortalLink(c)}
                                  className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                                >
                                  {copiedPortalId === c.id ? "U kopjua ✓" : "🔗 Portal klienti"}
                                </button>
                              </div>

                              {/* Reply composer */}
                              {replyOpenFor === c.id && (
                                <div className="mt-3 rounded-[10px] border border-accent/25 bg-accent/[0.04] p-4">
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
                                    className="font-ui mt-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <textarea
                                    rows={5}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Mesazhi..."
                                    className="font-ui mt-2 w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] leading-relaxed text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <div className="mt-2 flex items-center gap-3">
                                    <button
                                      onClick={() => sendReply(c)}
                                      disabled={replySending || !replySubject.trim() || !replyMessage.trim()}
                                      className="font-ui rounded-[10px] bg-accent px-4 py-2 text-[11px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
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
                                    className="font-ui w-28 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-2.5 py-1 text-[11px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addTag(c)}
                                    disabled={savingId === c.id || !(tagDraft[c.id] ?? "").trim()}
                                    className="font-ui rounded-[10px] border border-accent/40 px-2.5 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
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
                                  className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
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
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Ndiq më</label>
                                  <input
                                    type="date"
                                    value={followUpDraft[c.id] ?? c.follow_up_date ?? ""}
                                    onChange={(e) => setFollowUpDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Shënime private</label>

                                {c.notes ? (
                                  <div className="mb-2 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
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
                                  <Skeleton className="h-8 w-full" />
                                ) : (notesList[c.id] ?? []).length > 0 ? (
                                  <ul className="space-y-2">
                                    {(notesList[c.id] ?? []).map((n) => (
                                      <li key={n.id} className="rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
                                        {editingNoteId === n.id ? (
                                          <>
                                            <textarea
                                              rows={2}
                                              value={editNoteDraft[n.id] ?? n.text}
                                              onChange={(e) => setEditNoteDraft((d) => ({ ...d, [n.id]: e.target.value }))}
                                              className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
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
                                    className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addNote(c)}
                                    disabled={addingNoteFor === c.id || !(newNoteDraft[c.id] ?? "").trim()}
                                    className="font-ui mt-2 rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                  >
                                    {addingNoteFor === c.id ? "Duke ruajtur…" : "Shto shënim"}
                                  </button>
                                </div>
                              </div>

                              {/* Bashkëngjitje */}
                              <div className="mt-4">
                                <AttachmentsPanel ownerType="contact" ownerId={c.id} />
                              </div>

                              {/* Veprime */}
                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={() => saveDetails(c)}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                >
                                  {savingId === c.id ? "Duke ruajtur…" : "Ruaj"}
                                </button>
                                <button
                                  onClick={() => removeContact(c.id)}
                                  disabled={deletingId === c.id}
                                  className="font-ui rounded-[10px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
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
                                  <Skeleton className="h-8 w-full" />
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
      {renderConfirm()}
      {renderUndoToast()}
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
          className="rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ← Para
        </button>
        <p className="font-display text-[1.1rem] font-semibold capitalize text-[var(--a-text)]">{label}</p>
        <button
          onClick={() => setMonthOffset((m) => m + 1)}
          className="rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
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
              className={`min-h-[80px] rounded-[10px] border border-[var(--a-border)] p-1.5 ${
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
                      className={`block w-full truncate rounded-[10px] px-1.5 py-0.5 text-left text-[10px] transition-colors ${
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

