import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { EMAIL_TEMPLATE_KEYS, type EmailTemplateKey } from "@/lib/emailTemplates";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!EMAIL_TEMPLATE_KEYS.includes(key as EmailTemplateKey)) {
    return NextResponse.json({ success: false, error: "Shabllon i panjohur." }, { status: 400 });
  }

  const body = await req.json();
  if (typeof body.subject !== "string" || typeof body.intro !== "string") {
    return NextResponse.json({ success: false, error: "Subjekti dhe teksti janë të detyrueshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("email_templates")
    .update({ subject: body.subject.trim(), intro: body.intro.trim(), updated_at: new Date().toISOString() })
    .eq("key", key)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await logActivity("settings", "update", `U përditësua shablloni i email-it "${key}"`);
  return NextResponse.json({ success: true, template: data });
}
