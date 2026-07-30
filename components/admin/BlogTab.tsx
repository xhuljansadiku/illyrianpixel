"use client";

import { useMemo, useState } from "react";
import { CARD, EmptyState, formatDate, useConfirm, useUndoToast } from "@/components/admin/ui";
import type { BlogPost, StaticPost } from "@/components/AdminDashboard";

const EMPTY_FORM = {
  slug: "",
  title: "",
  category: "",
  excerpt: "",
  date: "",
  content: "",
  scheduled: "",
  meta_description: "",
};

// ISO → vlerë për input datetime-local (në orën lokale)
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function BlogTab({
  posts,
  setPosts,
  staticPosts,
}: {
  posts: BlogPost[];
  setPosts: (p: BlogPost[]) => void;
  staticPosts: StaticPost[];
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [confirm, renderConfirm] = useConfirm();
  const { showUndo, renderUndoToast } = useUndoToast();

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    staticPosts.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [posts, staticPosts]);

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      date: post.date,
      content: post.content.join("\n\n"),
      scheduled: post.published === false ? isoToLocalInput(post.scheduled_for) : "",
      meta_description: post.meta_description ?? "",
    });
    setIsNewCategory(!categories.includes(post.category));
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsNewCategory(false);
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!form.title || !form.category || !form.excerpt || !form.date || (!editingId && !form.slug)) {
      setError("Plotëso të gjitha fushat e kërkuara.");
      return;
    }

    setSaving(true);
    try {
      const scheduledIso = form.scheduled ? new Date(form.scheduled).toISOString() : null;
      const willBeScheduled = !!scheduledIso && new Date(form.scheduled).getTime() > Date.now();

      if (editingId) {
        const res = await fetch(`/api/admin/blog/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            excerpt: form.excerpt,
            date: form.date,
            content: form.content,
            scheduled_for: scheduledIso,
            meta_description: form.meta_description,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setPosts(
          posts.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: form.title,
                  category: form.category,
                  excerpt: form.excerpt,
                  date: form.date,
                  content: form.content.split("\n\n").map((s) => s.trim()).filter(Boolean),
                  published: !willBeScheduled,
                  scheduled_for: willBeScheduled ? scheduledIso : null,
                  meta_description: form.meta_description.trim().slice(0, 160) || null,
                }
              : p
          )
        );
      } else {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, scheduled_for: scheduledIso }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setPosts([data.post, ...posts]);
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!(await confirm({ title: "Fshi artikullin", message: "Të fshihet ky artikull?", danger: true, confirmText: "Fshi" }))) return;
    const post = posts.find((p) => p.id === id);
    setPosts(posts.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
    showUndo(
      "Artikulli u fshi.",
      () => setPosts(post ? [post, ...posts.filter((p) => p.id !== id)] : posts),
      async () => {
        await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      }
    );
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkSetPublished = async (published: boolean) => {
    if (selected.size === 0) return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/blog/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action: "published", published }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map((p) => (selected.has(p.id) ? { ...p, published, scheduled_for: published ? null : p.scheduled_for } : p)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!(await confirm({ title: "Fshi artikujt", message: `Të fshihen ${selected.size} artikuj?`, danger: true, confirmText: "Fshi" }))) return;
    const ids = Array.from(selected);
    const removed = posts.filter((p) => ids.includes(p.id));
    const remaining = posts.filter((p) => !ids.includes(p.id));
    setPosts(remaining);
    setSelected(new Set());
    showUndo(
      `${ids.length} artikuj u fshinë.`,
      () => setPosts([...removed, ...remaining]),
      async () => {
        setBulkBusy(true);
        try {
          await fetch("/api/admin/blog/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids, action: "delete" }),
          });
        } finally {
          setBulkBusy(false);
        }
      }
    );
  };

  return (
    <div>
      {/* Form */}
      <div className={CARD + " mb-6 p-5"}>
        <p className="mb-4 font-display text-[1.1rem] font-semibold text-[var(--a-text)]">
          {editingId ? "Edito artikullin" : "Shto artikull të ri"}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Slug (p.sh. titulli-im)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            disabled={!!editingId}
            className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
          />
          <div>
            <select
              value={isNewCategory ? "__new__" : form.category}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setIsNewCategory(true);
                  setForm((f) => ({ ...f, category: "" }));
                } else {
                  setIsNewCategory(false);
                  setForm((f) => ({ ...f, category: e.target.value }));
                }
              }}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            >
              <option value="" disabled>
                Zgjedh kategorinë
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__new__">+ Kategori e re</option>
            </select>
            {isNewCategory && (
              <input
                type="text"
                placeholder="Emri i kategorisë së re"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="font-ui mt-2 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Titulli"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbledhje (excerpt)"
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <input
          type="text"
          placeholder="Data (p.sh. Qershor 2026)"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="font-ui mt-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <textarea
          placeholder="Përmbajtja — ndaj paragrafët me një rresht bosh"
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="font-ui mt-3 w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <div className="mt-3">
          <textarea
            placeholder="Meta description (SEO) — opsionale, shfaqet në Google"
            rows={2}
            maxLength={160}
            value={form.meta_description}
            onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
            className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
          />
          <p className="mt-1 text-right text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">
            {form.meta_description.length}/160 — nëse lihet bosh, përdoret përmbledhja
          </p>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
            ⏰ Planifiko publikimin (ops. — lëre bosh për publikim të menjëhershëm)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="datetime-local"
              value={form.scheduled}
              onChange={(e) => setForm((f) => ({ ...f, scheduled: e.target.value }))}
              className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            {form.scheduled && (
              <button
                onClick={() => setForm((f) => ({ ...f, scheduled: "" }))}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Hiq planifikimin
              </button>
            )}
          </div>
        </div>

        {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            onClick={submit}
            disabled={saving}
            className="font-ui rounded-[10px] bg-accent px-6 py-2.5 text-[12px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_20px_rgba(171,131,57,0.4)] disabled:opacity-50"
          >
            {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto artikullin"}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="font-ui rounded-[10px] border border-[var(--a-border)] px-6 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-[var(--a-text)]"
            >
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
        Artikuj nga admin ({posts.length})
      </p>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className={CARD + " mb-3 flex flex-wrap items-center gap-3 p-3"}>
          <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">{selected.size} të zgjedhur</span>
          <button
            onClick={() => bulkSetPublished(true)}
            disabled={bulkBusy}
            className="font-ui rounded-[10px] border border-emerald-400/30 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/10 disabled:opacity-50"
          >
            Publiko
          </button>
          <button
            onClick={() => bulkSetPublished(false)}
            disabled={bulkBusy}
            className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-50"
          >
            Çpubliko
          </button>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[10px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            Fshi
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-ui ml-auto text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] hover:text-[var(--a-text)]"
          >
            Pastro përzgjedhjen
          </button>
        </div>
      )}

      <div className="space-y-3">
        {posts.length === 0 && <EmptyState text="Ende nuk ka artikuj nga admin." />}
        {posts.map((p) => (
          <div key={p.id} className={CARD + " flex items-center justify-between gap-4 p-5"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[var(--a-text)]">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="mr-2.5 h-3.5 w-3.5 accent-[#ab8339]"
                  aria-label="Zgjidh artikullin"
                />
                {p.title}
                {p.published === false && p.scheduled_for && (
                  <span className="ml-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-300">
                    ⏰ Planifikuar · {formatDate(p.scheduled_for)}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(p)}
                className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
              >
                Edito
              </button>
              <button
                onClick={() => remove(p.id)}
                className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-red-400/70 transition-colors hover:border-red-400/50 hover:text-red-400"
              >
                Fshi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Static articles (from code) */}
      <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
        Artikuj ekzistues në kod ({staticPosts.length}) — vetëm lexim
      </p>
      <div className="space-y-3">
        {staticPosts.map((p) => (
          <div key={p.slug} className={CARD + " flex items-center justify-between gap-4 p-5 opacity-70"}>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[var(--a-text)]">{p.title}</p>
              <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">{p.category} · {p.date} · /blog/{p.slug}</p>
            </div>
            <span className="shrink-0 rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">
              Statik
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
        Artikujt statikë janë pjesë e kodit (lib/blogPosts.ts) dhe nuk mund të editohen apo fshihen nga paneli.
      </p>
      {renderConfirm()}
      {renderUndoToast()}
    </div>
  );
}
