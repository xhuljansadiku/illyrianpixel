import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, notes: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const content = String(body.content ?? "").trim().slice(0, 4000);

  if (!content) {
    return NextResponse.json({ success: false, error: "Shënimi s'mund të jetë bosh." }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) || null : null;

  const { data, error } = await supabase
    .from("admin_notes")
    .insert({ title, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("note", "create", `U shtua shënimi${title ? ` "${title}"` : ""}`);
  return NextResponse.json({ success: true, note: data });
}
