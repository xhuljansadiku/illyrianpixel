import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readSignedEmail } from "@/lib/newsletterTokens";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Lejo vetëm destinacione tonat — shmang open redirect. Krahasohet host-i i analizuar,
// jo prefiksi i tekstit: "https://illyrianpixel.com@evil.com" do ta kalonte startsWith().
const ALLOWED_HOSTS = new Set(["illyrianpixel.com", "www.illyrianpixel.com", "wa.me"]);
const FALLBACK = "https://illyrianpixel.com";

function safeRedirectTarget(target: string): string {
  try {
    const url = new URL(target);
    if (url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname) && !url.username && !url.password) {
      return url.toString();
    }
  } catch {
    // URL e pavlefshme
  }
  return FALLBACK;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const broadcastId = url.searchParams.get("b") ?? "";
  const safeTarget = safeRedirectTarget(url.searchParams.get("u") ?? "");

  if (UUID_RE.test(broadcastId)) {
    try {
      // Vetëm me token HMAC të vlefshëm — redirect-i bëhet gjithsesi (edhe linqet e vjetra pa token)
      const email = readSignedEmail(url, "track");
      if (email) {
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
