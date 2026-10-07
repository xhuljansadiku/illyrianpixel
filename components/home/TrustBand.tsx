import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { CLIENT_LOGOS } from "@/content/social-proof";

/**
 * Client logos once real clients exist; until then an honest statement plus
 * the disciplines Nordic Pixel brings together. No invented logos.
 */
export function TrustBand({ dict }: { dict: Dictionary }) {
  const trust = dict.home.trust;

  if (CLIENT_LOGOS.length > 0) {
    return (
      <section className="trust" aria-label={trust.heading}>
        <div className="container trust__inner">
          <p className="trust__label">{trust.heading}</p>
          <ul className="trust__logos">
            {CLIENT_LOGOS.map((client) => (
              <li key={client.name}>
                <Image src={client.logo} alt={client.name} width={140} height={32} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="trust" aria-label={trust.pillarsLabel}>
      <div className="container trust__inner">
        <p className="trust__statement">{trust.fallback}</p>
        <ul className="trust__pillars" aria-label={trust.pillarsLabel}>
          {trust.pillars.map((pillar) => (
            <li key={pillar}>{pillar}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
