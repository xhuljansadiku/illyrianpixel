import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pa këtë, Next.js e statikon këtë route (asnjë req/params i përdorur) dhe kthen
// përgjithmonë "foton" e parë të bazës së të dhënave në vend të backup-it aktual.
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TABLES = [
  "contacts",
  "contact_notes",
  "contact_logs",
  "quotes",
  "recurring_invoices",
  "projects",
  "project_tasks",
  "blog_posts",
  "faqs",
  "testimonials",
  "portfolio_items",
  "newsletter_subscribers",
  "newsletter_broadcasts",
  "pricing_overrides",
] as const;

export async function GET() {
  const data: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
  };

  for (const table of TABLES) {
    const { data: rows, error } = await supabase.from(table).select("*");
    if (error) {
      return NextResponse.json({ success: false, error: `${table}: ${error.message}` }, { status: 500 });
    }
    data[table] = rows;
  }

  const filename = `illyrianpixel-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
