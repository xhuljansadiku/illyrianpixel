import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Lejo vetëm destinacione tonat — shmang open redirect
const ALLOWED_PREFIXES = ["https://illyrianpixel.com", "https://www.illyrianpixel.com", "https://wa.me/"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const broadcastId = searchParams.get("b") ?? "";
  const enc = searchParams.get("e") ?? "";
  const target = searchParams.get("u") ?? "";

  const safeTarget = ALLOWED_PREFIXES.some((p) => target.startsWith(p))
    ? target
    : "https://illyrianpixel.com";

  if (UUID_RE.test(broadcastId) && enc) {
    try {
      const email = Buffer.from(enc, "base64url").toString("utf8").slice(0, 254);
      if (email.includes("@")) {
        await supabase
          .from("newsletter_events")
          .insert({ broadcast_id: broadcastId, email, type: "click", url: safeTarget.slice(0, 600) });
      }
    } catch {
      // injoro — redirect bëhet gjithsesi
    }
  }

  return NextResponse.redirect(safeTarget, 302);
}
