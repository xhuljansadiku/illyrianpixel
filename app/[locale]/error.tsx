"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

// Deliberately dependency-free (no dictionaries, no next-intl), because this
// boundary's code is loaded on every page.
const COPY = {
  sv: {
    title: "Något gick fel.",
    text: "Ett oväntat fel inträffade. Försök igen, eller gå tillbaka till startsidan.",
    retry: "Försök igen",
    home: "Till startsidan",
  },
  en: {
    title: "Something went wrong.",
    text: "An unexpected error occurred. Please try again, or go back to the home page.",
    retry: "Try again",
    home: "Back to home",
  },
} as const;

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "sv";
  const copy = COPY[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="message-page">
      <div className="container">
        <p className="eyebrow">Error</p>
        <h1 className="message-page__title">{copy.title}</h1>
        <p className="lead message-page__text">{copy.text}</p>
        <div className="btn-group btn-group--stack-mobile message-page__actions">
          <button type="button" className="btn btn--primary" onClick={reset}>
            {copy.retry}
          </button>
          {/* A full page load is the safest way out of an error state. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href={`/${locale}`} className="btn btn--secondary">
            {copy.home}
          </a>
        </div>
      </div>
    </section>
  );
}
