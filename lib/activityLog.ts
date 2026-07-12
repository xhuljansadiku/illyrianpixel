// Historia e veprimeve në panel — çdo ndryshim regjistrohet që admini
// të mos harrojë çfarë ka bërë. Best-effort: dështimi i logut s'bllokon asgjë.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type ActivityEntity =
  | "blog"
  | "quote"
  | "recurring"
  | "project"
  | "task"
  | "faq"
  | "testimonial"
  | "portfolio"
  | "pricing"
  | "contact"
  | "newsletter"
  | "settings"
  | "auto"
  | "client"
  | "note"
  | "todo"
  | "expense";

export async function logActivity(entity: ActivityEntity, action: string, label: string): Promise<void> {
  try {
    await supabase.from("admin_activity").insert({ entity, action, label: label.slice(0, 500) });
  } catch {
    // injoro — historia s'duhet të prishë veprimin kryesor
  }
}
