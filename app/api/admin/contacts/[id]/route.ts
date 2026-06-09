import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  const update: Record<string, string | null> = {};
  const logs: { contact_id: number; action: string; detail: string | null }[] = [];

  if (typeof body.status === "string") {
    if (!ALLOWED_STATUS.includes(body.status)) {
      return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
    }
    update.status = body.status;
    logs.push({ contact_id: Number(params.id), action: "status", detail: STATUS_LABELS[body.status] });
  }

  if (typeof body.notes === "string") {
    update.notes = body.notes.slice(0, 4000);
  }

  if (typeof body.assigned_to === "string") {
    update.assigned_to = body.assigned_to.slice(0, 120) || null;
    logs.push({ contact_id: Number(params.id), action: "assigned_to", detail: update.assigned_to });
  }

  if (typeof body.follow_up_date === "string") {
    update.follow_up_date = body.follow_up_date || null;
    logs.push({ contact_id: Number(params.id), action: "follow_up_date", detail: update.follow_up_date });
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }

  const { error } = await supabase.from("contacts").update(update).eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (logs.length > 0) {
    await supabase.from("contact_logs").insert(logs);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("contacts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
