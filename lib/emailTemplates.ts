import { createClient } from "@supabase/supabase-js";
import type { EmailTemplateKey } from "@/lib/emailTemplateTypes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getEmailTemplate(key: EmailTemplateKey): Promise<{ subject: string; intro: string } | null> {
  const { data } = await supabase.from("email_templates").select("subject, intro").eq("key", key).maybeSingle();
  return data ?? null;
}

export * from "@/lib/emailTemplateTypes";
