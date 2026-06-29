"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import InquiryModal from "@/components/InquiryModal";

// Defer non-critical layout components — do not block initial HTML paint
const InteractiveGlow       = dynamic(() => import("@/components/InteractiveGlow"),       { ssr: false });
const MagneticButtons       = dynamic(() => import("@/components/MagneticButtons"),       { ssr: false });
const GlobalReveals         = dynamic(() => import("@/components/GlobalReveals"),         { ssr: false });
const CustomCursor          = dynamic(() => import("@/components/CustomCursor"),          { ssr: false });
const CursorTrail           = dynamic(() => import("@/components/CursorTrail"),           { ssr: false });
const BackToTop             = dynamic(() => import("@/components/BackToTop"),             { ssr: false });
const ScrollProgress        = dynamic(() => import("@/components/ScrollProgress"),        { ssr: false });
const PageTransitionOverlay = dynamic(() => import("@/components/PageTransitionOverlay"), { ssr: false });
const Preloader             = dynamic(() => import("@/components/Preloader"),             { ssr: false });
const ClientWidgets         = dynamic(() => import("@/components/ClientWidgets"),         { ssr: false });
const AmbientParticles      = dynamic(() => import("@/components/AmbientParticles"),      { ssr: false });

// Utility/transactional pages — not the marketing site — skip the preloader,
// particle background and all the cursor/scroll decoration built for it.
const NO_CHROME_PREFIXES = ["/admin", "/oferta", "/klienti", "/feedback"];

export default function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (NO_CHROME_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <AmbientParticles />
      <SmoothScroll>
        <div className="relative z-[1]">
          <InteractiveGlow />
          <MagneticButtons />
          <GlobalReveals />
          <CustomCursor />
          <CursorTrail />
          <ScrollProgress />
          <PageTransitionOverlay />
          <BackToTop />
          <ClientWidgets />
          {children}
        </div>
      </SmoothScroll>
      <InquiryModal />
    </>
  );
}
