"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-bg/94 backdrop-blur-md">
      <div className="flex h-full flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[11px] font-bold tracking-[1px] text-muted">{t("menuLabel")}</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button aria-label={t("closeMenuAria")} onClick={onClose} className="text-2xl text-white/82">
              ×
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-1 flex-col gap-3.5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onNavigate(item)}
              className={`text-left font-ui text-[clamp(1.25rem,5.5vw,1.65rem)] font-bold leading-tight tracking-[1px] transition-colors duration-300 ${
                active === item.id
                  ? "text-accent hover:text-accentLight"
                  : "text-text hover:text-accentLight"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          onClick={() => onClose()}
          className="interactive-button ip-cta-primary mt-3 inline-flex w-full justify-center sm:w-auto"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
