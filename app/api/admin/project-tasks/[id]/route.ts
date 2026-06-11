import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim().slice(0, 300);
    if (!title) {
      return NextResponse.json({ success: false, error: "Titulli i detyrës është i detyrueshëm." }, { status: 400 });
    }
    updates.title = title;
  }
  if (typeof body.done === "boolean") updates.done = body.done;
  if (body.due_at !== undefined) {
    updates.due_at = typeof body.due_at === "string" && body.due_at ? body.due_at : null;
  }
  if (body.sort !== undefined && Number.isFinite(Number(body.sort))) updates.sort = Number(body.sort);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("project_tasks")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, task: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("project_tasks").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
