import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "@/components/AdminDashboard";
import { blogPosts as staticBlogPosts } from "@/lib/blogPosts";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const [contactsRes, subscribersRes, blogRes, contactLogsRes, adminLoginsRes, siteSettings] = await Promise.all([
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
  ]);

  const contacts = contactsRes.data ?? [];
  const subscribers = subscribersRes.data ?? [];
  const blogPosts = blogRes.data ?? [];
  const contactLogs = contactLogsRes.data ?? [];
  const adminLogins = adminLoginsRes.data ?? [];

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
    />
  );
}
