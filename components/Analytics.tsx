"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_ID, gaInitScript, isPrivatePath, loadClarity, readConsent } from "@/lib/consent";
import { trackContactClick } from "@/lib/track";

// gtag (Consent Mode v2, "denied" deri në pëlqim) + Clarity vetëm pas pëlqimit për analitikë.
// Pëlqimi i ri jepet nga CookieConsent → saveConsent(); këtu trajtohet vizitori që kthehet.
export default function Analytics() {
  const pathname = usePathname();
  const isPrivate = isPrivatePath(pathname);

  useEffect(() => {
    if (!isPrivate && readConsent()?.analytics) loadClarity();
  }, [isPrivate]);

  // Klikimet WhatsApp / email / telefon në gjithë faqen — një dëgjues, që asnjë klik s'numërohet dy herë
  useEffect(() => {
    if (isPrivate) return;
    document.addEventListener("click", trackContactClick, { capture: true });
    return () => document.removeEventListener("click", trackContactClick, { capture: true });
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
