import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_SESSION_COOKIE, getAdminSessionToken } from "@/lib/adminAuth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

export async function POST(req: Request) {
  const { password } = await req.json();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("admin_logins")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("success", false)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= LOCKOUT_THRESHOLD) {
    return NextResponse.json(
      { success: false, error: `Shumë tentativa të dështuara. Provo përsëri pas ${LOCKOUT_WINDOW_MINUTES} minutash.` },
      { status: 429 }
    );
  }

  const success = !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;

  await supabase.from("admin_logins").insert({ success, ip, user_agent: userAgent });

  if (!success) {
    return NextResponse.json({ success: false, error: "Fjalëkalim i gabuar." }, { status: 401 });
  }

  const token = await getAdminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
