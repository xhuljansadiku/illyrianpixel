import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const after = searchParams.get("after");

  if (!after) {
    return NextResponse.json({ success: false, error: "Mungon parametri 'after'." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .gt("created_at", after)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, contacts: data });
}
