import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Publikon artikujt e planifikuar kur u vjen ora.
// Faqet publike i shfaqin gjithsesi me kusht (published OR scheduled_for <= now),
// ky cron vetëm normalizon flag-un në DB.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ published: true })
    .eq("published", false)
    .lte("scheduled_for", new Date().toISOString())
    .select("id");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, published: data?.length ?? 0 });
}
