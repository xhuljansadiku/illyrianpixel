"use client";

import { useState } from "react";
import type { TestimonialRow, PortfolioRow, FaqRow } from "@/lib/publicContent";
import { pricingKey, type PricingOverrides } from "@/lib/pricingOverrides";
import FaqManager from "@/components/admin/FaqManager";

const CARD =
  "relative overflow-hidden rounded-[1.5rem] border border-[var(--a-border)] bg-[var(--a-card)] backdrop-blur-[12px]";

const INPUT =
  "font-ui rounded-[2px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent";

const BTN_GOLD =
  "font-ui rounded-[2px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50";

const BTN_PLAIN =
  "font-ui rounded-[2px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]";

const BTN_DANGER =
  "font-ui rounded-[2px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50";

export type PricingCatalogEntry = {
  slug: string;
  title: string;
  packages: { name: string; price: string; priceNote?: string }[];
};

// ─────────────────────────────────────────────────────────────────────────────
export default function ContentTab({
  testimonials,
  setTestimonials,
  portfolioItems,
  setPortfolioItems,
  pricingCatalog,
  initialOverrides,
  faqs,
  setFaqs,
}: {
  testimonials: TestimonialRow[];
  setTestimonials: (t: TestimonialRow[]) => void;
  portfolioItems: PortfolioRow[];
  setPortfolioItems: (p: PortfolioRow[]) => void;
  pricingCatalog: PricingCatalogEntry[];
  initialOverrides: PricingOverrides;
  faqs: FaqRow[];
  setFaqs: (f: FaqRow[]) => void;
}) {
  const [section, setSection] = useState<"testimonials" | "portfolio" | "pricing" | "faqs">("testimonials");

  return (
    <div>
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {([
          ["testimonials", `💬 Testimoniale (${testimonials.length})`],
          ["portfolio", `🖼️ Portofoli (${portfolioItems.length})`],
          ["pricing", "💶 Çmimet"],
          ["faqs", `❓ FAQ (${faqs.length})`],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`font-ui whitespace-nowrap rounded-[2px] px-4 py-2 text-[12px] font-semibold transition-colors ${
              section === id
                ? "bg-accent/10 text-accent border border-accent/30"
                : "border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {section === "testimonials" && <TestimonialsManager items={testimonials} setItems={setTestimonials} />}
      {section === "portfolio" && <PortfolioManager items={portfolioItems} setItems={setPortfolioItems} />}
      {section === "pricing" && <PricingManager catalog={pricingCatalog} initialOverrides={initialOverrides} />}
      {section === "faqs" && <FaqManager items={faqs} setItems={setFaqs} />}
    </div>
  );
}

// ── Testimoniale ─────────────────────────────────────────────────────────────
const EMPTY_TESTIMONIAL = { quote: "", name: "", company: "", result: "", logo: "" };

function TestimonialsManager({
  items,
  setItems,
}: {
  items: TestimonialRow[];
  setItems: (t: TestimonialRow[]) => void;
}) {
  const [form, setForm] = useState(EMPTY_TESTIMONIAL);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const startEdit = (t: TestimonialRow) => {
    setEditingId(t.id);
    setForm({ quote: t.quote, name: t.name, company: t.company ?? "", result: t.result ?? "", logo: t.logo ?? "" });
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY_TESTIMONIAL);
    setError("");
  };

  const submit = async () => {
    if (!form.quote.trim() || !form.name.trim()) {
      setError("Citimi dhe emri janë të detyrueshëm.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/testimonials/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems(items.map((t) => (t.id === editingId ? data.testimonial : t)));
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, sort: items.length }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems([...items, data.testimonial]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (t: TestimonialRow) => {
    setBusyId(t.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !t.visible }),
      });
      const data = await res.json();
      if (data.success) setItems(items.map((x) => (x.id === t.id ? data.testimonial : x)));
    } finally {
      setBusyId(null);
    }
  };

  const move = async (t: TestimonialRow, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === t.id);
    const otherIdx = idx + dir;
    if (otherIdx < 0 || otherIdx >= items.length) return;
    const other = items[otherIdx];
    setBusyId(t.id);
    try {
      // Shkëmbe vlerat e sort në DB
      await Promise.all([
        fetch(`/api/admin/testimonials/${t.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: otherIdx }),
        }),
        fetch(`/api/admin/testimonials/${other.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: idx }),
        }),
      ]);
      const next = [...items];
      next[idx] = { ...other, sort: idx };
      next[otherIdx] = { ...t, sort: otherIdx };
      setItems(next);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (t: TestimonialRow) => {
    if (!confirm(`Të fshihet testimoniali i ${t.name}?`)) return;
    setBusyId(t.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setItems(items.filter((x) => x.id !== t.id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={CARD + " mb-5 p-5"}>
        <p className="mb-4 font-display text-[1.05rem] font-semibold text-[var(--a-text)]">
          {editingId ? "Edito testimonialin" : "Shto testimonial"}
        </p>
        <textarea
          rows={3}
          placeholder="Citimi i klientit *"
          value={form.quote}
          onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
          className={INPUT + " w-full resize-none"}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="text" placeholder="Emri *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Kompania" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Vendi/rezultati (p.sh. Milano, Itali)" value={form.result} onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="URL e logos (ops.)" value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} className={INPUT} />
        </div>
        {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={submit} disabled={saving} className={BTN_GOLD}>
            {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto"}
          </button>
          {editingId && (
            <button onClick={cancel} className={BTN_PLAIN}>Anulo</button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((t, idx) => (
          <div key={t.id} className={CARD + ` p-5 ${t.visible ? "" : "opacity-50"}`}>
            <p className="text-[13px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.75)]">“{t.quote}”</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.45)]">
              <span className="font-semibold text-[var(--a-text)]">{t.name}</span>
              {t.company && <span>· {t.company}</span>}
              {t.result && <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[10px] text-accent/85">{t.result}</span>}
              {!t.visible && <span className="rounded-full border border-[rgb(var(--a-text-rgb)/0.2)] px-2 py-0.5 text-[10px] uppercase">I fshehur</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--a-border)] pt-3">
              <button onClick={() => move(t, -1)} disabled={busyId === t.id || idx === 0} className={BTN_PLAIN + " disabled:opacity-30"}>↑</button>
              <button onClick={() => move(t, 1)} disabled={busyId === t.id || idx === items.length - 1} className={BTN_PLAIN + " disabled:opacity-30"}>↓</button>
              <button onClick={() => toggleVisible(t)} disabled={busyId === t.id} className={BTN_PLAIN}>
                {t.visible ? "Fshih" : "Shfaq"}
              </button>
              <button onClick={() => startEdit(t)} className={BTN_PLAIN}>Edito</button>
              <button onClick={() => remove(t)} disabled={busyId === t.id} className={BTN_DANGER}>Fshi</button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
        Testimonialet e dukshme shfaqen në faqen kryesore sipas kësaj renditjeje (rifreskohet brenda 5 min).
      </p>
    </div>
  );
}

// ── Portofoli ────────────────────────────────────────────────────────────────
const EMPTY_PORTFOLIO = {
  title: "",
  category: "",
  location: "",
  year: "",
  description: "",
  result: "",
  tags: "",
  image_url: "",
  live_url: "",
};

function PortfolioManager({
  items,
  setItems,
}: {
  items: PortfolioRow[];
  setItems: (p: PortfolioRow[]) => void;
}) {
  const [form, setForm] = useState(EMPTY_PORTFOLIO);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const startEdit = (p: PortfolioRow) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category ?? "",
      location: p.location ?? "",
      year: p.year ?? "",
      description: p.description ?? "",
      result: p.result ?? "",
      tags: (p.tags ?? []).join(", "),
      image_url: p.image_url ?? "",
      live_url: p.live_url ?? "",
    });
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY_PORTFOLIO);
    setError("");
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/portfolio/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, image_url: data.url }));
      } else {
        setError(data.error ?? "Ngarkimi dështoi.");
      }
    } catch {
      setError("Gabim lidhjeje gjatë ngarkimit.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Titulli është i detyrueshëm.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/portfolio/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems(items.map((p) => (p.id === editingId ? data.item : p)));
      } else {
        const res = await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, sort: items.length }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Gabim.");
          return;
        }
        setItems([...items, data.item]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (p: PortfolioRow) => {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !p.visible }),
      });
      const data = await res.json();
      if (data.success) setItems(items.map((x) => (x.id === p.id ? data.item : x)));
    } finally {
      setBusyId(null);
    }
  };

  const move = async (p: PortfolioRow, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === p.id);
    const otherIdx = idx + dir;
    if (otherIdx < 0 || otherIdx >= items.length) return;
    const other = items[otherIdx];
    setBusyId(p.id);
    try {
      await Promise.all([
        fetch(`/api/admin/portfolio/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: otherIdx }),
        }),
        fetch(`/api/admin/portfolio/${other.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort: idx }),
        }),
      ]);
      const next = [...items];
      next[idx] = { ...other, sort: idx };
      next[otherIdx] = { ...p, sort: otherIdx };
      setItems(next);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: PortfolioRow) => {
    if (!confirm(`Të fshihet projekti "${p.title}"?`)) return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setItems(items.filter((x) => x.id !== p.id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={CARD + " mb-5 p-5"}>
        <p className="mb-4 font-display text-[1.05rem] font-semibold text-[var(--a-text)]">
          {editingId ? "Edito projektin" : "Shto projekt"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="text" placeholder="Titulli *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Kategoria (p.sh. Website për Biznes)" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Vendndodhja" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Viti" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className={INPUT} />
        </div>
        <textarea
          rows={3}
          placeholder="Përshkrimi i projektit"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={INPUT + " mt-3 w-full resize-none"}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input type="text" placeholder="Rezultati kryesor (p.sh. +40% kërkesa)" value={form.result} onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Etiketa, të ndara me presje" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={INPUT} />
          <input type="text" placeholder="Live URL (https://...)" value={form.live_url} onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))} className={INPUT} />
          <div className="flex items-center gap-2">
            <label className={BTN_PLAIN + " cursor-pointer whitespace-nowrap"}>
              {uploading ? "Duke ngarkuar…" : "📤 Ngarko imazh"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                  e.target.value = "";
                }}
              />
            </label>
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Parapamje" className="h-10 w-16 rounded object-cover" />
            )}
          </div>
        </div>
        {error && <p className="mt-2 text-[12px] text-red-400/80">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={submit} disabled={saving || uploading} className={BTN_GOLD}>
            {saving ? "Duke ruajtur…" : editingId ? "Ruaj ndryshimet" : "Shto projektin"}
          </button>
          {editingId && <button onClick={cancel} className={BTN_PLAIN}>Anulo</button>}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((p, idx) => (
          <div key={p.id} className={CARD + ` flex flex-wrap items-center gap-4 p-5 ${p.visible ? "" : "opacity-50"}`}>
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.title} className="h-14 w-24 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.3)]">—</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-[var(--a-text)]">{p.title}</p>
              <p className="mt-0.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">
                {[p.category, p.location, p.year].filter(Boolean).join(" · ")}
                {!p.visible && " · I fshehur"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => move(p, -1)} disabled={busyId === p.id || idx === 0} className={BTN_PLAIN + " disabled:opacity-30"}>↑</button>
              <button onClick={() => move(p, 1)} disabled={busyId === p.id || idx === items.length - 1} className={BTN_PLAIN + " disabled:opacity-30"}>↓</button>
              <button onClick={() => toggleVisible(p)} disabled={busyId === p.id} className={BTN_PLAIN}>
                {p.visible ? "Fshih" : "Shfaq"}
              </button>
              <button onClick={() => startEdit(p)} className={BTN_PLAIN}>Edito</button>
              <button onClick={() => remove(p)} disabled={busyId === p.id} className={BTN_DANGER}>Fshi</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="p-8 text-center text-[13px] text-[rgb(var(--a-text-rgb)/0.35)]">
            Asnjë projekt nga admini — faqja kryesore shfaq projektet statike të kodit. Sapo të shtosh të parin, ato zëvendësohen.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Çmimet ───────────────────────────────────────────────────────────────────
function PricingManager({
  catalog,
  initialOverrides,
}: {
  catalog: PricingCatalogEntry[];
  initialOverrides: PricingOverrides;
}) {
  const [overrides, setOverrides] = useState<PricingOverrides>(initialOverrides);
  const [drafts, setDrafts] = useState<Record<string, { price: string; note: string }>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const draftFor = (key: string, fallbackPrice: string, fallbackNote: string) =>
    drafts[key] ?? {
      price: overrides[key]?.price ?? fallbackPrice,
      note: overrides[key]?.price_note ?? fallbackNote,
    };

  const save = async (key: string, fallbackPrice: string, fallbackNote: string) => {
    const d = draftFor(key, fallbackPrice, fallbackNote);
    if (!d.price.trim()) return;
    setBusyKey(key);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, price: d.price.trim(), price_note: d.note.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setOverrides((o) => ({ ...o, [key]: { price: d.price.trim(), price_note: d.note.trim() || null } }));
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 2500);
      }
    } finally {
      setBusyKey(null);
    }
  };

  const reset = async (key: string) => {
    setBusyKey(key);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.success) {
        setOverrides((o) => {
          const next = { ...o };
          delete next[key];
          return next;
        });
        setDrafts((d) => {
          const next = { ...d };
          delete next[key];
          return next;
        });
      }
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-5">
      {catalog.map((cat) => (
        <div key={cat.slug} className={CARD + " p-5"}>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            {cat.title}
          </p>
          <div className="space-y-2.5">
            {cat.packages.map((pkg) => {
              const key = pricingKey(cat.slug, pkg.name);
              const overridden = !!overrides[key];
              const d = draftFor(key, pkg.price, pkg.priceNote ?? "");
              return (
                <div key={key} className="flex flex-wrap items-center gap-2.5">
                  <span className="w-32 truncate text-[13px] text-[rgb(var(--a-text-rgb)/0.75)]">
                    {pkg.name}
                    {overridden && <span className="ml-1.5 text-[10px] text-accent">●</span>}
                  </span>
                  <span className="w-28 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">
                    Kodi: {pkg.price}{pkg.priceNote ?? ""}
                  </span>
                  <input
                    type="text"
                    value={d.price}
                    onChange={(e) => setDrafts((s) => ({ ...s, [key]: { ...d, price: e.target.value } }))}
                    placeholder="€499"
                    className={INPUT + " w-28"}
                  />
                  <input
                    type="text"
                    value={d.note}
                    onChange={(e) => setDrafts((s) => ({ ...s, [key]: { ...d, note: e.target.value } }))}
                    placeholder="/ muaj (ops.)"
                    className={INPUT + " w-28"}
                  />
                  <button
                    onClick={() => save(key, pkg.price, pkg.priceNote ?? "")}
                    disabled={busyKey === key}
                    className={BTN_GOLD}
                  >
                    {busyKey === key ? "…" : savedKey === key ? "✓" : "Ruaj"}
                  </button>
                  {overridden && (
                    <button onClick={() => reset(key)} disabled={busyKey === key} className={BTN_PLAIN}>
                      Rikthe origjinalin
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
        Çmimet e mbishkruara (●) zbatohen te /cmimet dhe faqet e shërbimeve brenda 5 minutash, pa deploy.
      </p>
    </div>
  );
}
