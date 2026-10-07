import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readSignedEmail } from "@/lib/newsletterTokens";
import { newsletterStatusPageHtml } from "@/lib/newsletterEmail";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function unsubscribe(req: Request): Promise<boolean> {
  const email = readSignedEmail(new URL(req.url), "unsubscribe");
  if (!email) return false;

  const { data } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed: true })
    .eq("email", email)
    .eq("unsubscribed", false)
    .select("email");

  if (data && data.length > 0) {
    await logActivity("newsletter", "update", `U çregjistrua nga newsletter: ${email}`);
  }
  return true;
}

function page(ok: boolean) {
  return new NextResponse(
    ok
      ? newsletterStatusPageHtml("U çregjistruat", "Nuk do të merrni më email-e nga newsletter-i i Illyrian Pixel.")
      : newsletterStatusPageHtml("Lidhje e pavlefshme", "Kjo lidhje çregjistrimi nuk është e vlefshme. Na shkruani te info@illyrianpixel.com."),
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// Klikim nga linku në fund të email-it
export async function GET(req: Request) {
  return page(await unsubscribe(req));
}

// One-click (RFC 8058) — klienti i email-it bën POST direkt, pa hapur faqen
export async function POST(req: Request) {
  const ok = await unsubscribe(req);
  return NextResponse.json({ success: ok }, { status: ok ? 200 : 400 });
}
