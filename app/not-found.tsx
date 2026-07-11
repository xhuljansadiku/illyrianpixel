import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 — Faqja nuk u gjet",
  description: "Faqja që kërkuat nuk ekziston.",
};

export default function NotFound() {
  return (
    <NextIntlClientProvider locale="sq" messages={{}}>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
        <p className="font-pixel text-xs tracking-widest text-accent mb-6">GABIM 404</p>

        <h1
          className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-text/10 select-none"
          aria-hidden="true"
        >
          404
        </h1>

        <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-text mt-4 mb-4">
          Faqja nuk u gjet
        </h2>

        <p className="text-muted text-sm max-w-md mb-10 leading-relaxed">
          URL-ja që kërkuat nuk ekziston ose është zhvendosur. Kthehu në faqen kryesore dhe vazhdo eksplorimin.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-accent/40 text-accent px-8 py-3 text-sm tracking-widest uppercase hover:bg-accent/10 transition-colors duration-300"
        >
          ← Kthehu në shtëpi
        </Link>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
