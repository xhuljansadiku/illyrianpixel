"use client";

import { KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

// Dropdown i markës (zhvendosur nga ContactPageClient 2026-11-06 që ta përdorë edhe ContactModal)
export type DropdownOption = {
  value: string;
  label: string;
};

function normalizeDropdownText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase();
}

export default function BrandDropdown({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pa vlerë → placeholder (më parë binte te opsioni i parë dhe dukej si zgjedhje e bërë)
  const selected = options.find((option) => option.value === value);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selected?.value)
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const clearSearchBuffer = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    searchBufferRef.current = "";
  };

  const scrollOptionIntoView = (index: number) => {
    optionRefs.current[index]?.scrollIntoView({ block: "nearest" });
  };

  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);

    if (open) {
      requestAnimationFrame(() => scrollOptionIntoView(index));
    }
  };

  const findMatchingOptionIndex = (query: string, startIndex: number) => {
    if (!query) return -1;

    const normalizedQuery = normalizeDropdownText(query);
    const isRepeatedCharacter =
      normalizedQuery.length > 1 &&
      normalizedQuery.split("").every((char) => char === normalizedQuery[0]);
    const effectiveQuery = isRepeatedCharacter ? normalizedQuery[0] : normalizedQuery;

    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (startIndex + offset) % options.length;
      const label = normalizeDropdownText(options[index].label);

      if (label.startsWith(effectiveQuery)) {
        return index;
      }
    }

    return -1;
  };

  const runTypeahead = (key: string) => {
    const nextBuffer = `${searchBufferRef.current}${key}`;
    searchBufferRef.current = nextBuffer;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchBufferRef.current = "";
      searchTimeoutRef.current = null;
    }, 650);

    const startIndex = open ? activeIndex + 1 : selectedIndex + 1;
    const matchIndex = findMatchingOptionIndex(nextBuffer, startIndex);

    if (matchIndex === -1) return;

    if (open) {
      updateActiveIndex(matchIndex);
      return;
    }

    onChange(options[matchIndex].value);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      updateActiveIndex((activeIndex + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      updateActiveIndex((activeIndex - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      if (!open) {
        onChange(options[0].value);
        return;
      }

      updateActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      if (!open) {
        onChange(options[options.length - 1].value);
        return;
      }

      updateActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }

      onChange(options[activeIndex].value);
      setOpen(false);
      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (event.key === " " && !open) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(selectedIndex);
      return;
    }

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      runTypeahead(event.key);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(selectedIndex);
      return;
    }

    requestAnimationFrame(() => scrollOptionIntoView(activeIndex));
  }, [activeIndex, open, selectedIndex]);

  useEffect(() => () => clearSearchBuffer(), []);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${selected?.label ?? placeholder ?? ""}`}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={handleKeyDown}
        className={`font-ui flex w-full items-center gap-3 border-b bg-transparent py-3 text-left text-[14px] font-light tracking-[0.3px] outline-none transition-colors duration-300 ${
          open
            ? "border-accent"
            : "border-[#262626] hover:border-accent/45 focus:border-accent"
        }`}
      >
        <span className={`min-w-0 flex-1 truncate ${selected ? "text-white" : "text-muted/55"}`}>
          {selected?.label ?? placeholder}
        </span>
        <span
          aria-hidden
          className={`shrink-0 text-[10px] transition-all duration-300 ${
            open ? "translate-y-[1px] rotate-180 text-accent" : "text-muted"
          }`}
        >
          ↓
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 pt-3">
          <div className="overflow-hidden rounded-2xl border border-accent/20 bg-[rgba(10,10,10,0.98)] p-2 shadow-lift backdrop-blur-xl">
            <div
              className="max-h-72 overflow-y-auto pr-1"
              role="listbox"
              aria-activedescendant={`dropdown-option-${activeIndex}`}
            >
              {options.map((option, index) => {
                const isSelected = option.value === selected?.value;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={option.value}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    id={`dropdown-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      clearSearchBuffer();
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`font-ui flex w-full items-center gap-3 rounded-[0.9rem] px-3 py-3 text-left text-[14px] tracking-[0.3px] transition-colors duration-200 ${
                      isActive
                        ? "bg-accent/14 text-white"
                        : isSelected
                          ? "bg-accent/8 text-white/90"
                          : "text-white/80 hover:bg-accent/10 hover:text-white"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
