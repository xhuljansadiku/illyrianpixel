import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT = 60;
const WINDOW_SECONDS = 5 * 60; // 5 minuta — bujar për navigim real, jo për flood script-esh

// Endpoint plotësisht publik e i pa-autentifikuar; pa këtë, dikush mund të mbushë
// bazën e të dhënave me shkrime të pakufizuara dhe të "helmojë" statistikat e faqeve.
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_SECONDS * 1000);

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("scope", "track")
    .eq("ip", ip)
    .gte("created_at", windowStart.toISOString());

  if (error) return true; // fail open — nuk bllokojmë nëse DB ka problem

  if ((count ?? 0) >= RATE_LIMIT) return false;

  await supabase.from("rate_limits").insert({ scope: "track", ip, created_at: now.toISOString() });
  return true;
}

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

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  await supabase.rpc("increment_page_view", { p_path: path });

  return NextResponse.json({ success: true });
}
