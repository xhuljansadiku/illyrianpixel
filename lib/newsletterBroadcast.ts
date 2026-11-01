// Dërgimi i një broadcast-i — i përbashkët për dërgimin e menjëhershëm nga paneli
// dhe për broadcast-et e planifikuara që i dërgon cron-i daily-automations.
import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, broadcastEmailHtml } from "@/lib/newsletterEmail";
import { unsubscribeHeaders } from "@/lib/newsletterTokens";

const resend = new Resend(process.env.RESEND_API_KEY);

const BATCH_SIZE = 100;
// Supabase kthen maksimumi 1000 rreshta për kërkesë
const PAGE_SIZE = 1000;

// Vetëm abonentët aktivë me double opt-in të konfirmuar, të gjithë (jo vetëm 1000 të parët)
export async function fetchBroadcastRecipients(supabase: SupabaseClient): Promise<string[]> {
  const emails: string[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("unsubscribed", false)
      .not("confirmed_at", "is", null)
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    emails.push(...(data ?? []).map((s) => s.email as string));
    if (!data || data.length < PAGE_SIZE) return emails;
  }
}

// Kthen sa email-e u pranuan realisht nga Resend — më parë gabimet e Resend
// injoroheshin dhe paneli raportonte "u dërgua" edhe kur s'kishte shkuar asnjë.
export async function sendBroadcast(opts: {
  subject: string;
  message: string;
  whatsappUrl: string;
  broadcastId?: string;
  recipients: string[];
}): Promise<{ sent: number; failed: number; error: string | null }> {
  let sent = 0;
  let failed = 0;
  let lastError: string | null = null;

  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    const chunk = opts.recipients.slice(i, i + BATCH_SIZE);
    try {
      const { error } = await resend.batch.send(
        chunk.map((email) => ({
          from: NEWSLETTER_BRAND.from,
          to: email,
          subject: opts.subject,
          html: broadcastEmailHtml(
            opts.subject,
            opts.message,
            opts.whatsappUrl,
            opts.broadcastId ? { broadcastId: opts.broadcastId, email } : undefined
          ),
          headers: unsubscribeHeaders(email),
        }))
      );
      if (error) {
        failed += chunk.length;
        lastError = error.message;
      } else {
        sent += chunk.length;
      }
    } catch (err) {
      failed += chunk.length;
      lastError = (err as Error).message;
    }
  }

  return { sent, failed, error: lastError };
}
