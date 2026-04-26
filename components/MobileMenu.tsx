"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavItem = { id: string; label: string; href: string; sectionId?: string };
type ServiceItem = { id: string; label: string; href: string; group: "PRIMARY" | "SECONDARY" | "OTHER" };

type Props = {
  isOpen: boolean;
  navItems: NavItem[];
  serviceItems: ServiceItem[];
  active: string;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
};

export default function MobileMenu({ isOpen, navItems, serviceItems, active, onClose, onNavigate }: Props) {
  const [servicesExpanded, setServicesExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    setServicesExpanded(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[#0b0b0b]/94 backdrop-blur-xl">
      <div className="flex h-full flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.2em] text-accent/80">MENU</p>
          <button aria-label="Mbyll menunë" onClick={onClose} className="text-2xl text-white/82">
            ×
          </button>
        </div>
        <div className="mt-5 flex flex-1 flex-col gap-3.5">
          {navItems.map((item) => {
            if (item.id !== "services") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => onNavigate(item)}
                  className={`text-left font-display text-[clamp(1.8rem,7.6vw,2.25rem)] leading-[0.95] ${
                    active === item.id ? "text-accent" : "text-white/86"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.id} className="w-full">
                <button
                  className="flex w-full items-center justify-between text-left font-display text-[clamp(1.8rem,7.6vw,2.25rem)] leading-[0.95] text-white/86"
                  onClick={() => setServicesExpanded((prev) => !prev)}
                  aria-expanded={servicesExpanded}
                  aria-controls="mobile-services-panel"
                >
                  <span>Shërbimet</span>
                  <span className={`text-base transition-transform duration-300 ${servicesExpanded ? "rotate-180 text-accent" : "text-white/54"}`}>
                    ▾
                  </span>
                </button>

                <div
                  id="mobile-services-panel"
                  className={`mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(16,16,16,0.9)_0%,rgba(10,10,10,0.9)_100%)] transition-all duration-300 ${
                    servicesExpanded ? "max-h-[360px] p-3 opacity-100" : "max-h-0 p-0 opacity-0"
                  }`}
                >
                  <div className="space-y-2.5">
                    {(["PRIMARY", "SECONDARY", "OTHER"] as const).map((group) => (
                      <div key={group}>
                        <p className="mb-1.5 text-[10px] tracking-[0.16em] text-white/42">{group}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {serviceItems
                            .filter((entry) => entry.group === group)
                            .map((entry) => (
                              <Link
                                key={entry.id}
                                href={entry.href}
                                onClick={onClose}
                                className="block rounded-xl border border-white/10 px-3 py-2.5 text-[13px] leading-relaxed text-white/78 transition-colors duration-200 hover:border-accent/40 hover:text-accent"
                              >
                                {entry.label}
                              </Link>
                            ))}
                        </div>
                        {group !== "OTHER" ? <div className="mt-2.5 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-inquiry-modal"));
            onClose();
          }}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-accent/70 bg-accent px-5 py-2.5 text-[11px] tracking-[0.14em] text-black"
        >
          Nis projektin
        </button>
      </div>
    </div>
  );
}
