import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  let path = "";
  try {
    const body = await req.json();
    path = String(body.path ?? "");
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Vetëm path-e të brendshme publike, pa query
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api") || path.length > 200) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await supabase.rpc("increment_page_view", { p_path: path });

  return NextResponse.json({ success: true });
}
