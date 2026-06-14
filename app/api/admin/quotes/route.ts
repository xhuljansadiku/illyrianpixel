import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseQuoteItems } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
  const limit = Number(searchParams.get("limit")) || 300;

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, quotes: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const kind = body.kind === "invoice" ? "invoice" : "quote";
  const clientName = String(body.client_name ?? "").trim().slice(0, 160);
  const clientEmail = String(body.client_email ?? "").trim().slice(0, 254) || null;
  const clientBusiness = String(body.client_business ?? "").trim().slice(0, 160) || null;
  const contactId = typeof body.contact_id === "string" && body.contact_id ? body.contact_id : null;
  const items = parseQuoteItems(body.items);
  const discount = Math.max(0, Number(body.discount) || 0);
  const taxRate = Math.min(100, Math.max(0, Number(body.tax_rate) || 0));
  const notes = String(body.notes ?? "").trim().slice(0, 2000) || null;
  const issuedAt = typeof body.issued_at === "string" && body.issued_at ? body.issued_at : undefined;
  const dueAt = typeof body.due_at === "string" && body.due_at ? body.due_at : null;

  if (!clientName) {
    return NextResponse.json({ success: false, error: "Emri i klientit është i detyrueshëm." }, { status: 400 });
  }
  if (!items) {
    return NextResponse.json({ success: false, error: "Shto të paktën një artikull të vlefshëm." }, { status: 400 });
  }

  const prefix = kind === "invoice" ? "FA" : "OF";
  const year = new Date().getFullYear();

  const { count } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .like("number", `${prefix}-${year}-%`);

  // Provo disa numra radhazi në rast përplasjeje (unique constraint)
  let lastError = "Nuk u gjenerua dot numri.";
  for (let n = (count ?? 0) + 1; n <= (count ?? 0) + 5; n++) {
    const number = `${prefix}-${year}-${String(n).padStart(3, "0")}`;
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        number,
        kind,
        contact_id: contactId,
        client_name: clientName,
        client_email: clientEmail,
        client_business: clientBusiness,
        items,
        discount,
        tax_rate: taxRate,
        notes,
        ...(issuedAt ? { issued_at: issuedAt } : {}),
        due_at: dueAt,
      })
      .select()
      .single();

    if (!error) {
      await logActivity("quote", "create", `U krijua ${kind === "invoice" ? "fatura" : "oferta"} ${number} për ${clientName}`);
      return NextResponse.json({ success: true, quote: data });
    }
    if (error.code !== "23505") {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    lastError = error.message;
  }

  return NextResponse.json({ success: false, error: lastError }, { status: 500 });
}
