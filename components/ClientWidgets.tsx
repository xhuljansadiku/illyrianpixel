"use client";

import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function ClientWidgets() {
  return (
    <>
      <CookieConsent />
      <WhatsAppButton />
      <ExitIntentPopup />
    </>
  );
}
