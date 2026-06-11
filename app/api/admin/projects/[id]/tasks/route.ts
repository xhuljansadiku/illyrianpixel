import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const title = String(body.title ?? "").trim().slice(0, 300);

  if (!title) {
    return NextResponse.json({ success: false, error: "Titulli i detyrës është i detyrueshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("project_tasks")
    .insert({
      project_id: Number(params.id),
      title,
      due_at: typeof body.due_at === "string" && body.due_at ? body.due_at : null,
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, task: data });
}
