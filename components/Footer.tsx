"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { SOCIAL_LINKS } from "@/lib/socialLinks";
import SocialIcon from "@/components/SocialIcon";

export default function Footer() {
  const t = useTranslations("common.footer");
  const footerRef = useRef<HTMLElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!footerRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current?.querySelectorAll(".footer-reveal") ?? [],
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 86%" }
        }
      );

      if (!reducedMotion) {
        gsap.to(".footer-ambient", {
          backgroundPosition: "100% 50%",
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(auraRef.current, {
          yPercent: -8,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, footerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const onFooterMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!auraRef.current || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    auraRef.current.style.setProperty("--mx", `${x}%`);
    auraRef.current.style.setProperty("--my", `${y}%`);
  };

  return (
    <footer
      ref={footerRef}
      onPointerMove={onFooterMove}
      className="footer-signature relative overflow-hidden border-t border-white/10 bg-[#090909]"
    >
      {/* Gold accent line top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Ambient layers */}
      <div className="footer-ambient pointer-events-none absolute inset-0" />
      <div
        ref={auraRef}
        className="pointer-events-none absolute inset-0 opacity-65"
        style={{
          background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(234,206,113,0.16), transparent 38%)"
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(171,131,57,0.08),transparent_52%)]" />

      {/* Noise texture, premium matte feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.02,
          mixBlendMode: "overlay"
        }}
        aria-hidden
      />

      {/* Ghost eagle, 4–5% opacity, centered */}
      <div className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 opacity-[0.045]">
        <Image
          src="/images/illyrianpixel_logo.png"
          alt=""
          width={800}
          height={800}
          className="h-auto w-[260px] md:w-[420px]"
        />
      </div>

      <div className="section-wrap relative py-20 md:py-[120px]">
        <div className="grid items-start gap-12 text-center md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:gap-5 md:text-left lg:gap-10">

          {/* ── Col 1: Brand ── */}
          <div className="flex flex-col items-center md:items-start">
            <div className="footer-reveal inline-flex flex-col items-center gap-3">
              <Image src="/images/illyrianpixel_logo.png" alt="Illyrian Pixel" width={200} height={72} className="h-16 w-auto object-contain" />
              <Image src="/images/illyrianpixel_text.png" alt="Illyrian Pixel" width={360} height={72} className="h-7 w-auto object-contain opacity-70" />
            </div>
            <h3 className="footer-reveal font-display mt-8 max-w-[13ch] text-[clamp(1.3rem,3vw,2.4rem)] font-bold leading-[1.14] md:leading-[1.06] tracking-[-0.01em] md:tracking-[-0.025em] text-white">
              {t("brandTitleLine1")}
              <span className="font-bold text-accent uppercase">{t("brandTitleAccent")}</span>
            </h3>
            <p className="footer-reveal mt-4 font-body text-[0.82rem] font-light text-white/50" style={{ letterSpacing: "1.2px" }}>
              {t("tagline")}
            </p>
            <Link href="/contact" className="footer-reveal group mt-7 inline-flex items-center gap-2.5 rounded-full border border-accent/30 px-5 py-2.5 font-body text-[0.8rem] font-light tracking-[0.06em] text-accent transition-all duration-300 hover:border-accent/70 hover:bg-accent/8 hover:text-accentLight">
              {t("bookConsult")}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* ── Col 2: Navigim ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{t("navHeading")}</p>
            <nav className="flex flex-col items-center gap-[14px] md:items-start" aria-label="Footer navigation">
              {[
                { label: t("nav.services"), href: "/sherbimet" },
                { label: t("nav.work"), href: "/projektet" },
                { label: t("nav.pricing"), href: "/cmimet" },
                { label: t("nav.blog"), href: "/blog" },
                { label: t("nav.contact"), href: "/contact" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="footer-reveal footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/45 transition-colors duration-300 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Col 3: Shërbime ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{t("servicesHeading")}</p>
            <nav className="flex flex-col items-center gap-[14px] md:items-start">
              {[
                { label: t("services.website"), href: "/services/website" },
                { label: t("services.ecommerce"), href: "/services/ecommerce" },
                { label: t("services.seoAds"), href: "/services/seo-google-ads" },
                { label: t("services.social"), href: "/services/smm" },
                { label: t("services.branding"), href: "/services/branding-content" },
                { label: t("services.maintenance"), href: "/services/mirembajtja" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="footer-reveal footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/45 transition-colors duration-300 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Col 4: Kontakt ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{t("contactHeading")}</p>
            <div className="footer-reveal flex flex-col items-center gap-3 md:items-start">
              <Link href="/contact" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.05em] text-accent transition-colors duration-300 hover:text-accentLight">
                {t("contactNow")}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a href="https://wa.me/355694726827" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.05em] text-accent/75 transition-colors duration-300 hover:text-accent">
                {t("whatsapp")}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
            <div className="footer-reveal mt-6 flex flex-col items-center gap-2.5 md:items-start">
              <a href="mailto:info@illyrianpixel.com" className="footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/40 underline-offset-[3px] transition-colors duration-300 hover:text-white hover:[text-decoration:underline]">
                {t("email")}
              </a>
              <span className="font-body text-[0.82rem] font-light tracking-[0.05em] text-white/25">
                {t("locationLine")}
              </span>
            </div>
          </div>

          {/* ── Col 5: Na ndiqni ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{t("followHeading")}</p>
            <div className="flex flex-col items-center gap-[14px] md:items-start">
              {SOCIAL_LINKS.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="footer-reveal group flex items-center gap-2.5 font-body text-[0.875rem] font-light tracking-[0.05em] text-white/45 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent">
                    <SocialIcon icon={item.icon} />
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-reveal footer-bottom mt-16 flex flex-col items-center gap-4 border-t border-white/[0.07] pt-5 pb-[40px] text-center md:mt-20 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-3 md:text-left">
          <p className="font-body text-[12px] font-light tracking-[0.08em] text-white/25 md:tracking-[0.1em]">
            {t("copyright")}
          </p>
          <div className="flex items-center justify-center gap-6">

            <Link
              href="/privacy"
              className="footer-link font-body text-[12px] font-light tracking-[0.05em] text-white/[0.38] transition-colors duration-300 hover:text-white"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="footer-link font-body text-[12px] font-light tracking-[0.05em] text-white/[0.38] transition-colors duration-300 hover:text-white"
            >
              {t("terms")}
            </Link>
          </div>
          <Link
            href="/"
            className="footer-link group inline-flex items-center gap-2 font-body text-[12px] font-light tracking-[0.08em] text-white/25 transition-colors duration-300 hover:text-white md:tracking-[0.1em]"
          >
            {t("backToTop")}{" "}
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-[2px]">↑</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
