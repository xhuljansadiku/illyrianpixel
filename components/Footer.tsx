"use client";

import { useRef } from "react";
import Image from "next/image";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import { SOCIAL_LINKS, type SocialIconId } from "@/lib/socialLinks";

function SocialIcon({ icon }: { icon: SocialIconId }) {
  if (icon === "instagram") return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.8]">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
  if (icon === "tiktok") return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M15 3h2.2c.5 2 1.8 3.4 3.8 3.8V9a7.2 7.2 0 0 1-4-1.2v6.9a5.7 5.7 0 1 1-5.7-5.7h.2v2.3h-.2a3.4 3.4 0 1 0 3.4 3.4V3z" />
    </svg>
  );
  if (icon === "facebook") return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M13.5 21v-8h2.8l.4-3.1h-3.2V7.8c0-.9.3-1.6 1.6-1.6h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.3H8V13h2.7v8h2.8z" />
    </svg>
  );
  if (icon === "threads") return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M12.18 2c-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89-1.056 0-1.991.308-2.721 1.32L7.734 7.847C8.714 6.393 10.302 5.591 12.212 5.591c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014z" />
    </svg>
  );
  if (icon === "linkedin") return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M6 8.5A1.5 1.5 0 1 1 6 5.5a1.5 1.5 0 0 1 0 3zm-1.3 13V10.2h2.6v11.3H4.7zM10 10.2h2.5v1.5h.1c.5-.9 1.7-1.8 3.5-1.8 3 0 4 2 4 4.7v6.9h-2.6v-6.1c0-1.5 0-3.4-2-3.4s-2.4 1.6-2.4 3.3v6.2H10V10.2z" />
    </svg>
  );
  return null;
}



export default function Footer() {
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
              <Image src="/images/illyrianpixel_logo.png" alt="" width={200} height={72} className="h-16 w-auto object-contain" />
              <Image src="/images/illyrianpixel_text.png" alt="Illyrian Pixel" width={360} height={72} className="h-7 w-auto object-contain opacity-70" />
            </div>
            <h3 className="footer-reveal font-display mt-8 max-w-[13ch] text-[clamp(1.3rem,3vw,2.4rem)] font-bold leading-[1.14] md:leading-[1.06] tracking-[-0.01em] md:tracking-[-0.025em] text-white">
              {"Ktheje biznesin në "}
              <span className="font-bold text-accent uppercase">{"brand."}</span>
            </h3>
            <p className="footer-reveal mt-4 font-body text-[0.82rem] font-light text-white/50" style={{ letterSpacing: "1.2px" }}>
              {"Vetëm një klikim larg jush."}
            </p>
            <a href="/contact" className="footer-reveal group mt-7 inline-flex items-center gap-2.5 rounded-full border border-accent/30 px-5 py-2.5 font-body text-[0.8rem] font-light tracking-[0.06em] text-accent transition-all duration-300 hover:border-accent/70 hover:bg-accent/8 hover:text-accentLight">
              {"Rezervo konsultë"}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* ── Col 2: Navigim ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{"Navigim"}</p>
            <nav className="flex flex-col items-center gap-[14px] md:items-start" aria-label="Footer navigation">
              {[
                { label: "Shërbimet", href: "/sherbimet" },
                { label: "Projektet", href: "/projektet" },
                { label: "Çmimet", href: "/cmimet" },
                { label: "Rreth Nesh", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Kontakt", href: "/contact" },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="footer-reveal footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/45 transition-colors duration-300 hover:text-white">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── Col 3: Shërbime ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{"Shërbime"}</p>
            <nav className="flex flex-col items-center gap-[14px] md:items-start">
              {[
                { label: "Website Premium", href: "/services/website" },
                { label: "E-Commerce", href: "/services/ecommerce" },
                { label: "SEO & Reklama", href: "/services/marketing-growth" },
                { label: "Social Media", href: "/services/smm" },
                { label: "Branding & Content", href: "/services/branding-content" },
                { label: "Mirëmbajtja", href: "/contact" },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="footer-reveal footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/45 transition-colors duration-300 hover:text-white">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── Col 4: Kontakt ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{"Kontakt"}</p>
            <div className="footer-reveal flex flex-col items-center gap-3 md:items-start">
              <a href="/contact" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.05em] text-accent transition-colors duration-300 hover:text-accentLight">
                {"Kontakto Tani"}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a href="https://wa.me/355694726827" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-body text-[0.875rem] font-light tracking-[0.05em] text-accent/75 transition-colors duration-300 hover:text-accent">
                {"WhatsApp"}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
            <div className="footer-reveal mt-6 flex flex-col items-center gap-2.5 md:items-start">
              <a href="mailto:info@illyrianpixel.com" className="footer-link font-body text-[0.875rem] font-light tracking-[0.05em] text-white/40 underline-offset-[3px] transition-colors duration-300 hover:text-white hover:[text-decoration:underline]">
                {"info@illyrianpixel.com"}
              </a>
              <span className="font-body text-[0.82rem] font-light tracking-[0.05em] text-white/25">
                {"Shqipëri · Gjermani · Online"}
              </span>
            </div>
          </div>

          {/* ── Col 5: Na ndiqni ── */}
          <div className="flex flex-col items-center md:items-start md:pt-1">
            <p className="footer-reveal mb-6 text-[10px] uppercase tracking-[0.22em] text-white/25">{"Na ndiqni"}</p>
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
        <div className="footer-reveal footer-bottom mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 pb-[40px] md:mt-20">
          <p className="font-body text-[12px] font-light tracking-[0.1em] text-white/25">
            © 2026 Illyrian Pixel
          </p>
          <div className="flex items-center gap-6">

            <a
              href="/privacy"
              className="footer-link font-body text-[12px] font-light tracking-[0.05em] text-white/[0.38] transition-colors duration-300 hover:text-white"
            >
              Privatësia
            </a>
            <a
              href="/terms"
              className="footer-link font-body text-[12px] font-light tracking-[0.05em] text-white/[0.38] transition-colors duration-300 hover:text-white"
            >
              Kushtet
            </a>
          </div>
          <a
            href="/"
            className="footer-link group inline-flex items-center gap-2 font-body text-[12px] font-light tracking-[0.1em] text-white/25 transition-colors duration-300 hover:text-white"
          >
            Kthehu sipër{" "}
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-[2px]">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
