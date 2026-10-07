"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { LogoLockup } from "../brand/Logo";
import { StartProjectButton } from "../contact/StartProjectButton";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type NavItem = { href: StaticPathname; label: string };

export type HeaderLabels = {
  nav: string;
  home: string;
  cta: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  language: string;
};

type SiteHeaderProps = { items: NavItem[]; labels: HeaderLabels };

function currentState(pathname: string, href: string): "page" | "true" | undefined {
  if (pathname === href) return "page";
  if (pathname.startsWith(`${href}/`)) return "true";
  return undefined;
}

export function SiteHeader({ items, labels }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container site-header__inner">
          <Link href="/" className="logo" aria-label={labels.home}>
            <LogoLockup />
          </Link>

          <nav className="site-nav" aria-label={labels.nav}>
            <ul className="site-nav__list">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-nav__link" aria-current={currentState(pathname, item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <LanguageSwitcher label={labels.language} className="site-header__lang" />
            <StartProjectButton size="sm" className="site-header__cta" source="header">
              {labels.cta}
            </StartProjectButton>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="sr-only">{labels.openMenu}</span>
              <span className="menu-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} items={items} labels={labels} pathname={pathname} />
    </>
  );
}

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  labels: HeaderLabels;
  pathname: string;
};

function MobileMenu({ open, onClose, items, labels, pathname }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // If the viewport grows to desktop size while the menu is open, close it.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      className="mobile-menu"
      aria-label={labels.menu}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <div className="mobile-menu__inner">
        <div className="container mobile-menu__header">
          <Link href="/" className="logo" aria-label={labels.home} onClick={onClose}>
            <LogoLockup />
          </Link>
          <button type="button" className="mobile-menu__close" onClick={onClose} aria-label={labels.closeMenu}>
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav className="container mobile-menu__nav" aria-label={labels.nav}>
          <ul className="mobile-menu__list">
            {items.map((item, index) => (
              <li key={item.href} className="mobile-menu__item" style={{ "--i": index } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="mobile-menu__link"
                  aria-current={currentState(pathname, item.href)}
                  onClick={onClose}
                >
                  <span className="mobile-menu__label">{item.label}</span>
                  <Icon name="arrow-right" size={22} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container mobile-menu__footer">
          <div className="mobile-menu__lang">
            <span>{labels.language}</span>
            <LanguageSwitcher label={labels.language} />
          </div>
          <StartProjectButton size="lg" block icon="arrow" source="mobile-menu" onBeforeOpen={onClose}>
            {labels.cta}
          </StartProjectButton>
        </div>
      </div>
    </dialog>
  );
}
