import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PROJECT_PHASES, DEFAULT_PROJECT_TASKS } from "@/lib/projects";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("project_tasks").select("*").order("sort", { ascending: true }).order("id", { ascending: true }),
  ]);

  if (projectsRes.error) {
    return NextResponse.json({ success: false, error: projectsRes.error.message }, { status: 500 });
  }

  const tasks = tasksRes.data ?? [];
  const projects = (projectsRes.data ?? []).map((p) => ({
    ...p,
    tasks: tasks.filter((t) => t.project_id === p.id),
  }));

  return NextResponse.json({ success: true, projects });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim().slice(0, 200);

  if (!name) {
    return NextResponse.json({ success: false, error: "Emri i projektit është i detyrueshëm." }, { status: 400 });
  }

  const phase = PROJECT_PHASES.includes(body.phase) ? body.phase : "discovery";

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      contact_id: typeof body.contact_id === "string" && body.contact_id ? body.contact_id : null,
      client_name: String(body.client_name ?? "").trim().slice(0, 160) || null,
      phase,
      deadline: typeof body.deadline === "string" && body.deadline ? body.deadline : null,
      notes: String(body.notes ?? "").trim().slice(0, 2000) || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const { data: tasks } = await supabase
    .from("project_tasks")
    .insert(DEFAULT_PROJECT_TASKS.map((title, i) => ({ project_id: data.id, title, sort: i })))
    .select();

  await logActivity("project", "create", `U krijua projekti "${name}"`);
  return NextResponse.json({ success: true, project: { ...data, tasks: tasks ?? [] } });
}
