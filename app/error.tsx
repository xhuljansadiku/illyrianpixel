"use client";

import ErrorScreen from "@/components/ErrorScreen";
import { bodyClassName } from "@/lib/fonts";

// Kap gabimet e admin/oferta/klienti/feedback (dhe të vetë [locale]/layout).
// Këtu zëvendësohet layout-i që mban <html>, prandaj e renderojmë vetë.
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="sq" dir="ltr">
      <body className={bodyClassName}>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
