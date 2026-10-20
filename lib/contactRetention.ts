import type { SupabaseClient } from "@supabase/supabase-js";

// Politika e privatësisë: "Të dhënat e kontaktit dhe komunikimit: deri në 2 vjet pas
// ndërprerjes së marrëdhënies" (Neni 5(1)(e) GDPR). Kontaktet s'kanë updated_at, ndaj
// marrëdhënia quhet e mbaruar kur s'ka asnjë shenjë aktiviteti brenda 2 vjetëve:
// krijimi, follow-up i planifikuar, shënim, ofertë/faturë e lidhur — dhe s'është klient.
export const CONTACT_RETENTION_DAYS = 730;

export type RetentionCandidate = { id: string; follow_up_date: string | null };

export function selectExpiredContacts(candidates: RetentionCandidate[], activeIds: Set<string>, cutoffIso: string): string[] {
  const cutoffDay = cutoffIso.slice(0, 10);
  return candidates
    .filter((c) => !activeIds.has(c.id))
    .filter((c) => !c.follow_up_date || c.follow_up_date < cutoffDay)
    .map((c) => c.id);
}

// Fshin kontaktet e skaduara (shënimet fshihen me cascade; ofertat/faturat mbeten —
// kanë emrin/email-in e tyre dhe ruhen 5 vjet si të dhëna financiare). Kthen sa u fshinë.
// Fail-safe: nëse ndonjë kontroll dështon, s'fshihet asgjë.
export async function purgeExpiredContacts(supabase: SupabaseClient, now = Date.now()): Promise<number> {
  const cutoff = new Date(now - CONTACT_RETENTION_DAYS * 86400000).toISOString();
  const { data: candidates, error } = await supabase
    .from("contacts")
    .select("id, follow_up_date")
    .lt("created_at", cutoff)
    .limit(200);
  if (error || !candidates || candidates.length === 0) return 0;

  const ids = candidates.map((c) => c.id as string);
  const [clients, quotes, notes] = await Promise.all([
    supabase.from("clients").select("contact_id").in("contact_id", ids),
    supabase.from("quotes").select("contact_id").in("contact_id", ids).gte("updated_at", cutoff),
    supabase.from("contact_notes").select("contact_id").in("contact_id", ids).gte("updated_at", cutoff),
  ]);
  if (clients.error || quotes.error || notes.error) return 0;

  const activeIds = new Set<string>();
  for (const row of [...(clients.data ?? []), ...(quotes.data ?? []), ...(notes.data ?? [])]) {
    if (row.contact_id) activeIds.add(row.contact_id as string);
  }

  const expired = selectExpiredContacts(candidates as RetentionCandidate[], activeIds, cutoff);
  if (expired.length === 0) return 0;
  const { error: deleteError } = await supabase.from("contacts").delete().in("id", expired);
  return deleteError ? 0 : expired.length;
}
