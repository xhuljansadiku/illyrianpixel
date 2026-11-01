// Backup javor i tabelave kryesore — eksporton çdo tabelë si CSV dhe i bashkon
// si attachments në një email. Thirret nga cron-i daily-automations, vetëm të hënën,
// për të mos shtuar një cron të tretë në Vercel (plani Hobby lejon maksimumi 2).
import type { SupabaseClient } from "@supabase/supabase-js";

// E përbashkët për backup-in javor dhe shkarkimin nga paneli (/api/admin/export).
// Lihen jashtë qëllimisht admin_logins dhe rate_limits (vetëm log-e teknike).
export const BACKUP_TABLES = [
  "contacts",
  "contact_notes",
  "contact_logs",
  "quotes",
  "recurring_invoices",
  "clients",
  "expenses",
  "projects",
  "project_tasks",
  "project_feedback",
  "attachments",
  "faqs",
  "testimonials",
  "portfolio_items",
  "pricing_overrides",
  "blog_posts",
  "newsletter_subscribers",
  "newsletter_broadcasts",
  "newsletter_events",
  "site_settings",
  "email_templates",
  "admin_notes",
  "admin_todos",
  "admin_activity",
  "assistant_messages",
] as const;

type BackupTable = (typeof BACKUP_TABLES)[number];

// Tabelat pa kolonë "id" — renditen sipas çelësit të tyre primar
const ORDER_KEY: Partial<Record<BackupTable, string>> = {
  pricing_overrides: "key",
  email_templates: "key",
  site_settings: "key",
};

// Sekretet e 2FA dhe versioni i sesionit nuk dalin kurrë në backup — ky skedar
// shkon me email dhe shkarkohet, dhe me to kushdo do ta anashkalonte 2FA-në.
const SECRET_SETTING_PREFIXES = ["totp_", "admin_session"];

// Supabase kthen maksimumi 1000 rreshta për kërkesë — pa faqosje, backup-i
// do pritej në heshtje sapo një tabelë të kalonte këtë numër.
const PAGE_SIZE = 1000;

export async function fetchBackupTable(
  supabase: SupabaseClient,
  table: BackupTable
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(ORDER_KEY[table] ?? "id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  if (table === "site_settings") {
    return rows.filter((r) => !SECRET_SETTING_PREFIXES.some((p) => String(r.key).startsWith(p)));
  }
  return rows;
}

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
    let data: Record<string, unknown>[];
    try {
      data = await fetchBackupTable(supabase, table);
    } catch {
      continue;
    }
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
