import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => Number.isFinite(Number(id))).map(Number) : [];
  if (ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë artikull i zgjedhur." }, { status: 400 });
  }

  if (body.action === "published") {
    const published = !!body.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({ published, scheduled_for: published ? null : undefined })
      .in("id", ids);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await logActivity("blog", "update", `${ids.length} artikuj u ${published ? "publikuan" : "çpublikuan"}`);
    return NextResponse.json({ success: true });
  }

  if (body.action === "delete") {
    const { error } = await supabase.from("blog_posts").delete().in("id", ids);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await logActivity("blog", "delete", `U fshinë ${ids.length} artikuj`);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Veprim i panjohur." }, { status: 400 });
}
