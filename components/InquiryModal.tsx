"use client";

import { FormEvent, useMemo, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const services = ["Website", "E-commerce", "Marketing", "SEO", "Branding", "Mirëmbajtje"];
const budgets = ["< €500", "€500 – €1,000", "€1,000 – €2,500", "€2,500+"];
const timelines = ["ASAP", "2-4 javë", "1-2 muaj", "Fleksibël"];

export default function InquiryModal() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    service: services[0],
    budget: budgets[2],
    timeline: timelines[2],
    message: ""
  });

  useIsomorphicLayoutEffect(() => {
    const openModal = () => setOpen(true);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("open-inquiry-modal", openModal as EventListener);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("open-inquiry-modal", openModal as EventListener);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const { gsap } = ensureGSAP();
    gsap.fromTo(".inquiry-modal-panel", { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
  }, [open]);

  const close = () => {
    setOpen(false);
    setError("");
  };

  const canSubmit = useMemo(
    () => form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.message.trim().length > 6,
    [form]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Ju lutem plotësoni fushat kryesore.");
      return;
    }
    setError("");
    setSuccess(true);
    window.setTimeout(() => {
      setSuccess(false);
      close();
    }, 1400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/62 px-4 backdrop-blur-sm" onClick={close}>
      <div
        className="inquiry-modal-panel w-full max-w-xl rounded-[1.2rem] border border-white/12 bg-[#111111]/95 p-6 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-3xl leading-none">Nis projektin</h3>
          <button onClick={close} aria-label="Mbyll formularin" className="text-xl text-white/70">
            ×
          </button>
        </div>
        {success ? (
          <p className="rounded-lg border border-accent/35 bg-accent/10 px-4 py-4 text-sm text-accent/95">
            Faleminderit. Mesazhi u regjistrua dhe do të kontaktoheni shpejt.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Name</span>
                <input className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Email</span>
                <input className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Business name</span>
                <input className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.businessName} onChange={(e) => setForm((s) => ({ ...s, businessName: e.target.value }))} />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Service</span>
                <select className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.service} onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}>
                  {services.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Budget</span>
                <select className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.budget} onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}>
                  {budgets.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-white/72">Timeline</span>
                <select className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.timeline} onChange={(e) => setForm((s) => ({ ...s, timeline: e.target.value }))}>
                  {timelines.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="text-sm">
              <span className="mb-1 block text-white/72">Message</span>
              <textarea rows={5} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} />
            </label>
            <p className="text-xs tracking-[0.08em] text-white/45">
              Pas rezervimit, të kontaktojmë me një plan të qartë.
            </p>
            {error ? <p className="text-xs text-red-300">{error}</p> : null}
            <button className="rounded-full border border-accent/70 bg-accent px-6 py-3 text-xs tracking-[0.14em] text-black transition-all duration-300 hover:scale-[1.02]">
              DËRGO KËRKESËN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
