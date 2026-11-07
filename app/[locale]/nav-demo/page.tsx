import type { Metadata } from "next";
import NavDemoClient from "@/components/NavDemoClient";

/** DEMO (2026-11-07): 5 pamje për navbar-in — fshihet pasi pronari zgjedh një */
export const metadata: Metadata = {
  title: "Demo · Navbar",
  robots: { index: false, follow: false },
};

export default function NavDemoPage() {
  return <NavDemoClient />;
}
