import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const until = searchParams.get("until");
  const limit = Number(searchParams.get("limit")) || 20;

  let query = supabase
    .from("admin_logins")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (since) query = query.gte("created_at", since);
  if (until) query = query.lte("created_at", until);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, logins: data });
}
