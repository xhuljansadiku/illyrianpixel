import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, welcomeEmailHtml } from "@/lib/newsletterEmail";
import { getSiteSettings } from "@/lib/siteSettings";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BRAND = NEWSLETTER_BRAND;

export async function POST(req: Request) {
  try {
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
