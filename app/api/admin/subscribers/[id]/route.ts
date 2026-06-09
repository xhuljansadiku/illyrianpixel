import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  if (typeof body.unsubscribed !== "boolean") {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed: body.unsubscribed })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
