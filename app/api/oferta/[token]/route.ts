import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { adminQuoteResponseEmailHtml, clientPortalLinkEmailHtml, quoteEmailHtml } from "@/lib/adminEmails";
import { sendTelegramMessage, escapeTelegramHtml } from "@/lib/telegram";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { quoteTotals, formatMoney, type QuoteRecord } from "@/lib/quotes";
import { insertQuoteWithNumber } from "@/lib/quotesServer";
import { DEFAULT_PROJECT_TASKS } from "@/lib/projects";
import { logActivity } from "@/lib/activityLog";

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
  // Pastro datën e kundërt — vetëm përgjigja e fundit vlen
  const updates =
    action === "accept"
      ? { status: "accepted", accepted_at: now, declined_at: null, client_note: note, updated_at: now }
      : { status: "rejected", declined_at: now, accepted_at: null, client_note: note, updated_at: now };

  const { data: updated, error: updateError } = await supabase
    .from("quotes")
    .update(updates)
    .eq("id", quote.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ success: false, error: "Diçka shkoi keq. Provoni sërish." }, { status: 500 });
  }

  await logActivity(
    "client",
    action,
    action === "accept"
      ? `Klienti ${quote.client_name} PRANOI ofertën ${quote.number}${note ? ` — "${note}"` : ""}`
      : `Klienti ${quote.client_name} refuzoi ofertën ${quote.number}${note ? ` — arsyeja: "${note}"` : ""}`
  );

  // Ofertë e pranuar → krijo projektin vetë me checklist-ën standarde (best-effort)
  if (action === "accept") {
    try {
      const { data: project } = await supabase
        .from("projects")
        .insert({
          contact_id: quote.contact_id,
          name: `${quote.client_business || quote.client_name} — ${quote.number}`,
          client_name: quote.client_name,
          phase: "discovery",
          notes: `Krijuar automatikisht nga pranimi i ofertës ${quote.number}.`,
        })
        .select("id")
        .single();

      if (project) {
        await supabase
          .from("project_tasks")
          .insert(DEFAULT_PROJECT_TASKS.map((title, i) => ({ project_id: project.id, title, sort: i })));
        await logActivity("auto", "create", `U krijua automatikisht projekti për ${quote.client_business || quote.client_name} (nga ${quote.number})`);
      }
    } catch {
      // projekti mund të krijohet edhe manualisht — mos e blloko pranimin
    }

    // Gjenero automatikisht faturën fillestare nga zërat e ofertës (best-effort)
    try {
      const dueAt = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      const { quote: invoice } = await insertQuoteWithNumber(supabase, {
        kind: "invoice",
        contact_id: quote.contact_id,
        client_name: quote.client_name,
        client_email: quote.client_email,
        client_business: quote.client_business,
        items: quote.items,
        discount: quote.discount,
        tax_rate: quote.tax_rate,
        notes: `Krijuar automatikisht nga pranimi i ofertës ${quote.number}.`,
        due_at: dueAt,
        status: quote.client_email ? "sent" : "draft",
      });

      if (invoice) {
        const invoiceRecord = invoice as unknown as QuoteRecord;
        await logActivity("auto", "create", `U krijua automatikisht fatura ${invoiceRecord.number} nga pranimi i ofertës ${quote.number}`);
        if (quote.client_email) {
          try {
            await resend.emails.send({
              from: NEWSLETTER_BRAND.from,
              to: quote.client_email,
              replyTo: "info@illyrianpixel.com",
              subject: `Faturë ${invoiceRecord.number} — Illyrian Pixel`,
              html: quoteEmailHtml(invoiceRecord),
            });
          } catch {
            // fatura u krijua; email-i mund të ridërgohet nga paneli
          }
        }
      }
    } catch {
      // fatura mund të krijohet edhe manualisht — mos e blloko pranimin
    }

    // Dërgo klientit linkun e portalit të tij (best-effort)
    if (quote.contact_id && quote.client_email) {
      try {
        const { data: contact } = await supabase
          .from("contacts")
          .select("portal_token")
          .eq("id", quote.contact_id)
          .single();
        if (contact?.portal_token) {
          await resend.emails.send({
            from: NEWSLETTER_BRAND.from,
            to: quote.client_email,
            replyTo: "info@illyrianpixel.com",
            subject: "Portali juaj — Illyrian Pixel",
            html: clientPortalLinkEmailHtml(quote.client_name, `${NEWSLETTER_BRAND.website}/klienti/${contact.portal_token}`),
          });
        }
      } catch {
        // best-effort — nuk e blloko pranimin
      }
    }
  }

  // Njofto adminin — mos e blloko përgjigjen e klientit nëse email-i dështon
  const record = updated as QuoteRecord;
  const total = formatMoney(quoteTotals(record.items, record.discount, record.tax_rate).total);
  await sendTelegramMessage(
    action === "accept"
      ? `💰 <b>OFERTA U PRANUA!</b>\n\n${escapeTelegramHtml(record.client_name)} pranoi ofertën <b>${escapeTelegramHtml(record.number)}</b> me vlerë <b>${total}</b>.${note ? `\n\n💬 "${escapeTelegramHtml(note)}"` : ""}`
      : `✖️ Oferta <b>${escapeTelegramHtml(record.number)}</b> u refuzua nga ${escapeTelegramHtml(record.client_name)} (${total}).${note ? `\n\n💬 "${escapeTelegramHtml(note)}"` : ""}`
  );

  await sendWhatsAppMessage(
    action === "accept"
      ? `💰 OFERTA U PRANUA!\n\n${record.client_name} pranoi ofertën ${record.number} me vlerë ${total}.${note ? `\n\n💬 "${note}"` : ""}`
      : `✖️ Oferta ${record.number} u refuzua nga ${record.client_name} (${total}).${note ? `\n\n💬 "${note}"` : ""}`
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
