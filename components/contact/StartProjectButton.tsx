"use client";

import type { MouseEvent, ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { Button, type ButtonSize, type ButtonVariant } from "../ui/Button";
import { useProjectModal } from "./ProjectModal";

type StartProjectButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: "arrow" | "arrow-up-right";
  block?: boolean | "mobile";
  className?: string;
  /** Where the button sits — included in the inquiry for context. */
  source?: string;
  /** Called before the modal opens (e.g. to close the mobile menu). */
  onBeforeOpen?: () => void;
};

/**
 * "Start a project" — a real link to the contact page that opens the inquiry
 * modal instead when JavaScript is available. Modified clicks (new tab etc.)
 * keep normal link behaviour. On the contact page itself it jumps to the form.
 */
export function StartProjectButton({ children, source, onBeforeOpen, ...buttonProps }: StartProjectButtonProps) {
  const modal = useProjectModal();
  const pathname = usePathname();

  if (pathname === "/contact") {
    return (
      <Button {...buttonProps} href={{ pathname: "/contact", hash: "form" }} onClick={onBeforeOpen}>
        {children}
      </Button>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!modal || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onBeforeOpen?.();
    modal.open(source);
  };

  return (
    <Button
      {...buttonProps}
      href="/contact"
      onClick={handleClick}
      onPointerEnter={modal?.prefetch}
      onFocus={modal?.prefetch}
    >
      {children}
    </Button>
  );
}
