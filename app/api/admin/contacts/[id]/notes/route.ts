import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("contact_notes")
    .select("*")
    .eq("contact_id", params.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, notes: data });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const text = String(body.text ?? "").trim().slice(0, 4000);

  if (!text) {
    return NextResponse.json({ success: false, error: "Shënimi nuk mund të jetë bosh." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_notes")
    .insert({ contact_id: params.id, text })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, note: data });
}
