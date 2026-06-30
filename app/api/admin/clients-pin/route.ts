import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin.trim()).digest("hex");
}

/** GET — returns whether a PIN is already set. */
export async function GET() {
  const { data } = await supabase
    .from("site_settings")
    .select("key")
    .eq("key", "clients_pin_hash")
    .maybeSingle();

  return NextResponse.json({ success: true, hasPin: !!data });
}

/** POST — set or change the clients PIN. body: { pin: "1234" } */
export async function POST(req: Request) {
  const body = await req.json();
  const pin = String(body.pin ?? "").trim();

  if (pin.length < 4 || pin.length > 12 || !/^\d+$/.test(pin)) {
    return NextResponse.json(
      { success: false, error: "PIN-i duhet të jetë 4-12 shifra." },
      { status: 400 }
    );
  }

  await supabase
    .from("site_settings")
    .upsert({ key: "clients_pin_hash", value: hashPin(pin), updated_at: new Date().toISOString() });

  return NextResponse.json({ success: true });
}

/** DELETE — remove the PIN entirely (unlocks without PIN). */
export async function DELETE() {
  await supabase.from("site_settings").delete().eq("key", "clients_pin_hash");
  return NextResponse.json({ success: true });
}
