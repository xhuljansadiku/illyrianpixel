"use client";

import ErrorScreen from "@/components/ErrorScreen";

// Gabimet në faqet e marketingut — renderohet brenda [locale]/layout (me <html lang>).
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} />;
}
