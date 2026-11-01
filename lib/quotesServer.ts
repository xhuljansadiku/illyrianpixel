// Helper server-side për krijim oferte/fature me numër automatik.
// Përdoret nga POST /api/admin/quotes dhe nga cron-i i faturave të rikurruese.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuoteItem } from "@/lib/quotes";

export type NewQuoteFields = {
  kind: "quote" | "invoice";
  contact_id: string | null;
  client_name: string;
  client_email: string | null;
  client_business: string | null;
  items: QuoteItem[];
  discount: number;
  tax_rate: number;
  notes: string | null;
  issued_at?: string;
  due_at: string | null;
  status?: "draft" | "sent";
};

export async function insertQuoteWithNumber(
  supabase: SupabaseClient,
  fields: NewQuoteFields
): Promise<{ quote?: Record<string, unknown>; error?: string }> {
  const prefix = fields.kind === "invoice" ? "FA" : "OF";
  const year = new Date().getFullYear();

  // Numri i ri = më i madhi ekzistues + 1 (përfshirë ato në kosh). Më parë merrej
  // numërimi i rreshtave: pas një fshirjeje të përhershme numri përsëritej — e
  // papranueshme për faturat — dhe me shumë boshllëqe krijimi dështonte fare.
  // Krahasim numerik, jo alfabetik ("1000" < "999" si tekst).
  const { data: existing, error: numbersError } = await supabase
    .from("quotes")
    .select("number")
    .like("number", `${prefix}-${year}-%`);
  if (numbersError) return { error: numbersError.message };
  const maxN = (existing ?? []).reduce((max, row) => {
    const n = parseInt(String(row.number).split("-")[2] ?? "", 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);

  // Provo disa numra radhazi në rast përplasjeje (dy krijime njëkohësisht)
  let lastError = "Nuk u gjenerua dot numri.";
  for (let n = maxN + 1; n <= maxN + 5; n++) {
    const number = `${prefix}-${year}-${String(n).padStart(3, "0")}`;
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        number,
        kind: fields.kind,
        contact_id: fields.contact_id,
        client_name: fields.client_name,
        client_email: fields.client_email,
        client_business: fields.client_business,
        items: fields.items,
        discount: fields.discount,
        tax_rate: fields.tax_rate,
        notes: fields.notes,
        ...(fields.issued_at ? { issued_at: fields.issued_at } : {}),
        due_at: fields.due_at,
        ...(fields.status ? { status: fields.status } : {}),
      })
      .select()
      .single();

    if (!error) return { quote: data };
    if (error.code !== "23505") return { error: error.message };
    lastError = error.message;
  }
  return { error: lastError };
}
