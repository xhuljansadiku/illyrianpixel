import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");
  const entities = searchParams.get("entities");
  const since = searchParams.get("since");
  const limit = Number(searchParams.get("limit")) || 300;

  let query = supabase
    .from("admin_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (entity) query = query.eq("entity", entity);
  if (entities) query = query.in("entity", entities.split(","));
  if (since) query = query.gt("created_at", since);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, activity: data });
}
