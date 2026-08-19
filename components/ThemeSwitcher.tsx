"use client";

import * as React from "react";

type ThemeMode = "dark" | "light" | "system";

const STORAGE_KEY = "theme-mode";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;

  if (mode === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute("data-theme", mode);
}

function readStoredTheme(): ThemeMode | null {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "dark" || v === "light" || v === "system") return v;
  return null;
}

export function ThemeSwitcher() {
  const [mode, setMode] = React.useState<ThemeMode>("dark");

  // initial load: default dark (if nothing stored)
  React.useEffect(() => {
    const stored = readStoredTheme();
    const initial: ThemeMode = stored ?? "dark";
    setMode(initial);
    applyTheme(initial);

    if (!stored) localStorage.setItem(STORAGE_KEY, initial);
  }, []);

  const onChange = (next: ThemeMode) => {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <div
      aria-label="Theme switcher"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 60,
        border: "1px solid var(--border, #333)",
        background: "var(--card, rgba(0,0,0,0.6))",
        color: "var(--foreground, inherit)",
        borderRadius: 12,
        padding: 10,
        backdropFilter: "blur(8px)",
        width: 180,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Theme</div>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ position: "absolute", left: -9999 }}>Theme</legend>

        {(["dark", "light", "system"] as const).map((v) => (
          <label
            key={v}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              borderRadius: 10,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="radio"
              name="theme-mode"
              value={v}
              checked={mode === v}
              onChange={() => onChange(v)}
            />
            <span style={{ textTransform: "capitalize", fontWeight: 700 }}>
              {v}
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}