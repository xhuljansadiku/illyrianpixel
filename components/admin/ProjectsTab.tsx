"use client";

import { useMemo, useState } from "react";
import {
  PROJECT_PHASES,
  PROJECT_PHASE_LABELS,
  PROJECT_STATUS_LABELS,
  type ProjectRecord,
  type ProjectStatus,
} from "@/lib/projects";
import type { QuoteContact } from "@/components/admin/QuotesTab";

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[var(--a-border)] bg-[var(--a-card)] backdrop-blur-[12px]";

const INPUT =
  "font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  paused: "border-yellow-400/30 bg-yellow-400/8 text-yellow-300",
  done: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
};

type ProjectForm = {
  name: string;
  contact_id: string;
  client_name: string;
  phase: ProjectRecord["phase"];
  deadline: string;
  notes: string;
};

const EMPTY_FORM: ProjectForm = {
  name: "",
  contact_id: "",
  client_name: "",
  phase: "discovery",
  deadline: "",
  notes: "",
};

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ProjectsTab({
  initialProjects,
  contacts,
}: {
  initialProjects: ProjectRecord[];
  contacts: QuoteContact[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [newTask, setNewTask] = useState<Record<number, string>>({});

  const filtered = useMemo(
    () => projects.filter((p) => statusFilter === "all" || p.status === statusFilter),
    [projects, statusFilter]
  );

  const activeCount = projects.filter((p) => p.status === "active").length;
  const openTasks = projects.reduce((sum, p) => sum + p.tasks.filter((t) => !t.done).length, 0);

  const replaceProject = (updated: ProjectRecord) =>
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, tasks: updated.tasks ?? p.tasks } : p)));

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: ProjectRecord) => {
    setForm({
      name: p.name,
      contact_id: p.contact_id ?? "",
      client_name: p.client_name ?? "",
      phase: p.phase,
      deadline: p.deadline ?? "",
      notes: p.notes ?? "",
    });
    setEditingId(p.id);
    setError("");
    setShowForm(true);
  };

  const pickContact = (id: string) => {
    const c = contacts.find((x) => String(x.id) === id);
    setForm((f) => ({ ...f, contact_id: id, client_name: c ? c.name : f.client_name }));
  };

  const submit = async () => {
    if (!form.name.trim()) {
      setError("Emri i projektit është i detyrueshëm.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      contact_id: form.contact_id || null,
      client_name: form.client_name,
      phase: form.phase,
      deadline: form.deadline || null,
      notes: form.notes,
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/projects/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        replaceProject(data.project);
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setProjects((prev) => [data.project, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  const updateProject = async (p: ProjectRecord, updates: Record<string, unknown>) => {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) replaceProject(data.project);
    } finally {
      setBusyId(null);
    }
  };

  const removeProject = async (p: ProjectRecord) => {
    if (!confirm(`Të fshihet projekti "${p.name}" me të gjitha detyrat e tij?`)) return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } finally {
      setBusyId(null);
    }
  };

  const addTask = async (p: ProjectRecord) => {
    const title = (newTask[p.id] ?? "").trim();
    if (!title) return;
    const res = await fetch(`/api/admin/projects/${p.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, sort: p.tasks.length }),
    });
    const data = await res.json();
    if (data.success) {
      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, tasks: [...x.tasks, data.task] } : x)));
      setNewTask((n) => ({ ...n, [p.id]: "" }));
    }
  };

  const toggleTask = async (p: ProjectRecord, taskId: number, done: boolean) => {
    // optimist — kthehet mbrapsht në dështim
    setProjects((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, tasks: x.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)) } : x
      )
    );
    const res = await fetch(`/api/admin/project-tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    const data = await res.json();
    if (!data.success) {
      setProjects((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, tasks: x.tasks.map((t) => (t.id === taskId ? { ...t, done: !done } : t)) } : x
        )
      );
    }
  };

  const removeTask = async (p: ProjectRecord, taskId: number) => {
    const res = await fetch(`/api/admin/project-tasks/${taskId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProjects((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, tasks: x.tasks.filter((t) => t.id !== taskId) } : x))
      );
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{activeCount}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Projekte aktive</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{openTasks}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Detyra të hapura</p>
        </div>
        <div className={CARD + " p-5"}>
          <p className="font-display text-[2rem] font-bold text-[var(--a-text)]">{projects.length}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Projekte gjithsej</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          onClick={openCreate}
          className="font-ui rounded-[2px] bg-accent px-5 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)]"
        >
          ＋ Projekt i ri
        </button>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={INPUT}>
          <option value="all">Çdo status</option>
          {Object.entries(PROJECT_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className={CARD + " mb-6 p-5"}>
          <p className="mb-4 font-display text-[1.1rem] font-semibold text-[var(--a-text)]">
            {editingId ? "Edito projektin" : "Projekt i ri"}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Emri i projektit * (p.sh. Website për Hotel Adriatik)"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={INPUT + " w-full"}
            />
            <select value={form.contact_id} onChange={(e) => pickContact(e.target.value)} className={INPUT + " w-full"}>
              <option value="">— Lidh me kontakt (ops.) —</option>
              {contacts.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.name} · {c.email}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Emri i klientit"
              value={form.client_name}
              onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
              className={INPUT + " w-full"}
            />
            <div>
              <select
                value={form.phase}
                onChange={(e) => setForm((f) => ({ ...f, phase: e.target.value as ProjectForm["phase"] }))}
                className={INPUT + " w-full"}
              >
                {PROJECT_PHASES.map((ph) => (
                  <option key={ph} value={ph}>{PROJECT_PHASE_LABELS[ph]}</option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className={INPUT + " w-full"}
              title="Afati i projektit"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Shënime (ops.)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={INPUT + " mt-3 w-full resize-none"}
          />

          {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={submit}
              disabled={saving}
              className="font-ui rounded-[2px] bg-accent px-6 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)] disabled:opacity-50"
            >
              {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Krijo projektin"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="font-ui rounded-[2px] border border-[var(--a-border)] px-6 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              Anulo
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-[13px] text-[rgb(var(--a-text-rgb)/0.35)]">
            Asnjë projekt ende. Krijo të parin me butonin lart.
          </p>
        )}
        {filtered.map((p) => {
          const doneTasks = p.tasks.filter((t) => t.done).length;
          const progress = p.tasks.length > 0 ? Math.round((doneTasks / p.tasks.length) * 100) : 0;
          const phaseIdx = PROJECT_PHASES.indexOf(p.phase);
          return (
            <div key={p.id} className={CARD + " p-5"}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display font-semibold text-[var(--a-text)]">{p.name}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_COLORS[p.status]}`}>
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
                    {p.client_name ? `${p.client_name} · ` : ""}
                    {p.deadline ? `afati: ${formatDay(p.deadline)}` : "pa afat"}
                    {p.tasks.length > 0 ? ` · ${doneTasks}/${p.tasks.length} detyra` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={p.status}
                    disabled={busyId === p.id}
                    onChange={(e) => updateProject(p, { status: e.target.value })}
                    className={INPUT + " disabled:opacity-50"}
                  >
                    {Object.entries(PROJECT_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fazat */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {PROJECT_PHASES.map((ph, idx) => (
                  <button
                    key={ph}
                    onClick={() => updateProject(p, { phase: ph })}
                    disabled={busyId === p.id}
                    title={PROJECT_PHASE_LABELS[ph]}
                    className={`font-ui rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors disabled:opacity-50 ${
                      idx < phaseIdx
                        ? "border border-accent/25 bg-accent/5 text-accent/55"
                        : idx === phaseIdx
                          ? "border border-accent bg-accent/15 text-accent"
                          : "border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.35)] hover:text-[rgb(var(--a-text-rgb)/0.7)]"
                    }`}
                  >
                    {idx < phaseIdx ? "✓ " : ""}{PROJECT_PHASE_LABELS[ph]}
                  </button>
                ))}
              </div>

              {/* Progresi i detyrave */}
              {p.tasks.length > 0 && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgb(var(--a-text-rgb)/0.08)]">
                  <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}

              {/* Detyrat */}
              <div className="mt-3 space-y-1.5">
                {p.tasks.map((t) => (
                  <div key={t.id} className="group flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) => toggleTask(p, t.id, e.target.checked)}
                      className="h-3.5 w-3.5 accent-[#ab8339]"
                    />
                    <span className={`flex-1 text-[12px] ${t.done ? "text-[rgb(var(--a-text-rgb)/0.3)] line-through" : "text-[rgb(var(--a-text-rgb)/0.75)]"}`}>
                      {t.title}
                      {t.due_at ? <span className="ml-2 text-[10px] text-[rgb(var(--a-text-rgb)/0.35)]">({formatDay(t.due_at)})</span> : null}
                    </span>
                    <button
                      onClick={() => removeTask(p, t.id)}
                      className="text-[13px] text-red-400/0 transition-colors group-hover:text-red-400/60 hover:!text-red-400"
                      aria-label="Fshi detyrën"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="＋ Detyrë e re…"
                    value={newTask[p.id] ?? ""}
                    onChange={(e) => setNewTask((n) => ({ ...n, [p.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTask(p);
                    }}
                    className={INPUT + " flex-1"}
                  />
                  <button
                    onClick={() => addTask(p)}
                    className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-2 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                  >
                    Shto
                  </button>
                </div>
              </div>

              {p.notes && (
                <p className="mt-3 whitespace-pre-line border-t border-[var(--a-border)] pt-3 text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">
                  {p.notes}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--a-border)] pt-3">
                <button
                  onClick={() => openEdit(p)}
                  className="font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                >
                  Edito
                </button>
                <button
                  onClick={() => removeProject(p)}
                  disabled={busyId === p.id}
                  className="font-ui rounded-[2px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                >
                  Fshi
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
