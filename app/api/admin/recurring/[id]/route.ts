import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseQuoteItems } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.client_name === "string") {
    const name = body.client_name.trim().slice(0, 160);
    if (!name) {
      return NextResponse.json({ success: false, error: "Emri i klientit është i detyrueshëm." }, { status: 400 });
    }
    updates.client_name = name;
  }
  if (typeof body.client_email === "string") {
    updates.client_email = body.client_email.trim().slice(0, 254) || null;
  }
  if (typeof body.client_business === "string") {
    updates.client_business = body.client_business.trim().slice(0, 160) || null;
  }
  if (typeof body.contact_id === "string") {
    updates.contact_id = body.contact_id || null;
  }
  if (body.items !== undefined) {
    const items = parseQuoteItems(body.items);
    if (!items) {
      return NextResponse.json({ success: false, error: "Artikuj të pavlefshëm." }, { status: 400 });
    }
    updates.items = items;
  }
  if (body.discount !== undefined) updates.discount = Math.max(0, Number(body.discount) || 0);
  if (body.tax_rate !== undefined) updates.tax_rate = Math.min(100, Math.max(0, Number(body.tax_rate) || 0));
  if (typeof body.notes === "string") updates.notes = body.notes.trim().slice(0, 2000) || null;
  if (body.day_of_month !== undefined) {
    updates.day_of_month = Math.min(28, Math.max(1, Number(body.day_of_month) || 1));
  }
  if (typeof body.active === "boolean") updates.active = body.active;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("recurring_invoices")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (typeof body.active === "boolean") {
    await logActivity("recurring", "update", `Fatura e rikurruese e ${data.client_name} u ${body.active ? "aktivizua" : "ndal"}`);
  } else {
    await logActivity("recurring", "update", `U editua fatura e rikurruese e ${data.client_name}`);
  }

  return NextResponse.json({ success: true, recurring: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("recurring_invoices").delete().eq("id", params.id).select("client_name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("recurring", "delete", `U fshi fatura e rikurruese e ${data[0].client_name}`);
  }
  return NextResponse.json({ success: true });
}
