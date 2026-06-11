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

export default async function AdminPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [
    contactsRes,
    subscribersRes,
    blogRes,
    contactLogsRes,
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
  ] = await Promise.all([
    supabase
      .from("contacts")
      .select("*")
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
    supabase
      .from("contact_logs")
      .select("*")
      .eq("action", "status")
      .order("created_at", { ascending: true }),
    supabase
      .from("admin_logins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    getSiteSettings(),
    supabase
      .from("quotes")
      .select("*")
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
    supabase
      .from("project_tasks")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("faqs")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  const contacts = contactsRes.data ?? [];
  const subscribers = subscribersRes.data ?? [];
  const blogPosts = blogRes.data ?? [];
  const contactLogs = contactLogsRes.data ?? [];
  const adminLogins = adminLoginsRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const testimonials = testimonialsRes.data ?? [];
  const portfolioItems = portfolioRes.data ?? [];
  const recurring = recurringRes.data ?? [];
  const faqs = faqsRes.data ?? [];

  const projectTasks = projectTasksRes.data ?? [];
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
    const { data: events } = await supabase
      .from("newsletter_events")
      .select("broadcast_id, email, type")
      .in("broadcast_id", ids);
    const opensMap = new Map<string, Set<string>>();
    const clicksMap = new Map<string, Set<string>>();
    for (const e of events ?? []) {
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

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const doneCount = contacts.filter((c) => c.status === "done").length;

  const closeDurations: number[] = [];
  for (const c of contacts) {
    if (c.status !== "done") continue;
    const closedLog = contactLogs.find(
      (l) => String(l.contact_id) === String(c.id) && l.detail === "Mbyllur"
    );
    if (closedLog) {
      const days = (new Date(closedLog.created_at).getTime() - new Date(c.created_at).getTime()) / 86400000;
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

  const stats = {
    totalContacts: contacts.length,
    totalSubscribers: subscribers.length,
    contactsThisWeek: contacts.filter((c) => new Date(c.created_at) >= oneWeekAgo).length,
    subscribersThisWeek: subscribers.filter((s) => new Date(s.subscribed_at) >= oneWeekAgo).length,
    discountUsed: contacts.filter((c) => !!c.discount_code).length,
    conversionRate: contacts.length > 0 ? (doneCount / contacts.length) * 100 : 0,
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
    />
  );
}
