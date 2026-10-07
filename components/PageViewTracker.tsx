"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Numëron vizitat e faqeve për funnel-in e konvertimit në admin.
// Pa cookies, pa të dhëna personale — vetëm path + ditë.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
      }
    } catch {
      // injoro — tracking s'duhet të prishë faqen
    }
  }, [pathname]);

  return null;
}
