import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, broadcastEmailHtml } from "@/lib/newsletterEmail";
import { getSiteSettings } from "@/lib/siteSettings";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const BATCH_SIZE = 100;

export async function POST(req: Request) {
  const body = await req.json();
  const subject = String(body.subject ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 10000);

  if (!subject || !message) {
    return NextResponse.json({ success: false, error: "Subjekti dhe mesazhi janë të detyrueshëm." }, { status: 400 });
  }

  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("unsubscribed", false);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const recipients = (subscribers ?? []).map((s) => s.email);
  if (recipients.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë subscriber aktiv." }, { status: 400 });
  }

  const { whatsapp_number } = await getSiteSettings();
  const whatsappUrl = `https://wa.me/${whatsapp_number}`;

  // Regjistro broadcast-in që open/click të lidhen me të
  const { data: broadcast } = await supabase
    .from("newsletter_broadcasts")
    .insert({ subject, message, sent_count: recipients.length })
    .select("id")
    .single();

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    await resend.batch.send(
      chunk.map((email) => ({
        from: NEWSLETTER_BRAND.from,
        to: email,
        subject,
        html: broadcastEmailHtml(
          subject,
          message,
          whatsappUrl,
          broadcast ? { broadcastId: broadcast.id, email } : undefined
        ),
      }))
    );
  }

  return NextResponse.json({ success: true, sent: recipients.length });
}
