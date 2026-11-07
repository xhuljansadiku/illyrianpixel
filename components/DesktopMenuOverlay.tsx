"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";

/**
 * Menu në ekran të plotë (2026-11-07, versioni C i demos), hapet nga butoni "MENU".
 * 2026-11-08: e njëjta menu edhe në celular/tablet (në vend të MobileMenu + shiritit poshtë),
 * që marka të duket njësoj kudo. Celular: një kolonë + "Fillo sot" / WhatsApp poshtë.
 */
type Item = { id: string; label: string; href: string };

export default function DesktopMenuOverlay({
  open,
  items,
  active,
  onClose,
  onStart,
  ctaLabel,
}: {
  open: boolean;
  items: Item[];
  active: string;
  onClose: () => void;
  /** "Fillo sot": tablet/desktop hap dritaren e kontaktit; celulari shkon te /contact */
  onStart: () => void;
  ctaLabel: string;
}) {
  const locale = useLocale();
  const en = locale === "en";
  const waHref = buildWhatsAppChatHref(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_E164, locale);
  const tab = open ? 0 : -1;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("ip-mobile-menu-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("ip-mobile-menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-[55] overflow-y-auto bg-[#0b0a08] transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        open
          ? "[clip-path:circle(150%_at_92%_4%)] lg:[clip-path:inset(0_0_0_0)]"
          : "pointer-events-none [clip-path:circle(0%_at_92%_4%)] lg:[clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(171,131,57,0.10),transparent_70%)]" />
      <div className="relative mx-auto flex min-h-full max-w-[1280px] flex-col px-6 pb-8 pt-28 md:px-10 lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16 lg:px-14 lg:pb-10 lg:pt-24">
        <nav className="grid gap-x-12 md:grid-cols-2">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              tabIndex={tab}
              className={`group flex items-baseline gap-4 border-b border-white/[0.07] py-3 font-display text-[2rem] leading-tight transition-colors duration-300 md:py-4 lg:text-[clamp(2rem,3.4vw,3.2rem)] ${
                active === item.id ? "text-accent" : "text-white/85 hover:text-accent"
              }`}
            >
              <span className="font-mono text-[11px] text-accent/70">0{i + 1}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Celular/tablet: veprimet kryesore poshtë listës */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-8 lg:hidden">
          <Link
            href="/contact"
            tabIndex={tab}
            onClick={(e) => {
              onClose();
              if (window.matchMedia("(min-width: 768px)").matches) {
                e.preventDefault();
                onStart();
              }
            }}
            className="interactive-button ip-cta-primary inline-flex justify-center"
          >
            {ctaLabel}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tab}
            className="font-ui inline-flex items-center justify-center rounded-full border border-[#25D366]/40 text-[12px] font-bold tracking-[1px] text-[#25D366]"
          >
            WhatsApp
          </a>
          <p className="col-span-2 mt-4 text-center font-display text-[1.1rem] italic text-accent">
            {en ? "International standard. In Albanian." : "Standard ndërkombëtar. Në shqip."}
          </p>
        </div>

        <div className="hidden border-l border-white/10 pl-12 font-ui text-[14px] leading-loose text-white/55 lg:block">
          <p className="ip-eyebrow">{en ? "CONTACT" : "KONTAKT"}</p>
          <a href="mailto:info@illyrianpixel.com" tabIndex={tab} className="mt-4 block transition-colors hover:text-accent">
            info@illyrianpixel.com
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" tabIndex={tab} className="block transition-colors hover:text-accent">
            WhatsApp +355 69 472 6827
          </a>
          <p className="mt-10 font-display text-[1.6rem] italic leading-snug text-accent">
            {en ? "International standard. In Albanian." : "Standard ndërkombëtar. Në shqip."}
          </p>
        </div>
      </div>
    </div>
  );
}
