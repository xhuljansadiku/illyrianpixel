import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, expenses: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const description = String(body.description ?? "").trim().slice(0, 200);
  const amount = Number(body.amount);
  const expenseDate = typeof body.expense_date === "string" ? body.expense_date : "";

  if (!description) {
    return NextResponse.json({ success: false, error: "Përshkrimi është i detyrueshëm." }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ success: false, error: "Shuma duhet të jetë numër pozitiv." }, { status: 400 });
  }
  if (!expenseDate) {
    return NextResponse.json({ success: false, error: "Data është e detyrueshme." }, { status: 400 });
  }

  const record = {
    description,
    category: typeof body.category === "string" && body.category.trim() ? body.category.trim().slice(0, 60) : "Tjetër",
    amount,
    expense_date: expenseDate,
    notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) || null : null,
  };

  const { data, error } = await supabase.from("expenses").insert(record).select().single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  await logActivity("expense", "create", `U shtua shpenzimi "${description}" (€${amount})`);
  return NextResponse.json({ success: true, expense: data });
}
