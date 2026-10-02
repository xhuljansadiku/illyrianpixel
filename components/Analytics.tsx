"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_ID, gaInitScript, isPrivatePath, loadClarity, readConsent } from "@/lib/consent";

// gtag (Consent Mode v2, "denied" deri në pëlqim) + Clarity vetëm pas pëlqimit për analitikë.
// Pëlqimi i ri jepet nga CookieConsent → saveConsent(); këtu trajtohet vizitori që kthehet.
export default function Analytics() {
  const pathname = usePathname();
  const isPrivate = isPrivatePath(pathname);

  useEffect(() => {
    if (!isPrivate && readConsent()?.analytics) loadClarity();
  }, [isPrivate]);

  if (isPrivate) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">
        {gaInitScript()}
      </Script>
    </>
  );
}
