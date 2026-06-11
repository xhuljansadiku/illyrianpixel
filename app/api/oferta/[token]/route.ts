import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { adminQuoteResponseEmailHtml } from "@/lib/adminEmails";
import { sendTelegramMessage, escapeTelegramHtml } from "@/lib/telegram";
import { quoteTotals, formatMoney, type QuoteRecord } from "@/lib/quotes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Përgjigja publike e klientit ndaj një oferte (prano / refuzo).
export async function POST(req: Request, { params }: { params: { token: string } }) {
  const token = params.token;
  if (!token || token.length < 16 || token.length > 64) {
    return NextResponse.json({ success: false, error: "Lidhje e pavlefshme." }, { status: 400 });
  }

  let body: { action?: unknown; note?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Kërkesë e pavlefshme." }, { status: 400 });
  }

  const action = body.action === "accept" ? "accept" : body.action === "decline" ? "decline" : null;
  if (!action) {
    return NextResponse.json({ success: false, error: "Veprim i panjohur." }, { status: 400 });
  }
  const note = String(body.note ?? "").trim().slice(0, 1000) || null;

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("public_token", token)
    .single();

  if (error || !quote) {
    return NextResponse.json({ success: false, error: "Oferta nuk u gjet." }, { status: 404 });
  }
  if (quote.kind !== "quote") {
    return NextResponse.json({ success: false, error: "Vetëm ofertat mund të pranohen online." }, { status: 400 });
  }
  if (quote.status !== "draft" && quote.status !== "sent") {
    return NextResponse.json({ success: false, error: "Kjo ofertë ka marrë tashmë një përgjigje." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const updates =
    action === "accept"
      ? { status: "accepted", accepted_at: now, client_note: note, updated_at: now }
      : { status: "rejected", declined_at: now, client_note: note, updated_at: now };

  const { data: updated, error: updateError } = await supabase
    .from("quotes")
    .update(updates)
    .eq("id", quote.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ success: false, error: "Diçka shkoi keq. Provoni sërish." }, { status: 500 });
  }

  // Njofto adminin — mos e blloko përgjigjen e klientit nëse email-i dështon
  const record = updated as QuoteRecord;
  const total = formatMoney(quoteTotals(record.items, record.discount, record.tax_rate).total);
  await sendTelegramMessage(
    action === "accept"
      ? `💰 <b>OFERTA U PRANUA!</b>\n\n${escapeTelegramHtml(record.client_name)} pranoi ofertën <b>${escapeTelegramHtml(record.number)}</b> me vlerë <b>${total}</b>.${note ? `\n\n💬 "${escapeTelegramHtml(note)}"` : ""}`
      : `✖️ Oferta <b>${escapeTelegramHtml(record.number)}</b> u refuzua nga ${escapeTelegramHtml(record.client_name)} (${total}).${note ? `\n\n💬 "${escapeTelegramHtml(note)}"` : ""}`
  );

  try {
    await resend.emails.send({
      from: NEWSLETTER_BRAND.from,
      to: process.env.CONTACT_TO_EMAIL!,
      subject:
        action === "accept"
          ? `💰 ${record.number} u pranua nga ${record.client_name}`
          : `${record.number} u refuzua nga ${record.client_name}`,
      html: adminQuoteResponseEmailHtml(record, action, note),
    });
  } catch {
    // injoro — përgjigja e klientit u regjistrua
  }

  return NextResponse.json({ success: true, status: updates.status });
}
