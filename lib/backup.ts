// Backup javor i tabelave kryesore — eksporton çdo tabelë si CSV dhe i bashkon
// si attachments në një email. Thirret nga cron-i daily-automations, vetëm të hënën,
// për të mos shtuar një cron të tretë në Vercel (plani Hobby lejon maksimumi 2).
import type { SupabaseClient } from "@supabase/supabase-js";

export const BACKUP_TABLES = [
  "contacts",
  "contact_notes",
  "contact_logs",
  "quotes",
  "recurring_invoices",
  "projects",
  "project_tasks",
  "faqs",
  "testimonials",
  "portfolio_items",
  "pricing_overrides",
  "blog_posts",
  "newsletter_subscribers",
  "newsletter_broadcasts",
  "site_settings",
  "email_templates",
] as const;

export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  return lines.join("\n");
}

export type BackupAttachment = { filename: string; content: string };

export async function buildWeeklyBackup(
  supabase: SupabaseClient
): Promise<{ attachments: BackupAttachment[]; tableCounts: Record<string, number> }> {
  const attachments: BackupAttachment[] = [];
  const tableCounts: Record<string, number> = {};

  for (const table of BACKUP_TABLES) {
    const { data, error } = await supabase.from(table).select("*").limit(20000);
    if (error || !data) continue;
    tableCounts[table] = data.length;
    attachments.push({ filename: `${table}.csv`, content: rowsToCsv(data) });
  }

  return { attachments, tableCounts };
}

const BACKUP_BUCKET = "backups";

// Kopje e dytë e backup-it, e pavarur nga email-i — nëse llogaria e email-it
// rrezikohet ose humbet, backup-et mbeten të arritshme direkt te Supabase Storage.
export async function uploadBackupToStorage(
  supabase: SupabaseClient,
  dateStr: string,
  attachments: BackupAttachment[]
): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BACKUP_BUCKET)) {
    await supabase.storage.createBucket(BACKUP_BUCKET, { public: false });
  }

  for (const a of attachments) {
    await supabase.storage
      .from(BACKUP_BUCKET)
      .upload(`${dateStr}/${a.filename}`, Buffer.from(a.content, "utf-8"), {
        contentType: "text/csv",
        upsert: true,
      });
  }
}
