import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.description === "string") {
    const description = body.description.trim().slice(0, 200);
    if (!description) {
      return NextResponse.json({ success: false, error: "Përshkrimi s'mund të jetë bosh." }, { status: 400 });
    }
    updates.description = description;
  }
  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Shuma duhet të jetë numër pozitiv." }, { status: 400 });
    }
    updates.amount = amount;
  }
  if (typeof body.category === "string") updates.category = body.category.trim().slice(0, 60) || "Tjetër";
  if (typeof body.expense_date === "string" && body.expense_date) updates.expense_date = body.expense_date;
  if (typeof body.notes === "string") updates.notes = body.notes.trim().slice(0, 2000) || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from("expenses").update(updates).eq("id", params.id).select().single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("expense", "update", `U përditësua shpenzimi "${data.description}"`);
  return NextResponse.json({ success: true, expense: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data } = await supabase.from("expenses").select("description").eq("id", params.id).maybeSingle();
  const { error } = await supabase.from("expenses").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("expense", "delete", `U fshi shpenzimi${data?.description ? ` "${data.description}"` : ""}`);
  return NextResponse.json({ success: true });
}
