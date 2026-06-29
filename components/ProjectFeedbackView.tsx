"use client";

import { useState } from "react";

export default function ProjectFeedbackView({
  token,
  projectName,
  clientName,
  alreadySubmitted,
}: {
  token: string;
  projectName: string;
  clientName: string;
  alreadySubmitted: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (rating < 1) {
      setError("Zgjidhni një vlerësim me yje.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/feedback/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Diçka shkoi keq. Provoni sërish.");
      }
    } catch {
      setError("Gabim lidhjeje. Provoni sërish.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white md:py-20">
      <div className="mx-auto w-full max-w-lg">
        <div className="border-b-2 border-accent/60 pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/70">Illyrian Pixel</p>
          <h1 className="mt-3 font-display text-2xl font-bold md:text-3xl">Si shkoi përvoja juaj?</h1>
          <p className="mt-2 text-sm text-white/50">Projekti: {projectName}</p>
        </div>

        <div className="mt-8">
          {submitted ? (
            <div className="rounded-[3px] border border-accent/30 bg-accent/6 px-6 py-8 text-center">
              <p className="font-display text-xl font-medium text-accent">Faleminderit, {clientName}!</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Vlerësimi juaj u regjistrua. Na ndihmon shumë të vazhdojmë të përmirësohemi.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${n} yje`}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      n <= (hoverRating || rating) ? "text-accent" : "text-white/15"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Çfarë ju pëlqeu më shumë? (opsionale)"
                rows={5}
                className="mt-6 w-full resize-none rounded-[3px] border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent/50"
              />

              {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

              <button
                onClick={submit}
                disabled={busy}
                className="mt-5 w-full rounded-[3px] bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#0a0a0a] transition-opacity disabled:opacity-50"
              >
                {busy ? "Duke dërguar…" : "Dërgo vlerësimin"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
