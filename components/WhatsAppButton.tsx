"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/gsap";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355000000000";
const WHATSAPP_TEXT = encodeURIComponent("Përshëndetje Illyrian Pixel, dua të flasim për projektin tim.");

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!buttonRef.current) return;
    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty("--whatsapp-height", `${buttonRef.current?.offsetHeight ?? 0}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Na kontakto në WhatsApp"
      className="fixed z-[35] inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#25D366]/45 bg-[#25D366] text-white shadow-[0_10px_28px_rgba(0,0,0,0.42)] transition-transform duration-300 hover:scale-[1.04] sm:h-12 sm:w-12"
      style={{
        left: "24px",
        bottom: "24px"
      }}
    >
      <svg viewBox="0 0 32 32" aria-hidden className="h-6 w-6 fill-current">
        <path d="M19.11 17.21c-.25-.13-1.5-.74-1.73-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.52.12-.12.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44-.15-.01-.32-.01-.5-.01-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29z" />
        <path d="M16 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.25.58 4.45 1.68 6.39L3 29l6.8-1.79c1.87 1.02 3.97 1.56 6.2 1.56 7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2zm0 23.46c-2 0-3.95-.56-5.63-1.63l-.4-.25-4.04 1.06 1.08-3.94-.26-.41A10.63 10.63 0 0 1 5.4 16c0-5.84 4.75-10.6 10.6-10.6S26.6 10.16 26.6 16 21.84 26.66 16 26.66z" />
      </svg>
    </a>
  );
}

