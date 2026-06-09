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

export async function PATCH(req: Request) {
  const body = await req.json();
  const { ids, status } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë kontakt i zgjedhur." }, { status: 400 });
  }
  if (!ALLOWED_STATUS.includes(status)) {
    return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
  }

  const { error } = await supabase.from("contacts").update({ status }).in("id", ids);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await supabase.from("contact_logs").insert(
    ids.map((id: number) => ({ contact_id: id, action: "status", detail: STATUS_LABELS[status] }))
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë kontakt i zgjedhur." }, { status: 400 });
  }

  const { error } = await supabase.from("contacts").delete().in("id", ids);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
