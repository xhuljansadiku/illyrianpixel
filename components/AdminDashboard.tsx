"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import type { QuoteRecord, RecurringInvoice } from "@/lib/quotes";
import { quoteTotals, formatMoney } from "@/lib/quotes";
import { PROJECT_PHASE_LABELS, type ProjectRecord } from "@/lib/projects";
import type { TestimonialRow, PortfolioRow, FaqRow } from "@/lib/publicContent";
import type { PricingOverrides } from "@/lib/pricingOverrides";
import SettingsTab from "@/components/admin/SettingsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import BlogTab from "@/components/admin/BlogTab";
import SubscribersTab from "@/components/admin/SubscribersTab";
import ContactsTab from "@/components/admin/ContactsTab";
import { CARD, EmptyState, formatDate, formatDay, isOverdue } from "@/components/admin/ui";
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

// Statike (jo toLocaleDateString) qëllimisht — Node.js në server shpesh s'ka
// të dhëna të plota ICU për "sq-AL" dhe prodhon tekst tjetër nga browser-i,
// duke shkaktuar hydration mismatch. Kjo garanton identitet server/klient.
const SHORT_MONTH_LABELS = ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj"];

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

