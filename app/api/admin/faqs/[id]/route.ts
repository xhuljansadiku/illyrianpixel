import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.question === "string") {
    const question = body.question.trim().slice(0, 300);
    if (!question) {
      return NextResponse.json({ success: false, error: "Pyetja është e detyrueshme." }, { status: 400 });
    }
    updates.question = question;
  }
  if (typeof body.answer === "string") {
    const answer = body.answer.trim().slice(0, 2000);
    if (!answer) {
      return NextResponse.json({ success: false, error: "Përgjigjja është e detyrueshme." }, { status: 400 });
    }
    updates.answer = answer;
  }
  if (typeof body.category === "string") updates.category = body.category.trim().slice(0, 100) || null;
  if (typeof body.question_en === "string") updates.question_en = body.question_en.trim().slice(0, 300) || null;
  if (typeof body.answer_en === "string") updates.answer_en = body.answer_en.trim().slice(0, 2000) || null;
  if (typeof body.category_en === "string") updates.category_en = body.category_en.trim().slice(0, 100) || null;
  if (typeof body.visible === "boolean") updates.visible = body.visible;
  if (body.sort !== undefined && Number.isFinite(Number(body.sort))) updates.sort = Number(body.sort);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("faqs")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (typeof body.visible === "boolean") {
    await logActivity("faq", "update", `Pyetja FAQ "${data.question}" u ${body.visible ? "shfaq" : "fsheh"}`);
  } else if (body.sort === undefined || typeof body.question === "string" || typeof body.answer === "string") {
    await logActivity("faq", "update", `U editua pyetja FAQ "${data.question}"`);
  }

  return NextResponse.json({ success: true, faq: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("faqs").delete().eq("id", params.id).select("question");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("faq", "delete", `U fshi pyetja FAQ "${data[0].question}"`);
  }
  return NextResponse.json({ success: true });
}
