import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ClientPortalView from "@/components/ClientPortalView";
import type { ProjectRecord, ProjectTask } from "@/lib/projects";
import type { QuoteRecord } from "@/lib/quotes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portali i klientit | Illyrian Pixel",
  robots: { index: false, follow: false },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ClientPortalPage({ params }: { params: { token: string } }) {
  const { data: contact } = await supabase
    .from("contacts")
    .select("id, name, business_name")
    .eq("portal_token", params.token)
    .single();

  if (!contact) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60">Illyrian Pixel</p>
          <h1 className="font-display mt-4 text-3xl text-white">Kjo lidhje nuk është më e vlefshme.</h1>
          <p className="mt-3 text-sm text-white/50">
            Nëse mendoni se është gabim, na shkruani në{" "}
            <a href="mailto:info@illyrianpixel.com" className="text-accent underline-offset-4 hover:underline">
              info@illyrianpixel.com
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  const [{ data: projects }, { data: tasks }, { data: quotes }] = await Promise.all([
    supabase.from("projects").select("*").eq("contact_id", contact.id).order("created_at", { ascending: false }),
    supabase
      .from("project_tasks")
      .select("*")
      .order("sort", { ascending: true })
      .order("id", { ascending: true }),
    supabase.from("quotes").select("*").eq("contact_id", contact.id).order("created_at", { ascending: false }),
  ]);

  const projectList = (projects ?? []) as ProjectRecord[];
  const taskList = (tasks ?? []) as ProjectTask[];
  const projectsWithTasks = projectList.map((p) => ({
    ...p,
    tasks: taskList.filter((t) => t.project_id === p.id),
  }));

  return (
    <ClientPortalView
      contactName={contact.business_name || contact.name}
      projects={projectsWithTasks}
      quotes={(quotes ?? []) as QuoteRecord[]}
    />
  );
}
