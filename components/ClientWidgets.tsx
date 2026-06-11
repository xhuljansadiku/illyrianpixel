"use client";

import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import KingGenti from "@/components/KingGenti";

export default function ClientWidgets() {
  return (
    <>
      <CookieConsent />
      <WhatsAppButton />
      <ExitIntentPopup />
      <KingGenti />
    </>
  );
}
