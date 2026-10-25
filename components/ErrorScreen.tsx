"use client";

import Link from "next/link";
import { useEffect } from "react";

// UI e përbashkët për app/error.tsx (me <html> të vetin) dhe app/[locale]/error.tsx
export default function ErrorScreen({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-pixel text-xs tracking-widest text-accent mb-6">GABIM I PAPRITUR</p>

      <h1
        className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-text/10 select-none"
        aria-hidden="true"
      >
        500
      </h1>

      <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-text mt-4 mb-4">
        Diçka shkoi keq
      </h2>

      <p className="text-muted text-sm max-w-md mb-10 leading-relaxed">
        Ndodhi një gabim i papritur. Provo përsëri ose kthehu në faqen kryesore.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-accent text-bg px-8 py-3 text-sm tracking-widest uppercase hover:bg-accentLight transition-colors duration-300"
        >
          Provo Përsëri
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-accent/40 text-accent px-8 py-3 text-sm tracking-widest uppercase hover:bg-accent/10 transition-colors duration-300"
        >
          ← Kthehu në faqen kryesore
        </Link>
      </div>
    </main>
  );
}
