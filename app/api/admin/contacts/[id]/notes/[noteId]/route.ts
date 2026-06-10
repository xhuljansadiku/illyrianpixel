import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string; noteId: string } }) {
  const body = await req.json();
  const text = String(body.text ?? "").trim().slice(0, 4000);

  if (!text) {
    return NextResponse.json({ success: false, error: "Shënimi nuk mund të jetë bosh." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_notes")
    .update({ text, updated_at: new Date().toISOString() })
    .eq("id", params.noteId)
    .eq("contact_id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, note: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string; noteId: string } }) {
  const { error } = await supabase
    .from("contact_notes")
    .delete()
    .eq("id", params.noteId)
    .eq("contact_id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
