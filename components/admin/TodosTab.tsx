"use client";

import { useEffect, useRef, useState } from "react";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, EmptyState, SkeletonRows, useToasts, useConfirm } from "@/components/admin/ui";

type Todo = {
  id: number;
  text: string;
  done: boolean;
  due_at: string | null;
  created_at: string;
};

export default function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: "", due_at: "" });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");
  const textInput = useRef<HTMLInputElement>(null);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    fetch("/api/admin/todos")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTodos(d.todos); })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.text.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: form.text, due_at: form.due_at || null }),
    }).then((r) => r.json());
    setSaving(false);
    if (res.success) { setTodos((t) => [res.todo, ...t]); setForm({ text: "", due_at: "" }); pushToast("Detyra u shtua.", "success"); textInput.current?.focus(); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const toggleDone = async (todo: Todo) => {
    const res = await fetch(`/api/admin/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    }).then((r) => r.json());
    if (res.success) setTodos((t) => t.map((x) => (x.id === todo.id ? res.todo : x)));
  };

  const saveEdit = async () => {
    if (!editing || !editText.trim()) return;
    const res = await fetch(`/api/admin/todos/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    }).then((r) => r.json());
    if (res.success) { setTodos((t) => t.map((x) => (x.id === editing.id ? res.todo : x))); setEditing(null); pushToast("U ruajt.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const handleDelete = async (todo: Todo) => {
    const ok = await confirm({ title: "Fshi detyrën", message: `"${todo.text}" do të fshihet.`, danger: true, confirmText: "Fshi" });
    if (!ok) return;
    const res = await fetch(`/api/admin/todos/${todo.id}`, { method: "DELETE" }).then((r) => r.json());
    if (res.success) { setTodos((t) => t.filter((x) => x.id !== todo.id)); pushToast("U fshi.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  const TodoItem = ({ todo }: { todo: Todo }) => (
    <div className={CARD + " p-3 flex items-start gap-3 " + (todo.done ? "opacity-50" : "")}>
      <button
        onClick={() => toggleDone(todo)}
        className="mt-0.5 shrink-0 w-4 h-4 rounded border border-[var(--a-border)] flex items-center justify-center hover:border-accent transition-colors"
        title={todo.done ? "Shëno si e papërfunduar" : "Shëno si e kryer"}
      >
        {todo.done && <span className="text-accent text-[10px]">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        {editing?.id === todo.id ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
              className={INPUT + " flex-1"}
            />
            <button onClick={saveEdit} className={BTN_GOLD + " text-[10px] px-2 py-1"}>Ruaj</button>
            <button onClick={() => setEditing(null)} className={BTN_PLAIN + " text-[10px] px-2 py-1"}>✕</button>
          </div>
        ) : (
          <p className={"text-[12px] text-[var(--a-text)] " + (todo.done ? "line-through" : "")}>{todo.text}</p>
        )}
        {todo.due_at && (
          <p className={"mt-0.5 text-[10px] " + (
            !todo.done && new Date(todo.due_at) < new Date()
              ? "text-red-400"
              : "text-[rgb(var(--a-text-rgb)/0.4)]"
          )}>
            {new Date(todo.done ? todo.due_at : todo.due_at).toLocaleDateString("sq-AL")}
            {!todo.done && new Date(todo.due_at) < new Date() ? " — e vonuar" : ""}
          </p>
        )}
      </div>

      {editing?.id !== todo.id && (
        <div className="flex gap-1 shrink-0">
          <button onClick={() => { setEditing(todo); setEditText(todo.text); }} className={BTN_PLAIN + " text-[10px] px-2 py-1"}>✎</button>
          <button onClick={() => handleDelete(todo)} className={BTN_DANGER + " text-[10px] px-2 py-1"}>✕</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {renderToasts()}
      {renderConfirm()}

      {/* Add form */}
      <div className={CARD + " p-4 flex flex-col sm:flex-row gap-3"}>
        <input
          ref={textInput}
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="Detyrë e re…"
          className={INPUT + " flex-1"}
        />
        <input
          type="date"
          value={form.due_at}
          onChange={(e) => setForm((f) => ({ ...f, due_at: e.target.value }))}
          className={INPUT + " w-full sm:w-36"}
        />
        <button onClick={handleAdd} disabled={saving || !form.text.trim()} className={BTN_GOLD}>
          {saving ? "…" : "+ Shto"}
        </button>
      </div>

      {loading ? <SkeletonRows rows={4} /> : todos.length === 0 ? (
        <EmptyState text="Lista jote e detyrave është bosh." />
      ) : (
        <div className="space-y-5">
          {pending.length > 0 && (
            <div className="space-y-2">
              <p className="font-ui text-[11px] font-semibold text-[rgb(var(--a-text-rgb)/0.5)] uppercase tracking-wide">
                Të hapura ({pending.length})
              </p>
              {pending.map((t) => <TodoItem key={t.id} todo={t} />)}
            </div>
          )}
          {done.length > 0 && (
            <div className="space-y-2">
              <p className="font-ui text-[11px] font-semibold text-[rgb(var(--a-text-rgb)/0.5)] uppercase tracking-wide">
                Të kryera ({done.length})
              </p>
              {done.map((t) => <TodoItem key={t.id} todo={t} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
