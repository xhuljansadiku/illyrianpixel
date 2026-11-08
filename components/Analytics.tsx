"use client";

import { useEffect } from "react";
// Advanced Consent Mode: import Script from "next/script";
import { usePathname } from "next/navigation";
// Advanced Consent Mode: import { GA_ID, gaInitScript, isPrivatePath, loadClarity, readConsent } from "@/lib/consent";
import { applyConsent, CONSENT_STORAGE_KEY, isPrivatePath, readConsent } from "@/lib/consent";
import { trackContactClick } from "@/lib/track";

// GA4 (Basic Consent Mode v2) dhe Clarity ngarkohen vetëm pas pëlqimit për analitikë (lib/consent.ts).
// Pëlqimi i ri jepet nga CookieConsent → saveConsent(); këtu trajtohet vizitori që kthehet.
export default function Analytics() {
  const pathname = usePathname();
  const isPrivate = isPrivatePath(pathname);

  useEffect(() => {
    if (isPrivate) return;
    const sync = () => applyConsent(readConsent());
    // Zgjedhja u ndryshua në një skedë tjetër (ose faqja u rikthye nga cache-i i shfletuesit)
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY || event.key === null) sync();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) sync();
    };

    sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [isPrivate]);

  // Klikimet WhatsApp / email / telefon në gjithë faqen — një dëgjues, që asnjë klik s'numërohet dy herë
  useEffect(() => {
    if (isPrivate) return;
    document.addEventListener("click", trackContactClick, { capture: true });
    return () => document.removeEventListener("click", trackContactClick, { capture: true });
  }, [isPrivate]);

  return null;

  // Advanced Consent Mode: if (isPrivate) return null;
  // Advanced Consent Mode: return (
  // Advanced Consent Mode:   <>
  // Advanced Consent Mode:     <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
  // Advanced Consent Mode:     <Script id="ga4-init" strategy="lazyOnload">
  // Advanced Consent Mode:       {gaInitScript()}
  // Advanced Consent Mode:     </Script>
  // Advanced Consent Mode:   </>
  // Advanced Consent Mode: );
}
