import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, broadcastEmailHtml } from "@/lib/newsletterEmail";
import { getSiteSettings } from "@/lib/siteSettings";
import {
  quoteEmailHtml,
  quoteReminderEmailHtml,
  invoiceOverdueEmailHtml,
  adminDailySummaryHtml,
} from "@/lib/adminEmails";
import { insertQuoteWithNumber } from "@/lib/quotesServer";
import type { QuoteRecord, RecurringInvoice } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const QUOTE_REMINDER_MAX = 2;       // maksimumi i kujtuesve për ofertë
const QUOTE_REMINDER_GAP_DAYS = 3;  // ditë pas dërgimit / kujtuesit të fundit
const INVOICE_REMINDER_MAX = 3;     // maksimumi i kujtuesve për faturë të vonuar
const INVOICE_REMINDER_GAP_DAYS = 4;

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

// Automatizimet ditore: publikim artikujsh, kujtues ofertash pa përgjigje,
// kujtues faturash të vonuara dhe gjenerim i faturave të rikurruese.
// Në fund i dërgon adminit një përmbledhje (vetëm kur ka ndodhur diçka).
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const dayOfMonth = new Date().getDate();

  // ── 1. Publiko artikujt e planifikuar ──────────────────────────────────────
  const { data: published } = await supabase
    .from("blog_posts")
    .update({ published: true })
    .eq("published", false)
    .lte("scheduled_for", nowIso)
    .select("id");
  const publishedPosts = published?.length ?? 0;

  // ── 2. Kujtues për oferta të dërguara pa përgjigje ─────────────────────────
  const remindedQuotes: string[] = [];
  const { data: pendingQuotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("kind", "quote")
    .eq("status", "sent")
    .not("client_email", "is", null)
    .lt("reminders_sent", QUOTE_REMINDER_MAX)
    .limit(20);

  for (const q of (pendingQuotes ?? []) as QuoteRecord[]) {
    const lastActivity = q.last_reminder_at ?? q.updated_at;
    if (lastActivity > daysAgoIso(QUOTE_REMINDER_GAP_DAYS)) continue;
    try {
      await resend.emails.send({
        from: NEWSLETTER_BRAND.from,
        to: q.client_email!,
        replyTo: "info@illyrianpixel.com",
        subject: `Një kujtesë e vogël — oferta ${q.number}`,
        html: quoteReminderEmailHtml(q),
      });
      await supabase
        .from("quotes")
        .update({ reminders_sent: (q.reminders_sent ?? 0) + 1, last_reminder_at: nowIso })
        .eq("id", q.id);
      remindedQuotes.push(`${q.number} (${q.client_name})`);
    } catch {
      // injoro — provohet sërish nesër
    }
  }

  // ── 3. Kujtues pagese për fatura të vonuara ────────────────────────────────
  const remindedInvoices: string[] = [];
  const { data: overdueInvoices } = await supabase
    .from("quotes")
    .select("*")
    .eq("kind", "invoice")
    .eq("status", "sent")
    .not("client_email", "is", null)
    .lt("due_at", today)
    .lt("reminders_sent", INVOICE_REMINDER_MAX)
    .limit(20);

  for (const q of (overdueInvoices ?? []) as QuoteRecord[]) {
    if (q.last_reminder_at && q.last_reminder_at > daysAgoIso(INVOICE_REMINDER_GAP_DAYS)) continue;
    try {
      await resend.emails.send({
        from: NEWSLETTER_BRAND.from,
        to: q.client_email!,
        replyTo: "info@illyrianpixel.com",
        subject: `Kujtesë pagese — fatura ${q.number}`,
        html: invoiceOverdueEmailHtml(q),
      });
      await supabase
        .from("quotes")
        .update({ reminders_sent: (q.reminders_sent ?? 0) + 1, last_reminder_at: nowIso })
        .eq("id", q.id);
      remindedInvoices.push(`${q.number} (${q.client_name})`);
    } catch {
      // injoro — provohet sërish nesër
    }
  }

  // ── 4. Gjenero faturat e rikurruese të muajit ──────────────────────────────
  const generatedInvoices: string[] = [];
  const { data: recurringRows } = await supabase
    .from("recurring_invoices")
    .select("*")
    .eq("active", true)
    .lte("day_of_month", dayOfMonth)
    .limit(30);

  for (const r of (recurringRows ?? []) as RecurringInvoice[]) {
    if (r.last_generated === currentMonth) continue;

    const dueAt = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    const { quote: created, error: insertError } = await insertQuoteWithNumber(supabase, {
      kind: "invoice",
      contact_id: r.contact_id,
      client_name: r.client_name,
      client_email: r.client_email,
      client_business: r.client_business,
      items: r.items,
      discount: r.discount,
      tax_rate: r.tax_rate,
      notes: r.notes,
      due_at: dueAt,
      status: r.client_email ? "sent" : "draft",
    });
    if (insertError || !created) continue;

    await supabase
      .from("recurring_invoices")
      .update({ last_generated: currentMonth })
      .eq("id", r.id);

    const record = created as unknown as QuoteRecord;
    if (r.client_email) {
      try {
        await resend.emails.send({
          from: NEWSLETTER_BRAND.from,
          to: r.client_email,
          replyTo: "info@illyrianpixel.com",
          subject: `Faturë ${record.number} — Illyrian Pixel`,
          html: quoteEmailHtml(record),
        });
      } catch {
        // fatura u krijua; email-i mund të ridërgohet nga paneli
      }
    }
    generatedInvoices.push(`${record.number} (${r.client_name})`);
  }

  // ── 5. Dërgo broadcast-et e planifikuara ───────────────────────────────────
  const sentBroadcasts: string[] = [];
  const { data: dueBroadcasts } = await supabase
    .from("newsletter_broadcasts")
    .select("*")
    .is("sent_at", null)
    .not("scheduled_for", "is", null)
    .lte("scheduled_for", nowIso)
    .limit(10);

  if (dueBroadcasts && dueBroadcasts.length > 0) {
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("unsubscribed", false);
    const recipients = (subscribers ?? []).map((s) => s.email);

    if (recipients.length > 0) {
      const { whatsapp_number } = await getSiteSettings();
      const whatsappUrl = `https://wa.me/${whatsapp_number}`;
      const BATCH_SIZE = 100;

      for (const b of dueBroadcasts) {
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
          const chunk = recipients.slice(i, i + BATCH_SIZE);
          await resend.batch.send(
            chunk.map((email) => ({
              from: NEWSLETTER_BRAND.from,
              to: email,
              subject: b.subject,
              html: broadcastEmailHtml(b.subject, b.message, whatsappUrl, { broadcastId: b.id, email }),
            }))
          );
        }
        await supabase
          .from("newsletter_broadcasts")
          .update({ sent_at: nowIso, sent_count: recipients.length })
          .eq("id", b.id);
        sentBroadcasts.push(b.subject);
      }
    }
  }

  // ── 6. Përmbledhja për adminin (vetëm kur ka aktivitet) ────────────────────
  const hasActivity =
    remindedQuotes.length > 0 ||
    remindedInvoices.length > 0 ||
    generatedInvoices.length > 0 ||
    publishedPosts > 0 ||
    sentBroadcasts.length > 0;

  if (hasActivity) {
    // Regjistro në Histori çfarë bënë automatizimet sot
    if (publishedPosts > 0) await logActivity("auto", "publish", `U publikuan vetë ${publishedPosts} artikuj të planifikuar`);
    for (const q of remindedQuotes) await logActivity("auto", "send", `U dërgua kujtues oferte për ${q}`);
    for (const q of remindedInvoices) await logActivity("auto", "send", `U dërgua kujtues pagese për ${q}`);
    for (const q of generatedInvoices) await logActivity("auto", "create", `U gjenerua vetë fatura e rikurruese ${q}`);
    for (const b of sentBroadcasts) await logActivity("newsletter", "send", `U dërgua broadcast i planifikuar "${b}"`);
    try {
      await resend.emails.send({
        from: NEWSLETTER_BRAND.from,
        to: process.env.CONTACT_TO_EMAIL!,
        subject: "Përmbledhja e automatizimeve të sotme",
        html: adminDailySummaryHtml({ remindedQuotes, remindedInvoices, generatedInvoices, publishedPosts, sentBroadcasts }),
      });
    } catch {
      // injoro
    }
  }

  return NextResponse.json({
    success: true,
    publishedPosts,
    remindedQuotes: remindedQuotes.length,
    remindedInvoices: remindedInvoices.length,
    generatedInvoices: generatedInvoices.length,
    sentBroadcasts: sentBroadcasts.length,
  });
}
