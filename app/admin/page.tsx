import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "@/components/AdminDashboard";
import { blogPosts as staticBlogPosts } from "@/lib/blogPosts";
import { getSiteSettings } from "@/lib/siteSettings";
import { serviceCategories } from "@/lib/serviceCategories";
import type { PricingOverrides } from "@/lib/pricingOverrides";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Supabase kthen maksimumi 1000 rreshta për kërkesë — për tabelat që statistikat
// i lexojnë të plota (log-e, detyra, open/click) lexo faqe pas faqeje.
async function fetchAllRows<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null }>
): Promise<T[]> {
  const PAGE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data } = await build(from, from + PAGE - 1);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

// Numërim direkt në DB (pa ngarkuar rreshtat) — statistikat s'priten më te 300 kontaktet e ngarkuara
function countOf(table: string) {
  return supabase.from(table).select("id", { count: "exact", head: true });
}

export default async function AdminPage() {
  // Ora e serverit para leximit — pika e nisjes për polling-un e kontakteve të reja
  const renderedAt = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const oneWeekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString();

  const [
    totalContactsRes,
    contactsWeekRes,
    doneContactsRes,
    discountContactsRes,
    activeSubscribersRes,
    subscribersWeekRes,
  ] = await Promise.all([
    countOf("contacts").is("deleted_at", null),
    countOf("contacts").is("deleted_at", null).gte("created_at", oneWeekAgoIso),
    countOf("contacts").is("deleted_at", null).eq("status", "done"),
    countOf("contacts").is("deleted_at", null).not("discount_code", "is", null),
    // Vetëm abonentët aktivë — si te Analitika (më parë "Përmbledhje" numëronte edhe të çregjistruarit)
    countOf("newsletter_subscribers").eq("unsubscribed", false),
    countOf("newsletter_subscribers").eq("unsubscribed", false).gte("subscribed_at", oneWeekAgoIso),
  ]);

  const [
    contactsRes,
    subscribersRes,
    blogRes,
    contactLogsRes,
    lostReasonsRes,
    adminLoginsRes,
    siteSettings,
    quotesRes,
    testimonialsRes,
    portfolioRes,
    pricingRes,
    broadcastsRes,
    pageViewsRes,
    recurringRes,
    projectsRes,
    projectTasksRes,
    faqsRes,
    trashedContactsRes,
    trashedQuotesRes,
    autoActivityRes,
  ] = await Promise.all([
    supabase
      .from("contacts")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .limit(300),
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false }),
    // Vetëm fitoret — e vetmja gjë që duhet për "ditë mesatare deri në mbyllje".
    // "Mbyllur" = etiketa e vjetër (para 2026-11-02) e statusit "done", tani "Fituar".
    fetchAllRows<{ contact_id: string; created_at: string }>((from, to) =>
      supabase
        .from("contact_logs")
        .select("contact_id, created_at")
        .eq("action", "status")
        .in("detail", ["Mbyllur", "Fituar", "Fituar (automatikisht)"])
        .order("created_at", { ascending: true })
        .range(from, to)
    ),
    // Pse humbën kërkesat (90 ditët e fundit) — për "Rruga e klientit" te "Sot"
    supabase
      .from("contact_logs")
      .select("detail")
      .eq("action", "lost_reason")
      .gte("created_at", new Date(Date.now() - 90 * 86400000).toISOString())
      .limit(1000),
    supabase
      .from("admin_logins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    getSiteSettings(),
    supabase
      .from("quotes")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("testimonials")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("portfolio_items")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
    supabase.from("pricing_overrides").select("*"),
    supabase
      .from("newsletter_broadcasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("page_views")
      .select("day, count")
      .gte("day", thirtyDaysAgo),
    supabase
      .from("recurring_invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    fetchAllRows<{ project_id: number } & Record<string, unknown>>((from, to) =>
      supabase
        .from("project_tasks")
        .select("*")
        .order("sort", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to)
    ),
    supabase
      .from("faqs")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("contacts")
      .select("id, name, email, business_name, service, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(100),
    supabase
      .from("quotes")
      .select("id, number, kind, client_name, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(100),
    supabase
      .from("admin_activity")
      .select("entity, action, label, created_at")
      .eq("entity", "auto")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const contacts = contactsRes.data ?? [];
  const subscribers = subscribersRes.data ?? [];
  const blogPosts = blogRes.data ?? [];
  const contactLogs = contactLogsRes;

  const lostReasonCounts = new Map<string, number>();
  for (const r of lostReasonsRes.data ?? []) {
    if (r.detail) lostReasonCounts.set(r.detail, (lostReasonCounts.get(r.detail) ?? 0) + 1);
  }
  const lostReasons = Array.from(lostReasonCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }));
  const adminLogins = adminLoginsRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const testimonials = testimonialsRes.data ?? [];
  const portfolioItems = portfolioRes.data ?? [];
  const recurring = recurringRes.data ?? [];
  const faqs = faqsRes.data ?? [];

  const trashedContacts = trashedContactsRes.data ?? [];
  const trashedQuotes = trashedQuotesRes.data ?? [];
  const autoActivity = autoActivityRes.data ?? [];

  const projectTasks = projectTasksRes;
  const projects = (projectsRes.data ?? []).map((p) => ({
    ...p,
    tasks: projectTasks.filter((t) => t.project_id === p.id),
  }));

  const pricingOverrides: PricingOverrides = {};
  for (const row of pricingRes.data ?? []) {
    pricingOverrides[row.key] = { price: row.price, price_note: row.price_note };
  }

  const pricingCatalog = serviceCategories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    packages: cat.packages.map((p) => ({ name: p.name, price: p.price, priceNote: p.priceNote })),
  }));

  // Statistika unike open/click për broadcast-et e fundit
  const broadcastRows = broadcastsRes.data ?? [];
  let broadcasts: { id: string; subject: string; created_at: string; sent_count: number; opens: number; clicks: number }[] = [];
  if (broadcastRows.length > 0) {
    const ids = broadcastRows.map((b) => b.id);
    const events = await fetchAllRows<{ broadcast_id: string; email: string; type: string }>((from, to) =>
      supabase
        .from("newsletter_events")
        .select("broadcast_id, email, type")
        .in("broadcast_id", ids)
        .order("id", { ascending: true })
        .range(from, to)
    );
    const opensMap = new Map<string, Set<string>>();
    const clicksMap = new Map<string, Set<string>>();
    for (const e of events) {
      const map = e.type === "open" ? opensMap : clicksMap;
      if (!map.has(e.broadcast_id)) map.set(e.broadcast_id, new Set());
      map.get(e.broadcast_id)!.add(e.email);
    }
    broadcasts = broadcastRows.map((b) => ({
      id: b.id,
      subject: b.subject,
      created_at: b.created_at,
      sent_count: b.sent_count,
      opens: opensMap.get(b.id)?.size ?? 0,
      clicks: clicksMap.get(b.id)?.size ?? 0,
    }));
  }

  const visitors30 = (pageViewsRes.data ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0);

  // Mbyllja e parë për çdo kontakt (log-et vijnë sipas datës, në rritje)
  const firstClose = new Map<string, string>();
  for (const l of contactLogs) {
    const key = String(l.contact_id);
    if (!firstClose.has(key)) firstClose.set(key, l.created_at);
  }

  const closeDurations: number[] = [];
  for (const c of contacts) {
    if (c.status !== "done") continue;
    const closedAt = firstClose.get(String(c.id));
    if (closedAt) {
      const days = (new Date(closedAt).getTime() - new Date(c.created_at).getTime()) / 86400000;
      if (days >= 0) closeDurations.push(days);
    }
  }
  const avgDaysToClose = closeDurations.length > 0
    ? closeDurations.reduce((a, b) => a + b, 0) / closeDurations.length
    : null;

  const serviceCounts = new Map<string, number>();
  for (const c of contacts) {
    if (!c.service) continue;
    serviceCounts.set(c.service, (serviceCounts.get(c.service) ?? 0) + 1);
  }
  const topServices = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }));

  const totalContacts = totalContactsRes.count ?? 0;
  const stats = {
    totalContacts,
    totalSubscribers: activeSubscribersRes.count ?? 0,
    contactsThisWeek: contactsWeekRes.count ?? 0,
    subscribersThisWeek: subscribersWeekRes.count ?? 0,
    discountUsed: discountContactsRes.count ?? 0,
    conversionRate: totalContacts > 0 ? ((doneContactsRes.count ?? 0) / totalContacts) * 100 : 0,
    avgDaysToClose,
    topServices,
  };

  return (
    <AdminDashboard
      contacts={contacts}
      subscribers={subscribers}
      blogPosts={blogPosts}
      staticPosts={staticBlogPosts}
      stats={stats}
      adminLogins={adminLogins}
      siteSettings={siteSettings}
      quotes={quotes}
      testimonials={testimonials}
      portfolioItems={portfolioItems}
      pricingCatalog={pricingCatalog}
      pricingOverrides={pricingOverrides}
      broadcasts={broadcasts}
      visitors30={visitors30}
      recurring={recurring}
      projects={projects}
      faqs={faqs}
      trashedContacts={trashedContacts}
      trashedQuotes={trashedQuotes}
      autoActivity={autoActivity}
      renderedAt={renderedAt}
      lostReasons={lostReasons}
    />
  );
}
