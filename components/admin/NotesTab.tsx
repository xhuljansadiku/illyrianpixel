"use client";

import { useEffect, useRef, useState } from "react";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, EmptyState, SkeletonRows, useToasts, useConfirm } from "@/components/admin/ui";

type Note = {
  id: number;
  title: string | null;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export default function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Note | null>(null);
  const [viewing, setViewing] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const addTitle = useRef<HTMLInputElement>(null);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    if (!viewing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [viewing]);

  useEffect(() => {
    fetch("/api/admin/notes")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNotes(d.notes); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showAdd) setTimeout(() => addTitle.current?.focus(), 50);
  }, [showAdd]);

  const reset = () => { setForm({ title: "", content: "" }); setShowAdd(false); setEditing(null); };

  const handleAdd = async () => {
    if (!form.content.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title || null, content: form.content }),
    }).then((r) => r.json());
    setSaving(false);
    if (res.success) { setNotes((n) => [res.note, ...n]); reset(); pushToast("Shënimi u shtua.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const handleSaveEdit = async () => {
    if (!editing || !form.content.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/notes/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title || null, content: form.content }),
    }).then((r) => r.json());
    setSaving(false);
    if (res.success) { setNotes((n) => n.map((x) => (x.id === editing.id ? res.note : x))); reset(); pushToast("U ruajt.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const togglePin = async (note: Note) => {
    const res = await fetch(`/api/admin/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !note.pinned }),
    }).then((r) => r.json());
    if (res.success) setNotes((n) => n.map((x) => (x.id === note.id ? res.note : x)));
  };

  const handleDelete = async (note: Note) => {
    const ok = await confirm({ title: "Fshi shënimin", message: `"${note.title ?? note.content.slice(0, 40)}" do të fshihet përgjithmonë.`, danger: true, confirmText: "Fshi" });
    if (!ok) return;
    const res = await fetch(`/api/admin/notes/${note.id}`, { method: "DELETE" }).then((r) => r.json());
    if (res.success) { setNotes((n) => n.filter((x) => x.id !== note.id)); pushToast("U fshi.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const startEdit = (note: Note) => { setEditing(note); setForm({ title: note.title ?? "", content: note.content }); setShowAdd(false); };

  return (
    <div className="space-y-4">
      {renderToasts()}
      {renderConfirm()}

      {viewing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setViewing(null); }}
        >
          <div role="dialog" aria-modal="true" className={CARD + " w-full max-w-lg max-h-[80vh] overflow-y-auto p-5"}>
            <div className="flex items-start justify-between gap-3">
              {viewing.title && <h3 className="font-ui text-[13px] font-semibold text-[var(--a-text)]">{viewing.title}</h3>}
              <button onClick={() => setViewing(null)} className="shrink-0 text-[13px] opacity-60 hover:opacity-100 transition-opacity">✕</button>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.8)] whitespace-pre-wrap">{viewing.content}</p>
            <p className="mt-4 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
              {new Date(viewing.updated_at).toLocaleDateString("sq-AL")}
            </p>
          </div>
        </div>
      )}

      {/* Add button */}
      {!showAdd && !editing && (
        <button onClick={() => setShowAdd(true)} className={BTN_GOLD}>+ Shënim i ri</button>
      )}

      {/* Add / Edit form */}
      {(showAdd || editing) && (
        <div className={CARD + " p-4 space-y-3"}>
          <p className="font-ui text-[11px] font-semibold text-accent">{editing ? "Ndrysho shënimin" : "Shënim i ri"}</p>
          <input
            ref={addTitle}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Titulli (opsional)"
            className={INPUT + " w-full"}
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Përmbajtja…"
            rows={4}
            className={INPUT + " w-full resize-none"}
          />
          <div className="flex gap-2">
            <button onClick={editing ? handleSaveEdit : handleAdd} disabled={saving || !form.content.trim()} className={BTN_GOLD}>
              {saving ? "Duke ruajtur…" : editing ? "Ruaj" : "Shto"}
            </button>
            <button onClick={reset} className={BTN_PLAIN}>Anulo</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? <SkeletonRows rows={3} /> : notes.length === 0 ? (
        <EmptyState text="Nuk ka shënime ende." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className={CARD + " p-4 flex flex-col gap-2"}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {note.title && <p className="font-ui text-[12px] font-semibold text-[var(--a-text)] truncate">{note.title}</p>}
                  <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.75)] whitespace-pre-wrap line-clamp-5">{note.content}</p>
                </div>
                <button
                  onClick={() => togglePin(note)}
                  title={note.pinned ? "Hiq pin" : "Pin"}
                  className="shrink-0 text-[15px] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {note.pinned ? "📌" : "📍"}
                </button>
              </div>
              <div className="flex gap-2 mt-auto pt-1">
                <button onClick={() => setViewing(note)} className={BTN_PLAIN + " text-[10px] px-2 py-1"}>Shiko</button>
                <button onClick={() => startEdit(note)} className={BTN_PLAIN + " text-[10px] px-2 py-1"}>Ndrysho</button>
                <button onClick={() => handleDelete(note)} className={BTN_DANGER + " text-[10px] px-2 py-1"}>Fshi</button>
              </div>
              <p className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
                {new Date(note.updated_at).toLocaleDateString("sq-AL")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
