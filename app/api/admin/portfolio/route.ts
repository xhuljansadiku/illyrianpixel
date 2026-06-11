import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim().slice(0, 40))
    .filter(Boolean)
    .slice(0, 8);
}

export async function GET() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, items: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const title = String(body.title ?? "").trim().slice(0, 160);

  if (!title) {
    return NextResponse.json({ success: false, error: "Titulli është i detyrueshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      title,
      category: String(body.category ?? "").trim().slice(0, 120) || null,
      location: String(body.location ?? "").trim().slice(0, 120) || null,
      year: String(body.year ?? "").trim().slice(0, 10) || null,
      description: String(body.description ?? "").trim().slice(0, 2000) || null,
      result: String(body.result ?? "").trim().slice(0, 300) || null,
      tags: parseTags(body.tags),
      image_url: String(body.image_url ?? "").trim().slice(0, 600) || null,
      live_url: String(body.live_url ?? "").trim().slice(0, 600) || null,
      visible: body.visible !== false,
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("portfolio", "create", `U shtua projekti i portofolit "${title}"`);
  return NextResponse.json({ success: true, item: data });
}
