"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import InquiryModal from "@/components/InquiryModal";
import NewsletterPopup from "@/components/NewsletterPopup";
import CookieConsent from "@/components/CookieConsent";
import { useFirstInteraction } from "@/lib/useFirstInteraction";

// Defer non-critical layout components — do not block initial HTML paint
const InteractiveGlow       = dynamic(() => import("@/components/InteractiveGlow"),       { ssr: false });
const MagneticButtons       = dynamic(() => import("@/components/MagneticButtons"),       { ssr: false });
const GlobalReveals         = dynamic(() => import("@/components/GlobalReveals"),         { ssr: false });
const CustomCursor          = dynamic(() => import("@/components/CustomCursor"),          { ssr: false });
const CursorTrail           = dynamic(() => import("@/components/CursorTrail"),           { ssr: false });
const BackToTop             = dynamic(() => import("@/components/BackToTop"),             { ssr: false });
const ScrollProgress        = dynamic(() => import("@/components/ScrollProgress"),        { ssr: false });
const PageTransitionOverlay = dynamic(() => import("@/components/PageTransitionOverlay"), { ssr: false });
// Preloader: ÇAKTIVIZUAR 2026-10-20 me kërkesë të userit — intro-ja ~2.5s mbulonte faqen në
// vizitën e parë në desktop (PageSpeed Speed Index). Për ta rikthyer, hiq "// Preloader:" këtu
// dhe te <Preloader /> më poshtë.
// Preloader stays SSR'd (unlike the rest of this list) so it's part of the very
// first painted HTML — otherwise real page content flashes underneath it while
// client JS is still loading in before the client-only version could mount.
// Preloader: const Preloader             = dynamic(() => import("@/components/Preloader"));
const ClientWidgets         = dynamic(() => import("@/components/ClientWidgets"),         { ssr: false });
// GoldCurtain: perdja e artë mes faqeve — u provua 2026-10-20, useri vendosi JO (ngadalëson
// rrugën drejt kontaktit). Komponenti mbetet te components/GoldCurtain.tsx; për ta aktivizuar
// hiq "// GoldCurtain:" këtu dhe te <GoldCurtain /> më poshtë.
// GoldCurtain: const GoldCurtain = dynamic(() => import("@/components/GoldCurtain"), { ssr: false });
const AmbientParticles      = dynamic(() => import("@/components/AmbientParticles"),      { ssr: false });

// Utility/transactional pages — not the marketing site — skip the preloader,
// particle background and all the cursor/scroll decoration built for it.
const NO_CHROME_PREFIXES = ["/admin", "/oferta", "/klienti", "/feedback"];

// Dekorimet që punojnë vetëm me maus (≥1024px, si getIsMobile() te lib/gsap) dhe
// nën këtë kthejnë null. Pa këtë kusht moduli i tyre shkarkohej gjithsesi në
// mobile — AmbientParticles tërheq three.js + r3f (~236KB gzip) për asgjë.
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

export default function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  // three.js (~530KB JS) dhe efektet e kursorit vetëm pasi vizitori lëviz mausin/bën scroll (2026-10-20) —
  // pa maus s'kanë çfarë të bëjnë, dhe ngarkimi i faqes s'ua ndan CPU-në atyre
  const interacted = useFirstInteraction();
  if (NO_CHROME_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Preloader: <Preloader /> */}
      {/* GoldCurtain: <GoldCurtain /> */}
      {isDesktop && interacted && <AmbientParticles />}
      <SmoothScroll>
        <div className="relative z-[1]">
          <InteractiveGlow />
          {isDesktop && interacted && <MagneticButtons />}
          <GlobalReveals />
          {isDesktop && interacted && <CustomCursor />}
          {isDesktop && interacted && <CursorTrail />}
          <ScrollProgress />
          <PageTransitionOverlay />
          <BackToTop />
          {/* SSR (jo ssr:false si ClientWidgets): banner-i duhet në HTML-në e parë — shih consentGateScript */}
          <CookieConsent />
          <ClientWidgets />
          {children}
        </div>
      </SmoothScroll>
      <InquiryModal />
      <NewsletterPopup />
    </>
  );
}
