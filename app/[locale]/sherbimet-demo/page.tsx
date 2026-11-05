import type { Metadata } from "next";
import SherbimetDemoClient from "@/components/SherbimetDemoClient";

/** DEMO (2026-11-05): 4 pamje për /sherbimet — fshihet pasi pronari zgjedh një */
export const metadata: Metadata = {
  title: "Demo · Shërbimet",
  robots: { index: false, follow: false },
};

export default function SherbimetDemoPage() {
  return <SherbimetDemoClient />;
}
