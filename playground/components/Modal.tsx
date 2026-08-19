"use client";

import * as React from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function getFocusable(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = React.useId();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  // open hone pe focus dialog me, close pe wapas
  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const focusables = getFocusable(dialogEl);
    (focusables[0] ?? dialogEl).focus();

    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Escape + focus trap
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      const focusables = getFocusable(dialogEl);
      if (focusables.length === 0) {
        e.preventDefault();
        dialogEl.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === dialogEl) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        // overlay click -> close (only if clicked on overlay itself)
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          width: "min(560px, 100%)",
          background: "#111",
          color: "white",
          border: "1px solid #333",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
          <h2 id={titleId} style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: "auto",
              border: "1px solid #444",
              background: "transparent",
              color: "white",
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 12 }}>{children}</div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #444",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Close
          </button>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "white",
              textDecoration: "underline",
              alignSelf: "center",
              marginLeft: "auto",
            }}
          >
            ARIA pattern
          </a>
        </div>
      </div>
    </div>
  );
}