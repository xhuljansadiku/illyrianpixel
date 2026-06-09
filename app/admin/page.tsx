import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "@/components/AdminDashboard";
import { blogPosts as staticBlogPosts } from "@/lib/blogPosts";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const [contactsRes, subscribersRes, blogRes] = await Promise.all([
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
  ]);

  const contacts = contactsRes.data ?? [];
  const subscribers = subscribersRes.data ?? [];
  const blogPosts = blogRes.data ?? [];

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const stats = {
    totalContacts: contacts.length,
    totalSubscribers: subscribers.length,
    contactsThisWeek: contacts.filter((c) => new Date(c.created_at) >= oneWeekAgo).length,
    subscribersThisWeek: subscribers.filter((s) => new Date(s.subscribed_at) >= oneWeekAgo).length,
    discountUsed: contacts.filter((c) => !!c.discount_code).length,
  };

  return (
    <AdminDashboard
      contacts={contacts}
      subscribers={subscribers}
      blogPosts={blogPosts}
      staticPosts={staticBlogPosts}
      stats={stats}
    />
  );
}
