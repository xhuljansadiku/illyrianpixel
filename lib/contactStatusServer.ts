// Kalimet automatike të statusit të kërkesës, të shkaktuara nga ofertat:
//  - oferta dërgohet  → "Ofertë e dërguar" (vetëm nga "E re" / "Në bisedë")
//  - oferta pranohet  → "Fituar"           (nga çdo status i hapur)
// Best-effort: nëse dështon, s'bllokon dërgimin/pranimin e ofertës.
import type { SupabaseClient } from "@supabase/supabase-js";
import { CONTACT_STATUS_LABELS, type ContactStatus } from "@/lib/contactStatus";

export async function advanceContactStatus(
  supabase: SupabaseClient,
  contactId: string | null | undefined,
  to: ContactStatus,
  fromAllowed: ContactStatus[]
): Promise<void> {
  if (!contactId) return;
  try {
    // "new" ruhet ndonjëherë si null te kontaktet e vjetra
    const statuses = fromAllowed.map((s) => `"${s}"`).join(",");
    const filter = fromAllowed.includes("new") ? `status.in.(${statuses}),status.is.null` : `status.in.(${statuses})`;
    const { data } = await supabase
      .from("contacts")
      .update({ status: to })
      .eq("id", contactId)
      .or(filter)
      .select("id");
    if (data && data.length > 0) {
      await supabase
        .from("contact_logs")
        .insert({ contact_id: contactId, action: "status", detail: `${CONTACT_STATUS_LABELS[to]} (automatikisht)` });
    }
  } catch {
    // statusi mund të ndryshohet edhe me dorë nga paneli
  }
}
