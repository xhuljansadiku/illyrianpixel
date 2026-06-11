import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_STATUS = ["new", "in-progress", "done"];
const STATUS_LABELS: Record<string, string> = {
  new: "I ri",
  "in-progress": "Në proces",
  done: "Mbyllur",
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const update: Record<string, string | string[] | null> = {};
  // contacts.id është uuid — kalohet si string, jo Number()
  const logs: { contact_id: string; action: string; detail: string | null }[] = [];

  if (typeof body.status === "string") {
    if (!ALLOWED_STATUS.includes(body.status)) {
      return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
    }
    update.status = body.status;
    logs.push({ contact_id: params.id, action: "status", detail: STATUS_LABELS[body.status] });
  }

  if (typeof body.notes === "string") {
    update.notes = body.notes.slice(0, 4000);
  }

  if (typeof body.assigned_to === "string") {
    const assignedTo = body.assigned_to.slice(0, 120) || null;
    update.assigned_to = assignedTo;
    logs.push({ contact_id: params.id, action: "assigned_to", detail: assignedTo });
  }

  if (typeof body.follow_up_date === "string") {
    const followUpDate = body.follow_up_date || null;
    update.follow_up_date = followUpDate;
    logs.push({ contact_id: params.id, action: "follow_up_date", detail: followUpDate });
  }

  if (Array.isArray(body.tags)) {
    update.tags = body.tags
      .filter((t: unknown) => typeof t === "string")
      .map((t: string) => t.trim().slice(0, 30))
      .filter(Boolean)
      .slice(0, 10);
  }

  if (body.value !== undefined) {
    const value = body.value === null || body.value === "" ? null : Number(body.value);
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 10_000_000)) {
      return NextResponse.json({ success: false, error: "Vlerë e pavlefshme." }, { status: 400 });
    }
    (update as Record<string, unknown>).value = value;
    logs.push({ contact_id: params.id, action: "value", detail: value === null ? null : `€${value}` });
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { data, error } = await supabase.from("contacts").update(update).eq("id", params.id).select("name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (logs.length > 0) {
    await supabase.from("contact_logs").insert(logs);
  }

  const contactName = data?.[0]?.name ?? "kontakti";
  if (typeof body.status === "string") {
    await logActivity("contact", "update", `Kontakti ${contactName} kaloi në "${STATUS_LABELS[body.status]}"`);
  } else if (typeof body.follow_up_date === "string" && body.follow_up_date) {
    await logActivity("contact", "update", `U vendos follow-up për ${contactName} më ${body.follow_up_date}`);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("contacts").delete().eq("id", params.id).select("name, email");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("contact", "delete", `U fshi kontakti ${data[0].name} (${data[0].email})`);
  }

  return NextResponse.json({ success: true });
}
