import Image from "next/image";
import type { ReactNode } from "react";

// Shared brand frame for the private client pages (/oferta, /klienti, /feedback):
// same logo, type and footer as the main site, and a clean white version when printed.

const SITE_URL = "https://illyrianpixel.com";
const EMAIL = "info@illyrianpixel.com";
const PHONE_DISPLAY = "+355 69 472 6827";
const WHATSAPP = "355694726827";

export function ClientDocShell({
  children,
  width = "max-w-2xl",
}: {
  children: ReactNode;
  width?: string;
}) {
  return (
    <main id="main-content" className="ip-doc min-h-screen bg-bg px-4 py-10 text-text md:py-16">
      <div className={`mx-auto w-full ${width}`}>{children}</div>
    </main>
  );
}

export function ClientDocHeader({
  eyebrow,
  title,
  subtitle,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-accent/50 pb-7">
      <a href={SITE_URL} className="inline-flex items-center gap-3" aria-label="Illyrian Pixel">
        <Image src="/images/illyrianpixel_logo.svg" unoptimized alt="" width={44} height={41} className="h-10 w-auto" />
        <Image
          src="/images/illyrianpixel_text.svg"
          unoptimized
          alt="Illyrian Pixel"
          width={180}
          height={30}
          className="h-[22px] w-auto"
        />
      </a>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-accent">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[2rem] font-bold leading-tight text-white md:text-[2.4rem]">{title}</h1>
          {subtitle && <p className="mt-2 text-[15px] text-white/70">{subtitle}</p>}
        </div>
        {aside && <div className="text-right">{aside}</div>}
      </div>
    </header>
  );
}

export function ClientDocFooter() {
  return (
    <footer className="mt-14 border-t border-white/10 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Image src="/images/illyrianpixel_text.svg" unoptimized alt="Illyrian Pixel" width={150} height={25} className="h-[18px] w-auto" />
          <p className="mt-3 font-display text-[1.05rem] text-white/80">
            Ktheje biznesin në <span className="font-bold uppercase text-accent">Brand</span>.
          </p>
        </div>
        <ul className="space-y-1.5 text-[14px] text-white/70 sm:text-right">
          <li>
            <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-accentLight">{EMAIL}</a>
          </li>
          <li>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accentLight">
              WhatsApp {PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <a href={SITE_URL} className="transition-colors hover:text-accentLight">illyrianpixel.com</a>
          </li>
        </ul>
      </div>
      <p className="mt-8 text-[13px] text-white/50">Faleminderit për besimin!</p>
    </footer>
  );
}

// Shared readable label style for small field captions ("Për", "Data", …).
export const docLabel = "text-[12px] font-semibold uppercase tracking-[0.15em] text-white/55";
