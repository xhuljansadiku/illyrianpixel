"use client";

import { FormEvent, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lead-reveal",
        { opacity: 0, y: 22, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "#lead-magnet", start: "top 82%" }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email) || !website.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/info@illyrianpixel.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Email: email,
          "Website për analizë": website,
          _subject: `Kërkesë analize falas nga ${email}`,
          _captcha: "false",
          _honey: "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      }
    } catch {
      // silent fail, show done state anyway to not frustrate user
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-magnet" className="cinematic-section section-tone-about border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-20 md:py-24">
        <div className="relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/30 px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:px-10 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(171,131,57,0.16),transparent_38%),radial-gradient(circle_at_84%_80%,rgba(255,255,255,0.06),transparent_44%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_46%,rgba(171,131,57,0.08)_100%)]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 top-6 h-16 w-16 rounded-full bg-white/10 blur-xl" />
          <div className="relative mx-auto max-w-[460px]">
            <div className="lead-reveal">
              <SectionMark label="ANALIZË FALAS" />
            </div>
            <h2 className="lead-reveal section-title mt-3 max-w-4xl text-white">
              Merr një vlerësim falas.
              <span className="sr-only">
                Analizë SEO dhe vlerësim uebsajti për biznese premium, agjenci ueb dizajni luksoz në Tiranë.
              </span>
            </h2>
            <p className="lead-reveal mt-4 text-sm leading-relaxed text-white/62 md:text-base">
              Lini email-in tuaj dhe ne ju dërgojmë një listë të qartë me hapat që duhet të ndërhyni menjëherë.
            </p>
            {done ? (
              <p className="lead-reveal mt-6 rounded-[0.8rem] border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-accent/95">
                U dërgua! Do t&apos;ju kontaktojmë së shpejti.
              </p>
            ) : (
              <form className="lead-reveal mt-6" onSubmit={onSubmit}>
                <input
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://faqja-juaj.com"
                  className="mb-3 h-[48px] w-full rounded-[0.8rem] border border-white/15 bg-black/35 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition duration-300 focus:border-accent/55 focus:shadow-[0_0_0_3px_rgba(171,131,57,0.14)]"
                  required
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@juaj.com"
                    className="h-[48px] w-full rounded-[0.8rem] border border-white/15 bg-black/35 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition duration-300 focus:border-accent/55 focus:shadow-[0_0_0_3px_rgba(171,131,57,0.14)]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="interactive-button ip-cta-primary inline-flex h-[48px] w-full shrink-0 items-center justify-center !rounded-[0.8rem] !px-6 !text-[13px] sm:w-auto disabled:opacity-50"
                  >
                    {loading ? "Duke dërguar..." : "fillo sot →"}
                  </button>
                </div>
              </form>
            )}
            <p className="lead-reveal mt-3 text-[11px] tracking-[0.06em] text-white/40">Pa kosto. Pa detyrime. Vetëm vlerë.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
