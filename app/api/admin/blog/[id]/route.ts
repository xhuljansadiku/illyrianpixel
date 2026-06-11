import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { title, category, excerpt, content, date } = body;

  const update: Record<string, unknown> = {};
  if (typeof title === "string") update.title = title;
  if (typeof category === "string") update.category = category;
  if (typeof excerpt === "string") update.excerpt = excerpt;
  if (typeof date === "string") update.date = date;
  if (content !== undefined) {
    update.content = Array.isArray(content)
      ? content
      : String(content || "").split("\n\n").map((p: string) => p.trim()).filter(Boolean);
  }

  if (body.scheduled_for !== undefined) {
    const scheduledFor = body.scheduled_for ? new Date(String(body.scheduled_for)) : null;
    if (scheduledFor && !Number.isNaN(scheduledFor.getTime()) && scheduledFor.getTime() > Date.now()) {
      update.scheduled_for = scheduledFor.toISOString();
      update.published = false;
    } else {
      update.scheduled_for = null;
      update.published = true;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { error } = await supabase.from("blog_posts").update(update).eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
