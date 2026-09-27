import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readSignedEmail } from "@/lib/newsletterTokens";
import { newsletterStatusPageHtml } from "@/lib/newsletterEmail";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Double opt-in — vetëm abonentët e konfirmuar marrin broadcast-e (GDPR)
export async function GET(req: Request) {
  const email = readSignedEmail(new URL(req.url), "confirm");

  let ok = false;
  if (email) {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .update({ confirmed_at: new Date().toISOString(), unsubscribed: false })
      .eq("email", email)
      .select("email");
    ok = !!data && data.length > 0;
    if (ok) await logActivity("newsletter", "update", `Abonim i konfirmuar: ${email}`);
  }

  return new NextResponse(
    ok
      ? newsletterStatusPageHtml("Abonimi u konfirmua", "Faleminderit! Do të merrni lajmet dhe ofertat e Illyrian Pixel.")
      : newsletterStatusPageHtml("Lidhje e pavlefshme", "Kjo lidhje konfirmimi nuk është e vlefshme ose ka skaduar."),
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
