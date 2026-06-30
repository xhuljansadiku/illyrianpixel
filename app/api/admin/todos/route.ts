import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("admin_todos")
    .select("*")
    .order("done", { ascending: true })
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, todos: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const text = String(body.text ?? "").trim().slice(0, 500);

  if (!text) {
    return NextResponse.json({ success: false, error: "Detyra s'mund të jetë bosh." }, { status: 400 });
  }
  const dueAt = typeof body.due_at === "string" && body.due_at ? body.due_at : null;

  const { data, error } = await supabase
    .from("admin_todos")
    .insert({ text, due_at: dueAt })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, todo: data });
}
