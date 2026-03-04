"use client";

import { useState, useCallback, useRef, type KeyboardEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  defaultId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, defaultId, onChange, className = "" }: TabsProps) {
  const [internalId, setInternalId] = useState(defaultId ?? items[0]?.id ?? "");
  const currentId = activeId ?? internalId;
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (id: string) => {
      if (!activeId) setInternalId(id);
      onChange?.(id);
    },
    [activeId, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      if (e.key === "ArrowRight") nextIndex = (index + 1) % items.length;
      else if (e.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = items.length - 1;
      else return;

      e.preventDefault();
      tabsRef.current[nextIndex]?.focus();
      handleSelect(items[nextIndex].id);
    },
    [items, handleSelect]
  );

  return (
    <div
      role="tablist"
      className={`flex gap-1 border-b ${className}`}
      style={{ borderColor: "var(--color-border)" }}
    >
      {items.map((tab, i) => {
        const isActive = tab.id === currentId;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabsRef.current[i] = el; }}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="relative px-4 pb-3 pt-2 text-[0.9375rem] font-medium transition-colors duration-150"
            style={{
              color: isActive ? "var(--color-ink)" : "var(--color-ink-tertiary)",
            }}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
