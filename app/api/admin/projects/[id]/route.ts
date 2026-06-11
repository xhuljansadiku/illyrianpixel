import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PROJECT_PHASES, PROJECT_PHASE_LABELS, PROJECT_STATUS_LABELS } from "@/lib/projects";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim().slice(0, 200);
    if (!name) {
      return NextResponse.json({ success: false, error: "Emri i projektit është i detyrueshëm." }, { status: 400 });
    }
    updates.name = name;
  }
  if (typeof body.client_name === "string") {
    updates.client_name = body.client_name.trim().slice(0, 160) || null;
  }
  if (typeof body.phase === "string" && PROJECT_PHASES.includes(body.phase as never)) {
    updates.phase = body.phase;
  }
  if (typeof body.status === "string" && ["active", "paused", "done"].includes(body.status)) {
    updates.status = body.status;
  }
  if (body.deadline !== undefined) {
    updates.deadline = typeof body.deadline === "string" && body.deadline ? body.deadline : null;
  }
  if (typeof body.notes === "string") {
    updates.notes = body.notes.trim().slice(0, 2000) || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "Asgjë për të përditësuar." }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (typeof body.phase === "string" && updates.phase) {
    await logActivity("project", "update", `Projekti "${data.name}" kaloi në fazën "${PROJECT_PHASE_LABELS[body.phase as keyof typeof PROJECT_PHASE_LABELS]}"`);
  } else if (typeof body.status === "string" && updates.status) {
    await logActivity("project", "update", `Projekti "${data.name}" u shënua "${PROJECT_STATUS_LABELS[body.status as keyof typeof PROJECT_STATUS_LABELS]}"`);
  } else {
    await logActivity("project", "update", `U editua projekti "${data.name}"`);
  }

  return NextResponse.json({ success: true, project: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("projects").delete().eq("id", params.id).select("name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (data?.[0]) {
    await logActivity("project", "delete", `U fshi projekti "${data[0].name}"`);
  }
  return NextResponse.json({ success: true });
}
