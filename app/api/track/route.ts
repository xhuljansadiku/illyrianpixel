import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT = 60;
const WINDOW_SECONDS = 5 * 60; // 5 minuta — bujar për navigim real, jo për flood script-esh

// Endpoint plotësisht publik e i pa-autentifikuar; pa këtë, dikush mund të mbushë
// bazën e të dhënave me shkrime të pakufizuara dhe të "helmojë" statistikat e faqeve.

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

  const ip = getClientIp(req);

  if (!(await checkRateLimit(supabase, "track", ip, RATE_LIMIT, WINDOW_SECONDS))) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  await supabase.rpc("increment_page_view", { p_path: path });

  return NextResponse.json({ success: true });
}
