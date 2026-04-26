"use client";

import { FormEvent, useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = ["Websites", "E-commerce", "Marketing", "SEO", "Branding"];
const budgets = ["< €1,000", "€1,000 – €3,000", "€3,000 – €7,000", "€7,000+"];
const timelines = ["ASAP", "2-4 javë", "1-2 muaj", "Fleksibël"];

const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com";

export default function ContactPageClient() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    service: services[0],
    budget: budgets[1],
    timeline: timelines[2],
    message: ""
  });

  const canSubmit = useMemo(
    () =>
      form.name.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.businessName.trim().length > 1 &&
      form.message.trim().length > 6,
    [form]
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      setError("Ju lutem plotësoni fushat kryesore.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="CONTACT"
          title="Rezervo call ose dërgo kërkesën e projektit."
          description="Pas rezervimit, të kontaktojmë me një plan të qartë."
          image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
        />

      <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
        <div className="section-wrap grid gap-8 py-16 md:py-20 lg:grid-cols-[1.04fr_0.96fr]">
          <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-5 md:p-6">
            <p className="text-[11px] tracking-[0.16em] text-accent/88">BOOKING</p>
            <div className="mt-4 h-[480px] overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <iframe title="Calendly booking" src={calendlyUrl} className="h-full w-full" loading="lazy" />
            </div>
          </article>

          <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-5 md:p-6">
            <p className="text-[11px] tracking-[0.16em] text-accent/88">PROJECT INQUIRY</p>
            {success ? (
              <p className="mt-4 rounded-lg border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-accent/95">
                Faleminderit. Kërkesa u regjistrua dhe do t’ju kontaktojmë me plan të qartë.
              </p>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input label="Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} />
                  <Input label="Email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} />
                </div>
                <Input
                  label="Business name"
                  value={form.businessName}
                  onChange={(v) => setForm((s) => ({ ...s, businessName: v }))}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <Select label="Service" value={form.service} onChange={(v) => setForm((s) => ({ ...s, service: v }))} items={services} />
                  <Select label="Budget" value={form.budget} onChange={(v) => setForm((s) => ({ ...s, budget: v }))} items={budgets} />
                </div>
                <Select label="Timeline" value={form.timeline} onChange={(v) => setForm((s) => ({ ...s, timeline: v }))} items={timelines} />
                <label className="block text-sm">
                  <span className="mb-1 block text-white/72">Message</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(event) => setForm((s) => ({ ...s, message: event.target.value }))}
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2"
                  />
                </label>
                {error ? <p className="text-xs text-red-300">{error}</p> : null}
                <button className="rounded-full border border-accent/70 bg-accent px-5 py-2 text-[11px] tracking-[0.14em] text-black transition hover:bg-[#d5ad4f]">
                  DËRGO KËRKESËN
                </button>
              </form>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/66">
              <a href="mailto:hello@illyrianpixel.com" className="hover:text-accent">
                hello@illyrianpixel.com
              </a>
              <a href={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` : "https://wa.me/355000000000"} className="hover:text-accent">
                WhatsApp
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                Instagram
              </a>
            </div>
          </article>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-white/72">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2" />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  items
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: string[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-white/72">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2">
        {items.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
