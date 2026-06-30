import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** POST — verify PIN. body: { pin: "1234" }. Returns { success: true/false }. */
export async function POST(req: Request) {
  const body = await req.json();
  const pin = String(body.pin ?? "").trim();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "clients_pin_hash")
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ success: false, error: "Asnjë PIN i vendosur." }, { status: 400 });
  }

  const expected = data.value as string;
  const given = crypto.createHash("sha256").update(pin).digest("hex");
  const match = crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(given, "hex"));

  return NextResponse.json({ success: match, error: match ? undefined : "PIN i gabuar." });
}
