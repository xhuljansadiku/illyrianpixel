import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.done === "boolean") updates.done = body.done;
  if (typeof body.text === "string") {
    const text = body.text.trim().slice(0, 500);
    if (!text) {
      return NextResponse.json({ success: false, error: "Detyra s'mund të jetë bosh." }, { status: 400 });
    }
    updates.text = text;
  }
  if (body.due_at !== undefined) {
    updates.due_at = typeof body.due_at === "string" && body.due_at ? body.due_at : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("admin_todos")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, todo: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("admin_todos").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
