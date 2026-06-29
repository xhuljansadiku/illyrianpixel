import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { parseQuoteItems, QUOTE_STATUS_LABELS, type QuoteRecord } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";
import { paymentThankYouEmailHtml } from "@/lib/adminEmails";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_STATUS = ["draft", "sent", "accepted", "rejected", "paid"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const update: Record<string, unknown> = {};
  let previousStatus: string | null = null;

  if (typeof body.status === "string") {
    if (!ALLOWED_STATUS.includes(body.status)) {
      return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
    }
    update.status = body.status;
    const { data: existing } = await supabase.from("quotes").select("status").eq("id", params.id).maybeSingle();
    previousStatus = existing?.status ?? null;
  }
  if (body.items !== undefined) {
    const items = parseQuoteItems(body.items);
    if (!items) {
      return NextResponse.json({ success: false, error: "Artikuj të pavlefshëm." }, { status: 400 });
    }
    update.items = items;
  }
  if (body.client_name !== undefined) {
    const name = String(body.client_name).trim().slice(0, 160);
    if (!name) return NextResponse.json({ success: false, error: "Emri i klientit është i detyrueshëm." }, { status: 400 });
    update.client_name = name;
  }
  if (body.client_email !== undefined) update.client_email = String(body.client_email).trim().slice(0, 254) || null;
  if (body.client_business !== undefined) update.client_business = String(body.client_business).trim().slice(0, 160) || null;
  if (body.discount !== undefined) update.discount = Math.max(0, Number(body.discount) || 0);
  if (body.tax_rate !== undefined) update.tax_rate = Math.min(100, Math.max(0, Number(body.tax_rate) || 0));
  if (body.notes !== undefined) update.notes = String(body.notes).trim().slice(0, 2000) || null;
  if (body.due_at !== undefined) update.due_at = body.due_at || null;
  if (body.issued_at !== undefined && body.issued_at) update.issued_at = body.issued_at;
  if (body.contact_id !== undefined) update.contact_id = body.contact_id || null;
  if (body.restore === true) update.deleted_at = null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("quotes")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (typeof body.status === "string") {
    await logActivity("quote", "update", `${data.number} kaloi në status "${QUOTE_STATUS_LABELS[body.status as keyof typeof QUOTE_STATUS_LABELS] ?? body.status}"`);
  } else if (body.restore === true) {
    await logActivity("quote", "update", `U rikthye ${data.number} nga koshi`);
  } else {
    await logActivity("quote", "update", `U editua ${data.number} (${data.client_name})`);
  }

  const justPaid = body.status === "paid" && previousStatus !== "paid";
  if (justPaid && data.kind === "invoice" && data.client_email) {
    try {
      const { subject, html } = await paymentThankYouEmailHtml(data as QuoteRecord);
      await resend.emails.send({
        from: NEWSLETTER_BRAND.from,
        to: data.client_email,
        replyTo: "info@illyrianpixel.com",
        subject,
        html,
      });
      await logActivity("quote", "send", `U dërgua email falënderimi për pagesën e ${data.number}`);
    } catch {
      // injoro — fatura mbetet "Paguar"; email-i mund të ridërgohet manualisht nga paneli
    }
  }

  return NextResponse.json({ success: true, quote: data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const permanent = new URL(req.url).searchParams.get("permanent") === "1";

  if (permanent) {
    const { data, error } = await supabase.from("quotes").delete().eq("id", params.id).select("number, client_name");
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    if (data?.[0]) {
      await logActivity("quote", "delete", `U fshi përgjithmonë ${data[0].number} (${data[0].client_name})`);
    }
    return NextResponse.json({ success: true });
  }

  const { data, error } = await supabase
    .from("quotes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", params.id)
    .select("number, client_name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("quote", "delete", `U fshi ${data[0].number} (${data[0].client_name})`);
  }
  return NextResponse.json({ success: true });
}
