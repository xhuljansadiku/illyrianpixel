import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const token = params.token;
  if (!token || token.length < 16 || token.length > 64) {
    return NextResponse.json({ success: false, error: "Lidhje e pavlefshme." }, { status: 400 });
  }

  let body: { rating?: unknown; comment?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Kërkesë e pavlefshme." }, { status: 400 });
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, error: "Zgjidhni një vlerësim 1-5." }, { status: 400 });
  }
  const comment = String(body.comment ?? "").trim().slice(0, 2000) || null;

  const { data: feedback, error } = await supabase
    .from("project_feedback")
    .select("*, projects(name)")
    .eq("public_token", token)
    .single();

  if (error || !feedback) {
    return NextResponse.json({ success: false, error: "Nuk u gjet." }, { status: 404 });
  }
  if (feedback.submitted_at) {
    return NextResponse.json({ success: false, error: "Ky vlerësim është dhënë tashmë." }, { status: 409 });
  }

  const { error: updateError } = await supabase
    .from("project_feedback")
    .update({ rating, comment, submitted_at: new Date().toISOString() })
    .eq("id", feedback.id);

  if (updateError) {
    return NextResponse.json({ success: false, error: "Diçka shkoi keq. Provoni sërish." }, { status: 500 });
  }

  // Vlerësim i mirë + koment → kandidat testimoniali, i fshehur derisa admini ta rishikojë
  if (rating >= 4 && comment) {
    await supabase.from("testimonials").insert({
      quote: comment,
      name: feedback.client_name,
      company: feedback.client_business,
      visible: false,
    });
  }

  return NextResponse.json({ success: true });
}
