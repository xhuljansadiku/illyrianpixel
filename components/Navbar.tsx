"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ensureGSAP, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import MobileMenu from "@/components/MobileMenu";

const navItems = [
  { id: "hero",          label: "Home",       href: "/" },
  { id: "services",     label: "Sh\u00ebrbimet",  href: "/sherbimet" },
  { id: "pricing",      label: "\u00c7mimet",     href: "/cmimet" },
  { id: "featured-work",label: "Projektet",  href: "/projektet" },
  { id: "blog",         label: "Blog",       href: "/blog" },
  { id: "contact",      label: "Kontakt",    href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const activeFromPath = (() => {
    if (pathname === "/") return "hero";
    if (pathname.startsWith("/cmimet")) return "pricing";
    if (pathname.startsWith("/services") || pathname.startsWith("/sherbimet")) return "services";
    if (pathname.startsWith("/work") || pathname.startsWith("/projektet")) return "featured-work";
    if (pathname.startsWith("/blog")) return "blog";
    if (pathname.startsWith("/contact")) return "contact";
    return "hero";
  })();
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState(activeFromPath);
  const [mobileOpen, setMobileOpen] = useState(false);

  useLayoutEffect(() => {
    if (reduced) return;
    const { gsap } = ensureGSAP();
    const headerEl = headerRef.current;
    const desktop = desktopNavRef.current;
    const actions = actionsRef.current;
    if (!headerEl || !actions) return;

    const ctx = gsap.context(() => {
      const linkInners = desktop?.querySelectorAll<HTMLElement>(".ip-nav-link-inner");
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.enter } });
      const linkStart = 0;
      if (linkInners?.length) {
        tl.from(
          linkInners,
          {
            opacity: 0,
            y: -10,
            filter: "blur(4px)",
            stagger: MOTION.stagger.tight,
            duration: MOTION.duration.fast + 0.14,
            ease: "power3.out"
          },
          linkStart
        );
      }
      tl.from(
        actions,
        { opacity: 0, y: -8, filter: "blur(4px)", duration: MOTION.duration.base, ease: "power3.out" },
        linkInners?.length ? 0.08 : 0
      );
    }, headerEl);

    return () => ctx.revert();
  }, [reduced]);

  useIsomorphicLayoutEffect(() => {
    ensureGSAP();
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useIsomorphicLayoutEffect(() => {
    setActive(activeFromPath);
  }, [activeFromPath]);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const { gsap } = ensureGSAP();
    const el = headerRef.current;
    if (!el) return;
    gsap.to(el, {
      boxShadow: isScrolled
        ? "0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset"
        : "0 0 0 rgba(0,0,0,0)",
      duration: MOTION.duration.fast + 0.1,
      ease: MOTION.ease.smooth
    });
  }, [isScrolled, reduced]);

  const navigate = (item: (typeof navItems)[number]) => {
    router.push(item.href);
    setActive(item.id);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          isScrolled ? "border-b border-white/[0.05] bg-bg/72 backdrop-blur-[12px]" : "bg-transparent"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(var(--color-accent-rgb), 0.45), rgba(var(--color-accent-light-rgb), 0.35), transparent)"
          }}
          aria-hidden
        />
        <nav className="relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-5 md:h-[72px] md:px-10 lg:px-14">
          <button
            type="button"
            onClick={(e) => {
              if (e.altKey) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("ip-easter-egg"));
                return;
              }
              navigate(navItems[0]);
            }}
            className="flex min-w-0 flex-1 items-center text-left sm:flex-initial sm:min-w-0"
            aria-label="Shko te fillimi (Alt+klik p\u00ebr surpriz\u00eb t\u00eb vog\u00ebl)"
          >
            <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 transition-all duration-300 hover:-translate-y-[1px] hover:opacity-90 sm:gap-2.5 md:gap-[10px]">
              <Image
                src="/images/illyrianpixel_logo.png"
                alt=""
                width={200}
                height={72}
                className="h-8 w-auto max-w-[76px] shrink-0 object-contain sm:h-9 sm:max-w-[104px] md:max-w-[118px]"
              />
              <Image
                src="/images/illyrianpixel_text.png"
                alt="Illyrian Pixel"
                width={360}
                height={72}
                className="h-8 min-w-0 w-auto max-w-[min(118px,30vw)] shrink object-contain object-left sm:h-9 sm:max-w-[min(180px,36vw)] md:max-w-[min(220px,46vw)] lg:max-w-[260px]"
              />
            </span>
          </button>

          <div ref={desktopNavRef} className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`ip-nav-link-inner font-ui text-[14px] font-bold tracking-[1px] transition-colors duration-300 ${
                  active === item.id
                    ? "text-accent hover:text-accentLight"
                    : "text-white/64 hover:text-accentLight"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div ref={actionsRef} className="flex shrink-0 items-center gap-2 sm:gap-2.5 md:gap-3">
            <Link
              href="/contact"
              data-magnetic="true"
              className="interactive-button ip-cta-primary ip-cta-navbar inline-flex items-center justify-center self-center"
            >
              Fillo sot
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 min-h-[40px] w-10 min-w-[40px] touch-manipulation items-center justify-center rounded-full border border-white/18 bg-white/[0.03] text-white/85 transition-colors duration-300 hover:border-accent/55 hover:bg-white/[0.06] hover:text-accentLight lg:hidden"
              aria-label="Hap menun\u00eb"
            >
              <span className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]" aria-hidden>
                <span className="block h-0.5 w-[18px] rounded-full bg-current" />
                <span className="block h-0.5 w-[18px] rounded-full bg-current" />
                <span className="block h-0.5 w-[18px] rounded-full bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        navItems={navItems}
        active={active}
        onClose={() => setMobileOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
}
