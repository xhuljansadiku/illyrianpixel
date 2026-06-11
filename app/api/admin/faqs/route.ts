import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, faqs: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const question = String(body.question ?? "").trim().slice(0, 300);
  const answer = String(body.answer ?? "").trim().slice(0, 2000);

  if (!question || !answer) {
    return NextResponse.json({ success: false, error: "Pyetja dhe përgjigjja janë të detyrueshme." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question,
      answer,
      visible: body.visible !== false,
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("faq", "create", `U shtua pyetja FAQ "${question}"`);
  return NextResponse.json({ success: true, faq: data });
}
