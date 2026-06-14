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
  time_spent_minutes: number;
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
  tags: string[];
  created_at: string;
  updated_at: string;
  tasks: ProjectTask[];
};

// Paleta e ngjyrave për etiketat e projekteve — caktohet sipas hash-it të emrit, kështu që e njëjta etiketë merr gjithmonë të njëjtën ngjyrë.
const TAG_COLORS = [
  "border-blue-400/30 bg-blue-400/8 text-blue-300",
  "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
  "border-purple-400/30 bg-purple-400/8 text-purple-300",
  "border-pink-400/30 bg-pink-400/8 text-pink-300",
  "border-orange-400/30 bg-orange-400/8 text-orange-300",
  "border-cyan-400/30 bg-cyan-400/8 text-cyan-300",
  "border-red-400/30 bg-red-400/8 text-red-300",
];

export function tagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

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

// Checklist-a standarde që i bashkëngjitet çdo projekti të ri.
export const DEFAULT_PROJECT_TASKS: string[] = [
  "Takim nisjeje me klientin",
  "Mbledhja e materialeve (logo, tekste, foto)",
  "Dizajni i parë për miratim",
  "Zhvillimi",
  "Rishikim me klientin",
  "Lansimi + trajnimi",
];
