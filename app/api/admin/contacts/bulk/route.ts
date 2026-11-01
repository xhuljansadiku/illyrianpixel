import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CONTACT_STATUS_LABELS, LOST_REASON_LABELS, isContactStatus, isLostReason } from "@/lib/contactStatus";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function PATCH(req: Request) {
  const body = await req.json();
  const { ids, status } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë kontakt i zgjedhur." }, { status: 400 });
  }
  if (!isContactStatus(status)) {
    return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
  }

  const { error } = await supabase.from("contacts").update({ status }).in("id", ids);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const lostReason: unknown = body.lost_reason;
  const reason = status === "lost" && isLostReason(lostReason) ? LOST_REASON_LABELS[lostReason] : null;
  await supabase.from("contact_logs").insert(
    ids.flatMap((id: number) => [
      { contact_id: id, action: "status", detail: CONTACT_STATUS_LABELS[status] },
      ...(reason ? [{ contact_id: id, action: "lost_reason", detail: reason }] : []),
    ])
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { ids, permanent } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë kontakt i zgjedhur." }, { status: 400 });
  }

  const { error } = permanent === true
    ? await supabase.from("contacts").delete().in("id", ids)
    : await supabase.from("contacts").update({ deleted_at: new Date().toISOString() }).in("id", ids);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
