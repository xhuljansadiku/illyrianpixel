import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { replyEmailHtml } from "@/lib/adminEmails";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const subject = String(body.subject ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 10000);

  if (!subject || !message) {
    return NextResponse.json({ success: false, error: "Subjekti dhe mesazhi janë të detyrueshëm." }, { status: 400 });
  }

  const { data: contact, error } = await supabase
    .from("contacts")
    .select("id, name, email")
    .eq("id", params.id)
    .single();

  if (error || !contact) {
    return NextResponse.json({ success: false, error: "Kontakti nuk u gjet." }, { status: 404 });
  }

  try {
    await resend.emails.send({
      from: NEWSLETTER_BRAND.from,
      to: contact.email,
      replyTo: "info@illyrianpixel.com",
      subject,
      html: replyEmailHtml(subject, message, contact.name),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Dërgimi i email-it dështoi." }, { status: 500 });
  }

  // Regjistro në historik + si shënim që të mbetet gjurmë e plotë
  await supabase.from("contact_logs").insert({ contact_id: contact.id, action: "email", detail: subject });
  const { data: note } = await supabase
    .from("contact_notes")
    .insert({ contact_id: contact.id, text: `📧 Email i dërguar — "${subject}"\n\n${message}` })
    .select()
    .single();

  return NextResponse.json({ success: true, note });
}
