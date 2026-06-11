import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("pricing_overrides").select("*");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, overrides: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const key = String(body.key ?? "").trim().slice(0, 200);
  const price = String(body.price ?? "").trim().slice(0, 60);
  const priceNote = String(body.price_note ?? "").trim().slice(0, 60) || null;

  if (!key || !key.includes("||")) {
    return NextResponse.json({ success: false, error: "Çelës i pavlefshëm." }, { status: 400 });
  }
  if (!price) {
    return NextResponse.json({ success: false, error: "Çmimi është i detyrueshëm." }, { status: 400 });
  }

  const { error } = await supabase
    .from("pricing_overrides")
    .upsert({ key, price, price_note: priceNote, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const key = String(body.key ?? "");

  if (!key) {
    return NextResponse.json({ success: false, error: "Çelës i pavlefshëm." }, { status: 400 });
  }

  const { error } = await supabase.from("pricing_overrides").delete().eq("key", key);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
