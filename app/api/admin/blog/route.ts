import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, posts: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, title, category, excerpt, content, date, meta_description } = body;

  if (!slug || !title || !category || !excerpt || !date) {
    return NextResponse.json({ success: false, error: "Plotëso të gjitha fushat." }, { status: 400 });
  }

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json(
      { success: false, error: "Slug i pavlefshëm. Përdor vetëm shkronja të vogla, numra dhe vizë (-)." },
      { status: 400 }
    );
  }

  const contentArray = Array.isArray(content)
    ? content
    : String(content || "").split("\n\n").map((p: string) => p.trim()).filter(Boolean);

  // Publikim i planifikuar — nëse ora është në të ardhmen, posti pret deri atëherë
  const scheduledFor =
    typeof body.scheduled_for === "string" && body.scheduled_for
      ? new Date(body.scheduled_for)
      : null;
  const isScheduled = !!scheduledFor && !Number.isNaN(scheduledFor.getTime()) && scheduledFor.getTime() > Date.now();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title,
      category,
      excerpt,
      content: contentArray,
      date,
      meta_description:
        typeof meta_description === "string" && meta_description.trim()
          ? meta_description.trim().slice(0, 160)
          : null,
      published: !isScheduled,
      scheduled_for: isScheduled ? scheduledFor!.toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "Ky slug ekziston tashmë." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await logActivity(
    "blog",
    "create",
    isScheduled
      ? `U planifikua artikulli "${title}" për ${scheduledFor!.toLocaleDateString("sq-AL")}`
      : `U publikua artikulli "${title}"`
  );

  return NextResponse.json({ success: true, post: data });
}
