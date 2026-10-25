"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useFirstInteraction } from "@/lib/useFirstInteraction";

// CookieConsent s'është më këtu: renderohet në server nga MarketingChrome (shih consentGateScript).
// Chunk-e më vete, që King Genti (~720 rreshta + varësitë) të mos rëndojë chunk-un kryesor.
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"));
const KingGenti = dynamic(() => import("@/components/KingGenti"));

export default function ClientWidgets() {
  const pathname = usePathname();
  // King Genti dhe popup-i "exit intent" shkarkohen pas ndërveprimit të parë (scroll/prekje/maus),
  // jo gjatë ngarkimit të faqes — butoni i WhatsApp-it mbetet menjëherë (2026-10-25)
  const interacted = useFirstInteraction();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <WhatsAppButton />
      {interacted && <ExitIntentPopup />}
      {interacted && <KingGenti />}
    </>
  );
}
