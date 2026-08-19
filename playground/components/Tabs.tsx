"use client";

import * as React from "react";

export type TabItem = {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  items: TabItem[];
  defaultIndex?: number;
  id?: string;
};

export function Tabs({ items, defaultIndex = 0, id }: TabsProps) {
  const reactId = React.useId();
  const baseId = id ?? reactId;

  const clampIndex = (i: number) => Math.max(0, Math.min(items.length - 1, i));

  const firstEnabledIndex = React.useMemo(() => {
    const idx = items.findIndex((t) => !t.disabled);
    return idx === -1 ? 0 : idx;
  }, [items]);

  const [activeIndex, setActiveIndex] = React.useState<number>(() => {
    const initial = clampIndex(defaultIndex);
    return items[initial]?.disabled ? firstEnabledIndex : initial;
  });

  // Roving tabindex: focus moves with arrows, selection happens on Enter/Space/click
  const [focusIndex, setFocusIndex] = React.useState<number>(activeIndex);

  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    setFocusIndex(activeIndex);
  }, [activeIndex]);

  const focusTab = (index: number) => {
    const clamped = clampIndex(index);
    setFocusIndex(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const findNextEnabled = (start: number, dir: 1 | -1) => {
    if (items.length === 0) return 0;
    let i = start;

    for (let step = 0; step < items.length; step++) {
      i = (i + dir + items.length) % items.length;
      if (!items[i]?.disabled) return i;
    }
    return start;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    if (key === "ArrowRight") {
      e.preventDefault();
      focusTab(findNextEnabled(focusIndex, 1));
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      focusTab(findNextEnabled(focusIndex, -1));
      return;
    }

    if (key === "Home") {
      e.preventDefault();
      focusTab(firstEnabledIndex);
      return;
    }

    if (key === "End") {
      e.preventDefault();
      // last enabled
      let last = items.length - 1;
      while (last > 0 && items[last]?.disabled) last--;
      focusTab(last);
      return;
    }

    if (key === "Enter" || key === " ") {
      e.preventDefault();
      if (!items[focusIndex]?.disabled) setActiveIndex(focusIndex);
      return;
    }
  };

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  return (
    <div onKeyDown={onKeyDown}>
      <div
        role="tablist"
        aria-label="Tabs"
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "1px solid #333",
          paddingBottom: 8,
        }}
      >
        {items.map((item, i) => {
          const selected = i === activeIndex;
          const focusable = i === focusIndex;

          return (
            <button
              key={tabId(i)}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(i)}
              disabled={item.disabled}
              tabIndex={focusable ? 0 : -1}
              onClick={() => {
                if (!item.disabled) setActiveIndex(i);
              }}
              onFocus={() => setFocusIndex(i)}
              style={{
                padding: "8px 10px",
                border: "1px solid #333",
                borderRadius: 8,
                background: selected ? "rgba(124,58,237,0.18)" : "transparent",
                color: "inherit",
                cursor: item.disabled ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, i) => {
        const selected = i === activeIndex;

        return (
          <div
            key={panelId(i)}
            id={panelId(i)}
            role="tabpanel"
            aria-labelledby={tabId(i)}
            tabIndex={0}
            hidden={!selected}
            style={{
              marginTop: 12,
              padding: 12,
              border: "1px solid #333",
              borderRadius: 8,
            }}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}