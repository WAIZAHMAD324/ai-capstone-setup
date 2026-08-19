"use client";

import * as React from "react";

type DisclosureProps = {
  /** Button ka text */
  title: string;
  /** Optional: start me open ho */
  defaultOpen?: boolean;
  /** Optional: custom id prefix */
  id?: string;
  children: React.ReactNode;
};

export function Disclosure({
  title,
  defaultOpen = false,
  id,
  children,
}: DisclosureProps) {
  const reactId = React.useId();
  const contentId = `${id ?? reactId}-content`;
  const buttonId = `${id ?? reactId}-button`;

  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  return (
    <div>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "10px 12px",
          border: "1px solid #333",
          borderRadius: 8,
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {title}
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        style={{
          marginTop: 10,
          padding: 12,
          border: "1px solid #333",
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}