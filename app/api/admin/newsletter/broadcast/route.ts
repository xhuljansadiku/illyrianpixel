import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchBroadcastRecipients, sendBroadcast } from "@/lib/newsletterBroadcast";
import { getSiteSettings } from "@/lib/siteSettings";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const subject = String(body.subject ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 10000);

  if (!subject || !message) {
    return NextResponse.json({ success: false, error: "Subjekti dhe mesazhi janë të detyrueshëm." }, { status: 400 });
  }

  const scheduledFor =
    typeof body.scheduled_for === "string" && body.scheduled_for ? new Date(body.scheduled_for) : null;
  const isScheduled = !!scheduledFor && !Number.isNaN(scheduledFor.getTime()) && scheduledFor.getTime() > Date.now();

  let recipients: string[];
  try {
    recipients = await fetchBroadcastRecipients(supabase);
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
  if (recipients.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë subscriber aktiv i konfirmuar." }, { status: 400 });
  }

  if (isScheduled) {
    const { error: insertError } = await supabase.from("newsletter_broadcasts").insert({
      subject,
      message,
      sent_count: recipients.length,
      scheduled_for: scheduledFor!.toISOString(),
      sent_at: null,
    });
    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }
    await logActivity(
      "newsletter",
      "schedule",
      `U planifikua broadcast "${subject}" për ${scheduledFor!.toLocaleString("sq-AL")}`
    );
    return NextResponse.json({ success: true, scheduled: true, sent: 0 });
  }

  const { whatsapp_number } = await getSiteSettings();
  const whatsappUrl = `https://wa.me/${whatsapp_number}`;

  // Regjistro broadcast-in që open/click të lidhen me të
  const { data: broadcast } = await supabase
    .from("newsletter_broadcasts")
    .insert({ subject, message, sent_count: 0, sent_at: new Date().toISOString() })
    .select("id")
    .single();

  const result = await sendBroadcast({ subject, message, whatsappUrl, broadcastId: broadcast?.id, recipients });

  if (broadcast) {
    if (result.sent === 0) {
      // Asnjë s'u dërgua — mos e lër në histori si broadcast i dërguar
      await supabase.from("newsletter_broadcasts").delete().eq("id", broadcast.id);
    } else {
      await supabase.from("newsletter_broadcasts").update({ sent_count: result.sent }).eq("id", broadcast.id);
    }
  }

  if (result.sent === 0) {
    return NextResponse.json(
      { success: false, error: `Dërgimi dështoi: ${result.error ?? "gabim i panjohur"}` },
      { status: 502 }
    );
  }

  await logActivity(
    "newsletter",
    "send",
    `U dërgua broadcast "${subject}" te ${result.sent} abonentë${result.failed ? ` (${result.failed} dështuan)` : ""}`
  );

  return NextResponse.json({ success: true, sent: result.sent, failed: result.failed });
}
