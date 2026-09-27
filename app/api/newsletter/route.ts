import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, welcomeEmailHtml } from "@/lib/newsletterEmail";
import { getSiteSettings } from "@/lib/siteSettings";
import { logActivity } from "@/lib/activityLog";
import { unsubscribeHeaders } from "@/lib/newsletterTokens";

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

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (!(await checkRateLimit(supabase, "newsletter", ip, RATE_LIMIT, WINDOW_SECONDS))) {
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
      .select("email, unsubscribed, confirmed_at")
      .eq("email", email)
      .maybeSingle();

    // Aktiv dhe i konfirmuar — s'ka nevojë për email tjetër. Përndryshe (i çregjistruar
    // ose ende pa konfirmuar) ridërgo email-in me butonin e konfirmimit; abonimi
    // riaktivizohet vetëm kur klikon, jo thjesht nga kjo kërkesë.
    if (existing && !existing.unsubscribed && existing.confirmed_at) {
      return NextResponse.json({ success: true, code: DISCOUNT_CODE });
    }

    if (!existing) {
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, subscribed_at: new Date().toISOString() });

      if (dbError) {
        console.error("Newsletter DB error:", JSON.stringify(dbError));
        return NextResponse.json(
          { success: false, error: "Gabim i brendshëm. Provoni sërish." },
          { status: 500 }
        );
      }

      await logActivity("newsletter", "create", `Abonim i ri në newsletter (pa konfirmuar): ${email}`);
    }

    // Email-i me kodin + butonin e konfirmimit (i ri, ose ende pa konfirmuar)
    await resend.emails.send({
      from: BRAND.from,
      to: email,
      subject: `Kodi juaj 10% zbritje — ${BRAND.name}`,
      html: welcomeEmailHtml(DISCOUNT_CODE, whatsappUrl, email),
      headers: unsubscribeHeaders(email),
    });

    return NextResponse.json({ success: true, code: DISCOUNT_CODE });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ success: false, error: "Gabim i brendshëm. Provoni sërish." }, { status: 500 });
  }
}
