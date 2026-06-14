import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { QUOTE_STATUS_LABELS } from "@/lib/quotes";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => Number.isFinite(Number(id))).map(Number) : [];
  if (ids.length === 0) {
    return NextResponse.json({ success: false, error: "Asnjë dokument i zgjedhur." }, { status: 400 });
  }

  if (body.action === "status") {
    if (!Object.keys(QUOTE_STATUS_LABELS).includes(body.status)) {
      return NextResponse.json({ success: false, error: "Status i pavlefshëm." }, { status: 400 });
    }
    const { error } = await supabase
      .from("quotes")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .in("id", ids);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await logActivity("quote", "update", `U përditësua statusi për ${ids.length} dokumente (${QUOTE_STATUS_LABELS[body.status as keyof typeof QUOTE_STATUS_LABELS]})`);
    return NextResponse.json({ success: true });
  }

  if (body.action === "delete") {
    const { error } = await supabase.from("quotes").delete().in("id", ids);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await logActivity("quote", "delete", `U fshinë ${ids.length} dokumente oferte/fature`);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Veprim i panjohur." }, { status: 400 });
}
