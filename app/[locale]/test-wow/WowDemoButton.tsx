"use client";

// FAQE TESTI (2026-10-20) — fshihet pasi zgjidhen efektet
export default function WowDemoButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("gold-curtain-demo"))}
      className="ip-cta-primary ip-cta-primary--lg"
    >
      {label}
    </button>
  );
}
