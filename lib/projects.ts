// Tipet e përbashkëta për Projektet & Detyrat (client + server safe).

export type ProjectPhase = "discovery" | "design" | "development" | "review" | "launch";
export type ProjectStatus = "active" | "paused" | "done";

export type ProjectTask = {
  id: number;
  project_id: number;
  title: string;
  done: boolean;
  due_at: string | null;
  sort: number;
  created_at: string;
};

export type ProjectRecord = {
  id: number;
  contact_id: string | null;
  name: string;
  client_name: string | null;
  phase: ProjectPhase;
  status: ProjectStatus;
  deadline: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tasks: ProjectTask[];
};

export const PROJECT_PHASES: ProjectPhase[] = ["discovery", "design", "development", "review", "launch"];

export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  discovery: "Zbulim",
  design: "Dizajn",
  development: "Zhvillim",
  review: "Rishikim",
  launch: "Lansim",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Aktiv",
  paused: "Në pauzë",
  done: "Përfunduar",
};
