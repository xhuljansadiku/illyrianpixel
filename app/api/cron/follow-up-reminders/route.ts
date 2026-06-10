import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND, followUpReminderEmailHtml } from "@/lib/newsletterEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + 2);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("id, name, email, phone, follow_up_date, assigned_to")
    .lte("follow_up_date", cutoffStr)
    .neq("status", "done")
    .order("follow_up_date", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ success: true, sent: false, count: 0 });
  }

  await resend.emails.send({
    from: NEWSLETTER_BRAND.from,
    to: process.env.CONTACT_TO_EMAIL!,
    subject: `${contacts.length} kontakt${contacts.length === 1 ? "" : "e"} për ndjekje së shpejti`,
    html: followUpReminderEmailHtml(contacts),
  });

  return NextResponse.json({ success: true, sent: true, count: contacts.length });
}
