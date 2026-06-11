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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const update: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim().slice(0, 160);
    if (!title) return NextResponse.json({ success: false, error: "Titulli nuk mund të jetë bosh." }, { status: 400 });
    update.title = title;
  }
  if (body.category !== undefined) update.category = String(body.category).trim().slice(0, 120) || null;
  if (body.location !== undefined) update.location = String(body.location).trim().slice(0, 120) || null;
  if (body.year !== undefined) update.year = String(body.year).trim().slice(0, 10) || null;
  if (body.description !== undefined) update.description = String(body.description).trim().slice(0, 2000) || null;
  if (body.result !== undefined) update.result = String(body.result).trim().slice(0, 300) || null;
  if (body.tags !== undefined) update.tags = parseTags(body.tags);
  if (body.image_url !== undefined) update.image_url = String(body.image_url).trim().slice(0, 600) || null;
  if (body.live_url !== undefined) update.live_url = String(body.live_url).trim().slice(0, 600) || null;
  if (body.visible !== undefined) update.visible = !!body.visible;
  if (body.sort !== undefined && Number.isFinite(Number(body.sort))) update.sort = Number(body.sort);

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("portfolio_items")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (body.visible !== undefined) {
    await logActivity("portfolio", "update", `Projekti i portofolit "${data.title}" u ${data.visible ? "shfaq" : "fsheh"}`);
  } else if (body.sort === undefined) {
    await logActivity("portfolio", "update", `U editua projekti i portofolit "${data.title}"`);
  }
  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("portfolio_items").delete().eq("id", params.id).select("title");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("portfolio", "delete", `U fshi projekti i portofolit "${data[0].title}"`);
  }
  return NextResponse.json({ success: true });
}
