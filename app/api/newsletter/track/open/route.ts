import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1x1 GIF transparent
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const broadcastId = searchParams.get("b") ?? "";
  const enc = searchParams.get("e") ?? "";

  if (UUID_RE.test(broadcastId) && enc) {
    try {
      const email = Buffer.from(enc, "base64url").toString("utf8").slice(0, 254);
      if (email.includes("@")) {
        await supabase.from("newsletter_events").insert({ broadcast_id: broadcastId, email, type: "open" });
      }
    } catch {
      // injoro — pixel-i kthehet gjithsesi
    }
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
