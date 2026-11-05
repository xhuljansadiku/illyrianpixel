import type { Metadata } from "next";
import CmimetDemoClient from "@/components/CmimetDemoClient";

/** DEMO (2026-11-05): 4 pamje për paketat te /cmimet — fshihet pasi pronari zgjedh një */
export const metadata: Metadata = {
  title: "Demo · Çmimet",
  robots: { index: false, follow: false },
};

export default function CmimetDemoPage() {
  return <CmimetDemoClient />;
}
