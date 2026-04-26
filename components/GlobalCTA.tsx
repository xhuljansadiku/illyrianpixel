"use client";

import Link from "next/link";
import SectionMark from "@/components/SectionMark";

type GlobalCTAProps = {
  title?: string;
  body?: string;
};

export default function GlobalCTA({
  title = "Gati për hapin tjetër?",
  body = "Rezervo një call dhe kthejmë drejtimin në plan konkret me prioritete të qarta."
}: GlobalCTAProps) {
  return (
    <section className="cinematic-section border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-20 md:py-24">
        <SectionMark label="NEXT STEP" />
        <h2 className="section-title mt-3 max-w-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/64">{body}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry-modal"))}
            data-magnetic="true"
            className="rounded-full border border-accent/70 bg-accent px-6 py-3 text-[11px] tracking-[0.16em] text-black transition hover:bg-[#d5ad4f]"
          >
            REZERVO NJË CALL
          </button>
          <Link href="/contact" className="rounded-full border border-white/18 px-6 py-3 text-[11px] tracking-[0.16em] text-white/78 transition hover:border-accent/45">
            SHKO TE KONTAKTI
          </Link>
        </div>
      </div>
    </section>
  );
}
