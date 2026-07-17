import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { maintenanceOfferEmailHtml } from "@/lib/adminEmails";
import { serviceCategoryBySlug } from "@/lib/serviceCategories";
import { applyOverridesToPackages } from "@/lib/pricingOverrides";
import { getPricingOverrides } from "@/lib/publicContent";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Dërgon ofertën e mirëmbajtjes një klienti ekzistues pa plan rekurrent.
export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().slice(0, 200);
  const name = String(body.name ?? "").trim().slice(0, 160);
  const contactId = body.contact_id ? String(body.contact_id) : null;

  if (!email || !name) {
    return NextResponse.json({ success: false, error: "Emri dhe email-i janë të detyrueshëm." }, { status: 400 });
  }

  const category = serviceCategoryBySlug("mirembajtja");
  if (!category) {
    return NextResponse.json({ success: false, error: "Katalogu i mirëmbajtjes nuk u gjet." }, { status: 500 });
  }
  const overrides = await getPricingOverrides().catch(() => ({}));
  const packages = applyOverridesToPackages("mirembajtja", category.packages, overrides);

  const { subject, html } = maintenanceOfferEmailHtml(name, packages);

  try {
    await resend.emails.send({
      from: NEWSLETTER_BRAND.from,
      to: email,
      replyTo: "info@illyrianpixel.com",
      subject,
      html,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Dërgimi i email-it dështoi." }, { status: 500 });
  }

  await logActivity("contact", "send", `Iu dërgua oferta e mirëmbajtjes ${name}`);
  if (contactId) {
    await supabase.from("contact_logs").insert({ contact_id: contactId, action: "email", detail: subject });
    await supabase
      .from("contact_notes")
      .insert({ contact_id: contactId, text: `🛡 U dërgua oferta e mirëmbajtjes — "${subject}"` });
  }

  return NextResponse.json({ success: true });
}
