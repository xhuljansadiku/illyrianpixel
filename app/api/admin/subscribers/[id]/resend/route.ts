import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, NEWSLETTER_DISCOUNT_CODE, welcomeEmailHtml } from "@/lib/newsletterEmail";

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

  await resend.emails.send({
    from: NEWSLETTER_BRAND.from,
    to: subscriber.email,
    subject: `Kodi juaj 10% zbritje — ${NEWSLETTER_BRAND.name}`,
    html: welcomeEmailHtml(NEWSLETTER_DISCOUNT_CODE),
  });

  return NextResponse.json({ success: true });
}
