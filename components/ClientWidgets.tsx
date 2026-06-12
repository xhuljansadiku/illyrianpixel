"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import KingGenti from "@/components/KingGenti";

export default function ClientWidgets() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <CookieConsent />
      <WhatsAppButton />
      <ExitIntentPopup />
      <KingGenti />
    </>
  );
}
