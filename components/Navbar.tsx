"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import MobileMenu from "@/components/MobileMenu";

const navItems = [
  { id: "hero", label: "Home", href: "/", sectionId: "hero" },
  { id: "services", label: "Shërbimet", href: "/services", sectionId: "services" },
  { id: "featured-work", label: "Punët", href: "/work", sectionId: "featured-work" },
  { id: "process", label: "Procesi", href: "/process", sectionId: "process" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Kontakt", href: "/contact", sectionId: "cta" }
];

const serviceDropdownItems = [
  { id: "services-website", label: "Website", href: "/services/website", group: "PRIMARY" },
  { id: "services-ecommerce", label: "E-commerce", href: "/services/ecommerce", group: "PRIMARY" },
  { id: "services-marketing", label: "Marketing", href: "/services/marketing", group: "SECONDARY" },
  { id: "services-seo", label: "SEO", href: "/services/seo", group: "SECONDARY" },
  { id: "services-branding", label: "Branding", href: "/services/branding", group: "SECONDARY" },
  { id: "services-photography", label: "Photography", href: "/services/photography", group: "OTHER" },
  { id: "services-mirembajtje", label: "Mirëmbajtje", href: "/services/mirembajtje", group: "OTHER" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeFromPath = (() => {
    if (pathname === "/") return "hero";
    if (pathname.startsWith("/services")) return "services";
    if (pathname.startsWith("/work")) return "featured-work";
    if (pathname.startsWith("/process")) return "process";
    if (pathname.startsWith("/blog")) return "blog";
    if (pathname.startsWith("/contact")) return "contact";
    return "hero";
  })();
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState(activeFromPath);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [focusedServiceIdx, setFocusedServiceIdx] = useState(0);
  const sectionItems = useMemo(() => navItems.filter((item) => item.sectionId), []);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const servicesBtnRef = useRef<HTMLButtonElement | null>(null);
  const serviceLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const groupedServices = useMemo(
    () => ({
      PRIMARY: serviceDropdownItems.filter((item) => item.group === "PRIMARY"),
      SECONDARY: serviceDropdownItems.filter((item) => item.group === "SECONDARY"),
      OTHER: serviceDropdownItems.filter((item) => item.group === "OTHER")
    }),
    []
  );

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target) && !servicesBtnRef.current?.contains(target)) {
        setServicesOpen(false);
      }
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesBtnRef.current?.focus();
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [servicesOpen]);

  useIsomorphicLayoutEffect(() => {
    const { ScrollTrigger } = ensureGSAP();
    const triggers: ScrollTrigger[] = [];
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (pathname !== "/") return;
    sectionItems.forEach((item) => {
      const el = document.getElementById(item.sectionId!);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(item.id),
        onEnterBack: () => setActive(item.id)
      });
      triggers.push(st);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname, sectionItems]);

  useIsomorphicLayoutEffect(() => {
    setActive(activeFromPath);
  }, [activeFromPath]);

  const navigate = (item: (typeof navItems)[number]) => {
    if (pathname === "/" && item.sectionId) {
      const el = document.getElementById(item.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(item.id);
        setMobileOpen(false);
        return;
      }
    }
    router.push(item.href);
    setActive(item.id);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          isScrolled ? "border-b border-white/10 bg-[#0b0b0b]/72 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 md:h-[72px] md:px-10 lg:px-14">
          <button
            onClick={(e) => {
              if (e.altKey) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("ip-easter-egg"));
                return;
              }
              navigate(navItems[0]);
            }}
            className="inline-flex items-center"
            aria-label="Shko te fillimi (Alt+klik për surprizë të vogël)"
          >
            <span className="inline-flex max-w-[240px] items-center gap-[10px] whitespace-nowrap transition-all duration-300 hover:-translate-y-[1px] hover:opacity-90">
              <Image
                src="/images/logo.png"
                alt="Illyrian Pixel"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="inline-flex items-center whitespace-nowrap text-[18px] tracking-[0.12em] text-white">
                <span className="mr-[6px] opacity-70">ILLYRIAN</span>
                <span className="font-semibold">PIXEL</span>
              </span>
            </span>
          </button>
          {/* end brand */}
          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              if (item.id === "services") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      ref={servicesBtnRef}
                      onClick={(e) => {
                        e.preventDefault();
                        setServicesOpen((prev) => !prev);
                      }}
                      onFocus={() => setServicesOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setServicesOpen(true);
                          setFocusedServiceIdx(0);
                          window.setTimeout(() => serviceLinkRefs.current[0]?.focus(), 0);
                        }
                      }}
                      className={`inline-flex items-center gap-1 text-sm tracking-[0.08em] transition-colors duration-300 ${
                        active === item.id ? "text-accent" : "text-white/64 hover:text-white/88"
                      }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="menu"
                      aria-controls="services-menu"
                    >
                      {item.label}
                      <span className={`text-[10px] transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>

                    <div
                      id="services-menu"
                      ref={dropdownRef}
                      role="menu"
                      className={`absolute left-1/2 top-full z-[65] mt-4 w-[min(86vw,288px)] max-h-[70vh] -translate-x-1/2 overflow-auto rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,14,14,0.94)_0%,rgba(10,10,10,0.9)_100%)] px-6 py-5 shadow-[0_16px_40px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-300 ease-out ${
                        servicesOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          e.preventDefault();
                          setServicesOpen(false);
                          servicesBtnRef.current?.focus();
                          return;
                        }
                        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                        e.preventDefault();
                        const nextIdx =
                          e.key === "ArrowDown"
                            ? (focusedServiceIdx + 1) % serviceDropdownItems.length
                            : (focusedServiceIdx - 1 + serviceDropdownItems.length) % serviceDropdownItems.length;
                        setFocusedServiceIdx(nextIdx);
                        serviceLinkRefs.current[nextIdx]?.focus();
                      }}
                    >
                      <p className="text-[11px] tracking-[0.2em] text-accent/78">Shërbimet</p>
                      <div className="mt-3 h-px w-full bg-gradient-to-r from-white/0 via-white/18 to-white/0" />
                      <div className="mt-4 space-y-4">
                        {(["PRIMARY", "SECONDARY", "OTHER"] as const).map((groupName) => (
                          <div key={groupName}>
                            <p className="mb-2 text-[10px] tracking-[0.16em] text-white/42">{groupName}</p>
                            <div className="flex flex-col gap-3">
                              {groupedServices[groupName].map((subItem) => {
                                const globalIdx = serviceDropdownItems.findIndex((entry) => entry.id === subItem.id);
                                return (
                                  <Link
                                    key={subItem.id}
                                    ref={(node) => {
                                      serviceLinkRefs.current[globalIdx] = node;
                                    }}
                                    href={subItem.href}
                                    role="menuitem"
                                    onFocus={() => {
                                      setFocusedServiceIdx(globalIdx);
                                      setServicesOpen(true);
                                    }}
                                    onClick={() => setServicesOpen(false)}
                                    className={`group relative flex items-center justify-between rounded-xl pl-3 pr-2 py-1.5 text-sm leading-relaxed transition-all duration-300 ${
                                      pathname === subItem.href ? "text-accent" : "text-white/74 hover:text-[#C89B2E]"
                                    }`}
                                    style={{ transitionDelay: `${globalIdx * 22}ms` }}
                                  >
                                    <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                                    <span className="transition-transform duration-300 group-hover:translate-x-[7px] group-focus-visible:translate-x-[7px]">
                                      {subItem.label}
                                    </span>
                                    <span className="text-accent/85 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100">
                                      →
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                            {groupName !== "OTHER" ? (
                              <div className="mt-4 h-px w-full bg-gradient-to-r from-white/0 via-white/12 to-white/0" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item);
                  }}
                  className={`text-sm tracking-[0.08em] transition-colors duration-300 ${
                    active === item.id ? "text-accent" : "text-white/64 hover:text-white/88"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-inquiry-modal"))}
              data-magnetic="true"
              className="hidden rounded-full border border-accent/65 bg-accent px-4 py-2 text-[11px] tracking-[0.12em] text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(200,155,46,0.25)] md:inline-flex"
            >
              Nis projektin
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 lg:hidden"
              aria-label="Hap menunë"
            >
              <span className="text-lg leading-none">☰</span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        navItems={navItems}
        serviceItems={serviceDropdownItems}
        active={active}
        onClose={() => setMobileOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
}
