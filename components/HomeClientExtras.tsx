"use client";

import dynamic from "next/dynamic";

// Next 15 s'lejon `ssr: false` te next/dynamic brenda Server Components —
// këto dy efekte vetëm-klient ngarkohen nga ky wrapper klienti.
const BrandSignature = dynamic(() => import("@/components/BrandSignature"), { ssr: false });
const EasterEggOverlay = dynamic(() => import("@/components/EasterEggOverlay"), { ssr: false });

export default function HomeClientExtras() {
  return (
    <>
      <BrandSignature />
      <EasterEggOverlay />
    </>
  );
}
