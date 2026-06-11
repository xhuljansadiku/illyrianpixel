import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const update: Record<string, unknown> = {};

  if (body.quote !== undefined) {
    const quote = String(body.quote).trim().slice(0, 2000);
    if (!quote) return NextResponse.json({ success: false, error: "Citimi nuk mund të jetë bosh." }, { status: 400 });
    update.quote = quote;
  }
  if (body.name !== undefined) {
    const name = String(body.name).trim().slice(0, 120);
    if (!name) return NextResponse.json({ success: false, error: "Emri nuk mund të jetë bosh." }, { status: 400 });
    update.name = name;
  }
  if (body.company !== undefined) update.company = String(body.company).trim().slice(0, 160) || null;
  if (body.result !== undefined) update.result = String(body.result).trim().slice(0, 160) || null;
  if (body.logo !== undefined) update.logo = String(body.logo).trim().slice(0, 500) || null;
  if (body.visible !== undefined) update.visible = !!body.visible;
  if (body.sort !== undefined && Number.isFinite(Number(body.sort))) update.sort = Number(body.sort);

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (body.visible !== undefined) {
    await logActivity("testimonial", "update", `Testimoniali i ${data.name} u ${data.visible ? "shfaq" : "fsheh"}`);
  } else if (body.sort === undefined) {
    await logActivity("testimonial", "update", `U editua testimoniali i ${data.name}`);
  }
  return NextResponse.json({ success: true, testimonial: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("testimonials").delete().eq("id", params.id).select("name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("testimonial", "delete", `U fshi testimoniali i ${data[0].name}`);
  }
  return NextResponse.json({ success: true });
}
