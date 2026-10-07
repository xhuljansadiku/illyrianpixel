"use client";

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

// Uses "en-GB" (always fully supported) to extract numeric date parts, then
// assembles the display string ourselves so server and client always agree
// byte-for-byte — avoids hydration mismatches from locale data gaps in Node.
export function dateParts(iso: string, opts: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Tirane", ...opts }).formatToParts(new Date(iso));
  return (type: string) => parts.find((p) => p.type === type)?.value ?? "";
}

export function formatDate(iso: string) {
  const get = dateParts(iso, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${get("day")}/${get("month")}/${get("year")}, ${get("hour")}:${get("minute")}`;
}

export function formatDay(iso: string) {
  const get = dateParts(iso, { day: "2-digit", month: "2-digit" });
  return `${get("day")}/${get("month")}`;
}

export function isOverdue(c: { follow_up_date: string | null; status: string | null }) {
  if (!c.follow_up_date) return false;
  if ((c.status || "new") === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${c.follow_up_date}T00:00:00`) < today;
}

export const STATUS_LABELS: Record<string, string> = {
  new: "I ri",
  "in-progress": "Në proces",
  done: "Mbyllur",
};

export const CARD =
  "relative overflow-hidden rounded-[1.25rem] border border-[var(--a-card-border)] bg-[var(--a-card)] shadow-[var(--a-card-shadow)] backdrop-blur-[12px]";

export const INPUT =
  "font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent";

export const BTN_GOLD =
  "font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50";

export const BTN_PLAIN =
  "font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]";

export const BTN_DANGER =
  "font-ui rounded-[10px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50";

const BTN_VARIANTS = {
  gold: BTN_GOLD,
  plain: BTN_PLAIN,
  danger: BTN_DANGER,
};

export const Button = forwardRef<
  HTMLButtonElement,
  { variant?: "gold" | "plain" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ variant = "plain", className = "", ...props }, ref) {
  return <button ref={ref} className={`${BTN_VARIANTS[variant]} ${className}`} {...props} />;
});

export function EmptyState({ text }: { text: string }) {
  return <p className="p-8 text-center text-[13px] text-[rgb(var(--a-text-rgb)/0.35)]">{text}</p>;
}

// Seksion i palosshëm "English" për formularët e përmbajtjes publike (testimoniale, portofol, FAQ).
export function EnglishFieldsSection({ children, hasContent }: { children: ReactNode; hasContent: boolean }) {
  return (
    <details className="mt-3 rounded-[10px] border border-[var(--a-border)] p-3" open={hasContent}>
      <summary className="cursor-pointer select-none text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)]">
        🇬🇧 English (opsionale) — plotësoje që të dalë edhe në faqen /en
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

// Etiketë e vogël në lista: a e ka rreshti përkthimin anglisht?
export function EnBadge({ translated }: { translated: boolean }) {
  return translated ? (
    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">EN ✓</span>
  ) : (
    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400/90" title="Pa përkthim — nuk shfaqet në /en">pa EN</span>
  );
}

type Toast = { id: string; text: string; kind: "info" | "error" | "success" };

const TOAST_STYLES: Record<Toast["kind"], string> = {
  info: "border-[var(--a-border)] bg-[var(--a-card)] text-[var(--a-text)]",
  error: "border-red-400/30 bg-red-400/10 text-red-400",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

// Self-contained toast stack for components that don't have access to the
// dashboard's global toast state (e.g. tab sub-components).
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (text: string, kind: Toast["kind"] = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  };

  const renderToasts = () => {
    if (toasts.length === 0) return null;
    return (
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-xl border px-4 py-2.5 text-[12px] shadow-2xl ${TOAST_STYLES[t.kind]}`}>
            {t.text}
          </div>
        ))}
      </div>
    );
  };

  return { pushToast: push, renderToasts };
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[rgb(var(--a-text-rgb)/0.08)] ${className}`} />;
}

export function SkeletonRows({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-2 p-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

// Debounce a fast-changing value (e.g. search input) so dependent effects/filters
// only run after the user pauses typing.
export function useDebounced<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

// Shows a temporary "N items deleted — Undo" snackbar. The caller should remove
// the items from its own state immediately (optimistic), then call `show` with
// a restore callback (undo) and a commit callback (runs once the window expires).
export function useUndoToast(delayMs = 5000) {
  const [toast, setToast] = useState<{ message: string; onUndo: () => void } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (message: string, onUndo: () => void, onCommit: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast({
      message,
      onUndo: () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setToast(null);
        onUndo();
      },
    });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      onCommit();
    }, delayMs);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const renderUndoToast = () => {
    if (!toast) return null;
    return (
      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl border border-[var(--a-border)] bg-[var(--a-card)] px-4 py-2.5 text-[12px] text-[var(--a-text)] shadow-2xl">
        <span>{toast.message}</span>
        <button onClick={toast.onUndo} className="font-ui font-semibold text-accent transition-colors hover:underline">
          Zhbëj
        </button>
      </div>
    );
  };

  return { showUndo: show, renderUndoToast };
}

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type ConfirmState = ConfirmOptions & {
  resolve: (ok: boolean) => void;
};

// Promise-based replacement for window.confirm, rendered with the app's own styling
// and a focus trap so it behaves like an accessible modal.
export function useConfirm(): [(opts: ConfirmOptions | string) => Promise<boolean>, () => ReactNode] {
  const [state, setState] = useState<ConfirmState | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const confirm = (opts: ConfirmOptions | string) =>
    new Promise<boolean>((resolve) => {
      const normalized = typeof opts === "string" ? { message: opts } : opts;
      setState({ ...normalized, resolve });
    });

  const close = (ok: boolean) => {
    state?.resolve(ok);
    setState(null);
  };

  useEffect(() => {
    if (!state) return;
    confirmBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const renderConfirm = () => {
    if (!state) return null;
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close(false);
        }}
      >
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          className={`${CARD} w-full max-w-sm p-5`}
        >
          <h3 id="confirm-title" className="font-ui text-[13px] font-semibold text-[var(--a-text)]">
            {state.title ?? "Konfirmo veprimin"}
          </h3>
          <p id="confirm-message" className="mt-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.65)]">
            {state.message}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="plain" onClick={() => close(false)}>
              {state.cancelText ?? "Anulo"}
            </Button>
            <Button
              ref={confirmBtnRef}
              variant={state.danger ? "danger" : "gold"}
              onClick={() => close(true)}
            >
              {state.confirmText ?? "Po, vazhdo"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return [confirm, renderConfirm];
}
