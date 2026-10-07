"use client";

import { useState } from "react";
import type { FaqRow } from "@/lib/publicContent";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, EmptyState, EnglishFieldsSection, EnBadge, useConfirm } from "@/components/admin/ui";

const EMPTY_FAQ = { question: "", answer: "", category: "", question_en: "", answer_en: "", category_en: "" };

export default function FaqManager({
  items,
  setItems,
}: {
  items: FaqRow[];
  setItems: (f: FaqRow[]) => void;
}) {
  const [form, setForm] = useState(EMPTY_FAQ);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [confirm, renderConfirm] = useConfirm();

  const startEdit = (f: FaqRow) => {
    setEditingId(f.id);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category ?? "",
      question_en: f.question_en ?? "",
      answer_en: f.answer_en ?? "",
      category_en: f.category_en ?? "",
    });
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY_FAQ);
    setError("");
  };

  const submit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Pyetja dhe përgjigjja janë të detyrueshme.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/faqs/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems(items.map((f) => (f.id === editingId ? data.faq : f)));
      } else {
        const res = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, sort: items.length }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems([...items, data.faq]);
      }
      cancel();
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (f: FaqRow) => {
    setBusyId(f.id);
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !f.visible }),
      });
      const data = await res.json();
      if (data.success) setItems(items.map((x) => (x.id === f.id ? data.faq : x)));
    } finally {
      setBusyId(null);
    }
  };

  const move = async (f: FaqRow, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === f.id);
    const otherIdx = idx + dir;
    if (otherIdx < 0 || otherIdx >= items.length) return;
    const other = items[otherIdx];

    setBusyId(f.id);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/admin/faqs/${f.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: otherIdx }),
        }),
        fetch(`/api/admin/faqs/${other.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: idx }),
        }),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      if (d1.success && d2.success) {
        const next = [...items];
        next[idx] = { ...other, sort: idx };
        next[otherIdx] = { ...f, sort: otherIdx };
        setItems(next);
      }
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (f: FaqRow) => {
    if (!(await confirm({ title: "Fshi pyetjen", message: `Të fshihet pyetja "${f.question}"?`, danger: true, confirmText: "Fshi" }))) return;
    setBusyId(f.id);
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((x) => x.id !== f.id));
        if (editingId === f.id) cancel();
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Form */}
      <div className={CARD + " mb-5 p-5"}>
        <p className="mb-3 font-display text-[1.05rem] font-semibold text-[var(--a-text)]">
          {editingId ? "Edito pyetjen" : "Pyetje e re"}
        </p>
        <input
          type="text"
          placeholder="Pyetja * (p.sh. Sa zgjat ndërtimi i një website?)"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          className={INPUT + " w-full"}
        />
        <textarea
          rows={3}
          placeholder="Përgjigjja * (rresht i ri = paragraf i ri në faqe)"
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          className={INPUT + " mt-3 w-full resize-none"}
        />
        <input
          type="text"
          placeholder="Kategoria (ops. — p.sh. Çmime, Procesi, Teknike)"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={INPUT + " mt-3 w-full"}
        />
        <EnglishFieldsSection hasContent={Boolean(form.question_en || form.answer_en || form.category_en)}>
          <input
            type="text"
            placeholder="Question in English — pa këtë, pyetja s'shfaqet në /en"
            value={form.question_en}
            onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
            className={INPUT + " w-full"}
          />
          <textarea
            rows={3}
            placeholder="Answer in English"
            value={form.answer_en}
            onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))}
            className={INPUT + " mt-3 w-full resize-none"}
          />
          <input
            type="text"
            placeholder="Category in English (ops.)"
            value={form.category_en}
            onChange={(e) => setForm((f) => ({ ...f, category_en: e.target.value }))}
            className={INPUT + " mt-3 w-full"}
          />
        </EnglishFieldsSection>
        {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={submit} disabled={saving} className={BTN_GOLD}>
            {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto pyetjen"}
          </button>
          {editingId && (
            <button onClick={cancel} className={BTN_PLAIN}>
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && (
          <EmptyState text="Asnjë pyetje. Shto të parën me formularin lart — shfaqet menjëherë në faqen kryesore." />
        )}
        {items.map((f, idx) => (
          <div key={f.id} className={CARD + " p-5" + (f.visible ? "" : " opacity-60")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[1rem] font-semibold text-[var(--a-text)]">
                  {f.question}
                  <span className="ml-2 inline-block align-middle"><EnBadge translated={Boolean(f.question_en && f.answer_en)} /></span>
                  {f.category && (
                    <span className="ml-2 rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                      {f.category}
                    </span>
                  )}
                  {!f.visible && (
                    <span className="ml-2 rounded-full border border-[rgb(var(--a-text-rgb)/0.2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.45)]">
                      E fshehur
                    </span>
                  )}
                </p>
                <p className="mt-1.5 whitespace-pre-line text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.5)]">
                  {f.answer}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button onClick={() => move(f, -1)} disabled={idx === 0 || busyId === f.id} className={BTN_PLAIN + " disabled:opacity-30"} aria-label="Ngjit lart">
                  ↑
                </button>
                <button onClick={() => move(f, 1)} disabled={idx === items.length - 1 || busyId === f.id} className={BTN_PLAIN + " disabled:opacity-30"} aria-label="Zbrit poshtë">
                  ↓
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--a-border)] pt-3">
              <button onClick={() => toggleVisible(f)} disabled={busyId === f.id} className={BTN_PLAIN}>
                {f.visible ? "🙈 Fshih" : "👁 Shfaq"}
              </button>
              <button onClick={() => startEdit(f)} className={BTN_PLAIN}>
                Edito
              </button>
              <button onClick={() => remove(f)} disabled={busyId === f.id} className={BTN_DANGER}>
                Fshi
              </button>
            </div>
          </div>
        ))}
      </div>
      {renderConfirm()}
    </div>
  );
}
