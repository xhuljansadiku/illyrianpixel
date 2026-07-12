"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LINKS } from "@/lib/socialLinks";
import { ensureGSAP, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

type NavItem = { id: string; label: string; href: string; sectionId?: string };

type Props = {
  isOpen: boolean;
  navItems: NavItem[];
  active: string;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
};

export default function MobileMenu({ isOpen, navItems, active, onClose, onNavigate }: Props) {
  const t = useTranslations("common.nav");
  const tFooter = useTranslations("common.footer");
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("ip-mobile-menu-open");
    return () => {
      document.body.style.overflow = original;
      document.body.classList.remove("ip-mobile-menu-open");
    };
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return;
    if (reduced) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.enter } });
      tl.from(".mm-backdrop", { opacity: 0, duration: MOTION.duration.fast }, 0);
      tl.from(
        ".mm-item",
        {
          opacity: 0,
          y: 18,
          filter: "blur(6px)",
          stagger: MOTION.stagger.base,
          duration: MOTION.duration.base
        },
        0.1
      );
      tl.from(".mm-foot", { opacity: 0, y: 12, filter: "blur(4px)", duration: MOTION.duration.base }, 0.32);
    }, panelRef);
    return () => ctx.revert();
  }, [isOpen, reduced]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="fixed inset-0 z-[80]">
      <div className="mm-backdrop absolute inset-0 bg-bg/95 backdrop-blur-md" />

      <div
        className="pointer-events-none absolute -top-24 right-[-12%] h-[300px] w-[300px] rounded-full opacity-70 blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(var(--color-accent-rgb),0.28), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-12%] left-[-15%] h-[260px] w-[260px] rounded-full opacity-50 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(var(--color-accent-light-rgb),0.16), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-muted">{t("menuLabel")}</p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              aria-label={t("closeMenuAria")}
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/18 bg-white/[0.03] text-white/85 transition-colors duration-300 hover:border-accent/55 hover:bg-white/[0.06] hover:text-accentLight"
            >
              <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
                <span className="absolute h-0.5 w-4 rotate-45 rounded-full bg-current" />
                <span className="absolute h-0.5 w-4 -rotate-45 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col justify-center gap-0 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onNavigate(item)}
                className="mm-item group flex items-baseline gap-4 border-b border-white/[0.06] py-3.5 first:pt-0"
              >
                <span
                  className={`font-display text-[15px] italic tabular-nums transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-white/25 group-hover:text-accent/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-ui text-[clamp(1.1rem,5vw,1.5rem)] font-bold leading-tight tracking-[0.3px] transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-text group-hover:text-accentLight"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.8)]"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mm-foot mt-4 flex flex-col gap-4 border-t border-white/[0.07] pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <a
                href="https://wa.me/355694726827"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] font-light tracking-[0.03em] text-white/50 transition-colors duration-300 hover:text-accentLight"
              >
                {tFooter("whatsapp")}
              </a>
              <a
                href="mailto:info@illyrianpixel.com"
                className="font-body text-[13px] font-light tracking-[0.03em] text-white/50 transition-colors duration-300 hover:text-accentLight"
              >
                {tFooter("email")}
              </a>
            </div>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all duration-300 hover:border-accent/40 hover:text-accent"
                >
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            onClick={() => onClose()}
            className="interactive-button ip-cta-primary inline-flex w-full justify-center"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
