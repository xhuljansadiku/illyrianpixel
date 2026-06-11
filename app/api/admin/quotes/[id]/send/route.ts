import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { quoteEmailHtml } from "@/lib/adminEmails";
import { QUOTE_KIND_LABELS, type QuoteRecord } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !quote) {
    return NextResponse.json({ success: false, error: "Oferta nuk u gjet." }, { status: 404 });
  }
  if (!quote.client_email) {
    return NextResponse.json({ success: false, error: "Ky klient nuk ka email." }, { status: 400 });
  }

  const record = quote as QuoteRecord;

  try {
    await resend.emails.send({
      from: NEWSLETTER_BRAND.from,
      to: quote.client_email,
      replyTo: "info@illyrianpixel.com",
      subject: `${QUOTE_KIND_LABELS[record.kind]} ${record.number} — Illyrian Pixel`,
      html: quoteEmailHtml(record),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Dërgimi i email-it dështoi." }, { status: 500 });
  }

  // draft → sent (statuset e tjera nuk preken)
  if (record.status === "draft") {
    await supabase
      .from("quotes")
      .update({ status: "sent", updated_at: new Date().toISOString() })
      .eq("id", params.id);
  }

  await logActivity("quote", "send", `${record.number} iu dërgua me email ${quote.client_email}`);

  return NextResponse.json({ success: true, status: record.status === "draft" ? "sent" : record.status });
}
