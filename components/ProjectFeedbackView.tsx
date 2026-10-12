"use client";

import { useState } from "react";
import { ClientDocFooter, ClientDocHeader, ClientDocShell, docLabel } from "@/components/ClientDocShell";

const RATING_HINTS = ["", "Dobët", "Mjaftueshëm", "Mirë", "Shumë mirë", "Shkëlqyeshëm"];

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

  const shown = hoverRating || rating;

  return (
    <ClientDocShell width="max-w-xl">
      <ClientDocHeader
        eyebrow="Vlerësimi juaj"
        title="Si shkoi përvoja juaj?"
        subtitle={<>Projekti: <span className="font-semibold text-white">{projectName}</span></>}
      />

      <div className="mt-8">
        {submitted ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 px-6 py-8 text-center">
            <p className="font-display text-[1.5rem] font-semibold text-accent">Faleminderit, {clientName}!</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              Vlerësimi juaj u regjistrua. Na ndihmon shumë të vazhdojmë të përmirësohemi.
            </p>
          </div>
        ) : (
          <>
            <p className={`${docLabel} text-center`}>Vlerësimi</p>
            <div className="mt-3 flex justify-center gap-2" role="radiogroup" aria-label="Vlerësimi me yje">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} yje`}
                  className={`text-[2.6rem] leading-none transition-transform hover:scale-110 ${
                    n <= shown ? "text-accent" : "text-white/20"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="mt-2 h-5 text-center text-[14px] text-white/70">{RATING_HINTS[shown]}</p>

            <label htmlFor="feedback-comment" className={`${docLabel} mt-7 block`}>
              Koment (opsional)
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Çfarë ju pëlqeu më shumë?"
              rows={5}
              className="mt-2 w-full resize-none rounded-[10px] border border-white/15 bg-surface px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent/60"
            />

            {error && <p className="mt-3 text-[14px] text-red-400" role="alert">{error}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className="mt-5 w-full rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accentLight disabled:opacity-50"
            >
              {busy ? "Duke dërguar…" : "Dërgo vlerësimin"}
            </button>
          </>
        )}
      </div>

      <ClientDocFooter />
    </ClientDocShell>
  );
}
