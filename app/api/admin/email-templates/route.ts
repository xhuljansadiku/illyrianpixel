import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { EMAIL_TEMPLATE_KEYS } from "@/lib/emailTemplates";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .in("key", EMAIL_TEMPLATE_KEYS as readonly string[]);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, templates: data });
}
