import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, clients: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim().slice(0, 200);

  if (!name) {
    return NextResponse.json({ success: false, error: "Emri i klientit është i detyrueshëm." }, { status: 400 });
  }

  const record = {
    contact_id: body.contact_id ? String(body.contact_id) : null,
    name,
    business_name: typeof body.business_name === "string" ? body.business_name.trim().slice(0, 200) || null : null,
    email: typeof body.email === "string" ? body.email.trim().slice(0, 200) || null : null,
    phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 60) || null : null,
    service: typeof body.service === "string" ? body.service.trim().slice(0, 120) || null : null,
    since_date: typeof body.since_date === "string" && body.since_date ? body.since_date : null,
    notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) || null : null,
  };

  const { data, error } = await supabase.from("clients").insert(record).select().single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("client", "create", `U shtua klienti "${name}"`);
  return NextResponse.json({ success: true, client: data });
}
