import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSiteSettings, SITE_SETTINGS_DEFAULTS, type SiteSettingsKey } from "@/lib/siteSettings";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const updates: { key: string; value: string }[] = [];

  for (const key of Object.keys(SITE_SETTINGS_DEFAULTS) as SiteSettingsKey[]) {
    if (typeof body[key] === "string") {
      updates.push({ key, value: body[key].trim().slice(0, 200) });
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(updates.map((u) => ({ ...u, updated_at: new Date().toISOString() })));

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await logActivity("settings", "update", `U përditësuan cilësimet: ${updates.map((u) => u.key).join(", ")}`);

  return NextResponse.json({ success: true });
}
