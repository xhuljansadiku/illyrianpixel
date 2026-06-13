import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateTotpSecret, totpUri, verifyTotp, generateRecoveryCodes, hashRecoveryCode } from "@/lib/totp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Ruhen në site_settings por JASHTË SITE_SETTINGS_DEFAULTS,
// kështu nuk ekspozohen kurrë nga GET/PATCH /api/admin/settings.
const KEYS = ["totp_secret", "totp_enabled", "totp_secret_pending", "totp_recovery_codes", "totp_trusted_devices"] as const;

async function storeRecoveryCodes(): Promise<string[]> {
  const codes = generateRecoveryCodes();
  const hashed = codes.map((c) => ({ hash: hashRecoveryCode(c), used: false }));
  await upsertSetting("totp_recovery_codes", JSON.stringify(hashed));
  return codes;
}

async function readTotpSettings(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [...KEYS]);
  const result: Record<string, string> = {};
  for (const row of data ?? []) result[row.key] = row.value;
  return result;
}

async function upsertSetting(key: string, value: string) {
  await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
}

async function deleteSettings(keys: string[]) {
  await supabase.from("site_settings").delete().in("key", keys);
}

export async function GET() {
  const settings = await readTotpSettings();
  return NextResponse.json({ success: true, enabled: settings.totp_enabled === "1" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const action = String(body.action ?? "");
  const settings = await readTotpSettings();

  if (action === "setup") {
    if (settings.totp_enabled === "1") {
      return NextResponse.json({ success: false, error: "2FA është tashmë aktiv." }, { status: 400 });
    }
    const secret = generateTotpSecret();
    await upsertSetting("totp_secret_pending", secret);
    return NextResponse.json({ success: true, secret, uri: totpUri(secret) });
  }

  if (action === "enable") {
    const pending = settings.totp_secret_pending;
    if (!pending) {
      return NextResponse.json({ success: false, error: "Fillo konfigurimin së pari." }, { status: 400 });
    }
    if (!verifyTotp(pending, String(body.token ?? ""))) {
      return NextResponse.json({ success: false, error: "Kod i pavlefshëm. Provo përsëri." }, { status: 400 });
    }
    await upsertSetting("totp_secret", pending);
    await upsertSetting("totp_enabled", "1");
    await deleteSettings(["totp_secret_pending"]);
    const recoveryCodes = await storeRecoveryCodes();
    return NextResponse.json({ success: true, enabled: true, recoveryCodes });
  }

  if (action === "disable") {
    if (settings.totp_enabled !== "1" || !settings.totp_secret) {
      return NextResponse.json({ success: false, error: "2FA nuk është aktiv." }, { status: 400 });
    }
    if (!verifyTotp(settings.totp_secret, String(body.token ?? ""))) {
      return NextResponse.json({ success: false, error: "Kod i pavlefshëm." }, { status: 400 });
    }
    await deleteSettings(["totp_secret", "totp_enabled", "totp_secret_pending", "totp_recovery_codes", "totp_trusted_devices"]);
    return NextResponse.json({ success: true, enabled: false });
  }

  if (action === "regenerate_codes") {
    if (settings.totp_enabled !== "1" || !settings.totp_secret) {
      return NextResponse.json({ success: false, error: "2FA nuk është aktiv." }, { status: 400 });
    }
    if (!verifyTotp(settings.totp_secret, String(body.token ?? ""))) {
      return NextResponse.json({ success: false, error: "Kod i pavlefshëm." }, { status: 400 });
    }
    const recoveryCodes = await storeRecoveryCodes();
    return NextResponse.json({ success: true, recoveryCodes });
  }

  return NextResponse.json({ success: false, error: "Veprim i panjohur." }, { status: 400 });
}
