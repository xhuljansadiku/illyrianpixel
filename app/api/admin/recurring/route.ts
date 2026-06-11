import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseQuoteItems } from "@/lib/quotes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("recurring_invoices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, recurring: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const clientName = String(body.client_name ?? "").trim().slice(0, 160);
  const items = parseQuoteItems(body.items);
  const dayOfMonth = Math.min(28, Math.max(1, Number(body.day_of_month) || 1));

  if (!clientName) {
    return NextResponse.json({ success: false, error: "Emri i klientit është i detyrueshëm." }, { status: 400 });
  }
  if (!items) {
    return NextResponse.json({ success: false, error: "Shto të paktën një artikull të vlefshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("recurring_invoices")
    .insert({
      contact_id: typeof body.contact_id === "string" && body.contact_id ? body.contact_id : null,
      client_name: clientName,
      client_email: String(body.client_email ?? "").trim().slice(0, 254) || null,
      client_business: String(body.client_business ?? "").trim().slice(0, 160) || null,
      items,
      discount: Math.max(0, Number(body.discount) || 0),
      tax_rate: Math.min(100, Math.max(0, Number(body.tax_rate) || 0)),
      notes: String(body.notes ?? "").trim().slice(0, 2000) || null,
      day_of_month: dayOfMonth,
      active: body.active !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, recurring: data });
}
