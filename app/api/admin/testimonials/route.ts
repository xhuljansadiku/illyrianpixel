import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, testimonials: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const quote = String(body.quote ?? "").trim().slice(0, 2000);
  const name = String(body.name ?? "").trim().slice(0, 120);

  if (!quote || !name) {
    return NextResponse.json({ success: false, error: "Citimi dhe emri janë të detyrueshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      quote,
      name,
      company: String(body.company ?? "").trim().slice(0, 160) || null,
      result: String(body.result ?? "").trim().slice(0, 160) || null,
      logo: String(body.logo ?? "").trim().slice(0, 500) || null,
      category: String(body.category ?? "").trim().slice(0, 100) || null,
      visible: body.visible !== false,
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("testimonial", "create", `U shtua testimoniali i ${name}`);
  return NextResponse.json({ success: true, testimonial: data });
}
