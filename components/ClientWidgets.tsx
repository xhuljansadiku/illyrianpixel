"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

// CookieConsent s'është më këtu: renderohet në server nga MarketingChrome (shih consentGateScript).
// Chunk-e më vete, që King Genti (~720 rreshta + varësitë) të mos rëndojë chunk-un kryesor.
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"));
const KingGenti = dynamic(() => import("@/components/KingGenti"));

export default function ClientWidgets() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <WhatsAppButton />
      <ExitIntentPopup />
      <KingGenti />
    </>
  );
}
