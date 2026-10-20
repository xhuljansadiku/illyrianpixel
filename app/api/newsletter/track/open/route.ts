import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readSignedEmail } from "@/lib/newsletterTokens";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1x1 GIF transparent
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const broadcastId = url.searchParams.get("b") ?? "";

  if (UUID_RE.test(broadcastId)) {
    try {
      // Vetëm me token HMAC të vlefshëm — përndryshe kushdo shtonte "hapje" të rreme
      const email = readSignedEmail(url, "track");
      if (email) {
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
