import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pa këtë, Next.js e statikon këtë route (asnjë req/params i përdorur) dhe kthen
// përgjithmonë "foton" e parë të bazës së të dhënave në vend të backup-it aktual.
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Gjithçka që nuk rikrijohet nga kodi. Lihen jashtë qëllimisht: site_settings (mban
// sekretin e 2FA), admin_logins dhe rate_limits (vetëm log-e sigurie/teknike).
const TABLES = [
  "contacts",
  "contact_notes",
  "contact_logs",
  "quotes",
  "recurring_invoices",
  "clients",
  "expenses",
  "projects",
  "project_tasks",
  "project_feedback",
  "attachments",
  "blog_posts",
  "faqs",
  "testimonials",
  "portfolio_items",
  "newsletter_subscribers",
  "newsletter_broadcasts",
  "newsletter_events",
  "pricing_overrides",
  "email_templates",
  "admin_notes",
  "admin_todos",
  "admin_activity",
  "assistant_messages",
] as const;

// Tabelat pa kolonë "id" — renditen sipas çelësit të tyre primar
const ORDER_KEY: Partial<Record<(typeof TABLES)[number], string>> = {
  pricing_overrides: "key",
  email_templates: "key",
};

// Supabase kthen maksimumi 1000 rreshta për kërkesë — pa faqosje, backup-i
// do pritej në heshtje sapo një tabelë të kalonte këtë numër.
const PAGE_SIZE = 1000;

async function fetchAll(table: (typeof TABLES)[number]) {
  const rows: unknown[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(ORDER_KEY[table] ?? "id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

export async function GET() {
  const data: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
  };

  try {
    for (const table of TABLES) {
      data[table] = await fetchAll(table);
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }

  const filename = `illyrianpixel-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
