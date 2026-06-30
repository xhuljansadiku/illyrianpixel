import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.content === "string") {
    const content = body.content.trim().slice(0, 4000);
    if (!content) {
      return NextResponse.json({ success: false, error: "Shënimi s'mund të jetë bosh." }, { status: 400 });
    }
    updates.content = content;
  }
  if (body.title !== undefined) {
    updates.title = typeof body.title === "string" ? body.title.trim().slice(0, 120) || null : null;
  }
  if (typeof body.pinned === "boolean") updates.pinned = body.pinned;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("admin_notes")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, note: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("admin_notes").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("note", "delete", "U fshi një shënim");
  return NextResponse.json({ success: true });
}
