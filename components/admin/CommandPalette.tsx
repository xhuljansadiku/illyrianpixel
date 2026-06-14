"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CommandPaletteAction = {
  id: string;
  icon: string;
  label: string;
  hint?: string;
  onRun: () => void;
};

export default function CommandPalette({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: CommandPaletteAction[];
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.hint ?? ""}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered, activeIndex]);

  if (!open) return null;

  const run = (action: CommandPaletteAction) => {
    onClose();
    action.onRun();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paleta e komandave"
        className="w-full max-w-lg overflow-hidden rounded-[2px] border border-[var(--a-border)] bg-[var(--a-card)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const action = filtered[activeIndex];
              if (action) run(action);
            }
          }}
          placeholder="Shkruaj një komandë ose kërko…"
          aria-label="Kërko një komandë"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-palette-list"
          aria-activedescendant={filtered[activeIndex] ? `command-option-${filtered[activeIndex].id}` : undefined}
          autoComplete="off"
          className="font-ui w-full border-b border-[var(--a-border)] bg-transparent px-4 py-3.5 text-[13px] text-[var(--a-text)] outline-none"
        />
        <div id="command-palette-list" role="listbox" className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">Asnjë rezultat.</p>
          ) : (
            filtered.map((action, i) => (
              <button
                key={action.id}
                id={`command-option-${action.id}`}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => run(action)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[12px] transition-colors ${
                  i === activeIndex
                    ? "bg-accent/10 text-[var(--a-text)]"
                    : "text-[rgb(var(--a-text-rgb)/0.7)] hover:bg-[rgb(var(--a-text-rgb)/0.05)] hover:text-[var(--a-text)]"
                }`}
              >
                <span className="text-[15px]">{action.icon}</span>
                <span className="flex-1">{action.label}</span>
                {action.hint && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">
                    {action.hint}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--a-border)] px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.3)]">
          <span>↑↓ lëviz</span>
          <span>↵ zgjedh</span>
          <span>esc mbyll</span>
        </div>
      </div>
    </div>
  );
}
