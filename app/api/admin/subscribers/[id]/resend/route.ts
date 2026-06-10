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

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !subscriber) {
    return NextResponse.json({ success: false, error: "Subscriber nuk u gjet." }, { status: 404 });
  }

  const { newsletter_discount_code: discountCode, whatsapp_number } = await getSiteSettings();

  await resend.emails.send({
    from: NEWSLETTER_BRAND.from,
    to: subscriber.email,
    subject: `Kodi juaj 10% zbritje — ${NEWSLETTER_BRAND.name}`,
    html: welcomeEmailHtml(discountCode, `https://wa.me/${whatsapp_number}`),
  });

  return NextResponse.json({ success: true });
}
