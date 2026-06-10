import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  const { slug, title, category, excerpt, content, date } = body;

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

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title,
      category,
      excerpt,
      content: contentArray,
      date,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "Ky slug ekziston tashmë." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, post: data });
}
