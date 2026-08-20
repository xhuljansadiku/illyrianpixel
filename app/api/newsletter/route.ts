import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, welcomeEmailHtml } from "@/lib/newsletterEmail";
import { getSiteSettings } from "@/lib/siteSettings";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BRAND = NEWSLETTER_BRAND;

const RATE_LIMIT = 5;
const WINDOW_SECONDS = 60 * 60; // 1 orë

// Pa këtë, kushdo mund të abonojë çdo adresë email pafundësisht — spam/ngacmim i
// palëve të treta me email-in "mirësevini" dhe shpenzim i kuotës Resend.
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_SECONDS * 1000);

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("scope", "newsletter")
    .eq("ip", ip)
    .gte("created_at", windowStart.toISOString());

  if (error) return true; // fail open — nuk bllokojmë nëse DB ka problem

  if ((count ?? 0) >= RATE_LIMIT) return false;

  await supabase.from("rate_limits").insert({ scope: "newsletter", ip, created_at: now.toISOString() });
  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!(await checkRateLimit(ip))) {
      return NextResponse.json(
        { success: false, error: "Shumë kërkesa. Provoni sërish pas 1 ore." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: "Email i pavlefshëm." }, { status: 400 });
    }

    const { newsletter_discount_code: DISCOUNT_CODE, whatsapp_number } = await getSiteSettings();
    const whatsappUrl = `https://wa.me/${whatsapp_number}`;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Already subscribed — return success but don't send email again
      return NextResponse.json({ success: true, code: DISCOUNT_CODE });
    }

    // New subscriber — save to Supabase
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, subscribed_at: new Date().toISOString() });

    if (dbError) {
      console.error("Newsletter DB error:", JSON.stringify(dbError));
      return NextResponse.json(
        { success: false, error: `DB: ${dbError.message}` },
        { status: 500 }
      );
    }

    await logActivity("newsletter", "create", `Abonim i ri në newsletter: ${email}`);

    // Send welcome email only for new subscribers
    await resend.emails.send({
      from: BRAND.from,
      to: email,
      subject: `Kodi juaj 10% zbritje — ${BRAND.name}`,
      html: welcomeEmailHtml(DISCOUNT_CODE, whatsappUrl),
    });

    return NextResponse.json({ success: true, code: DISCOUNT_CODE });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ success: false, error: "Gabim i brendshëm. Provoni sërish." }, { status: 500 });
  }
}
