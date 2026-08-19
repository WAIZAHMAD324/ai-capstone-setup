"use client";

import * as React from "react";
import { Disclosure } from "./components/Disclosure";
import { Tabs } from "./components/Tabs";
import { Modal } from "./components/Modal";

export function PlaygroundDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ marginTop: 20, maxWidth: 760 }}>
      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          Disclosure
        </h2>
        <Disclosure title="What is Disclosure?">
          <p style={{ margin: 0 }}>
            Button click se content show/hide hota hai. Keyboard: Tab se button
            pe jao, Enter/Space se toggle.
          </p>
        </Disclosure>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          Tabs
        </h2>
        <Tabs
          items={[
            { label: "Chat", content: <p style={{ margin: 0 }}>Chat content</p> },
            { label: "Notes", content: <p style={{ margin: 0 }}>Notes content</p> },
            { label: "Quiz", content: <p style={{ margin: 0 }}>Quiz content</p> },
          ]}
        />
        <p style={{ marginTop: 10, opacity: 0.85 }}>
          Keyboard: Left/Right arrows se focus move, Enter/Space se select,
          Home/End bhi.
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          Modal Dialog
        </h2>

        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 12px",
            border: "1px solid #333",
            borderRadius: 10,
            background: "rgba(124,58,237,0.18)",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Open Modal
        </button>

        <p style={{ marginTop: 10, opacity: 0.85 }}>
          Keyboard: Tab se focus trap test karo, Escape se close, close pe focus
          wapas “Open Modal” pe ana chahiye.
        </p>

        <Modal open={open} title="Demo Modal" onClose={() => setOpen(false)}>
          <p style={{ marginTop: 0 }}>
            Yahan multiple focusable cheezen hain taake focus trap check ho.
          </p>

          <label style={{ display: "block", marginTop: 10 }}>
            <span style={{ display: "block", marginBottom: 6 }}>Your name</span>
            <input
              type="text"
              placeholder="Type here..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #444",
                background: "transparent",
                color: "white",
              }}
            />
          </label>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => alert("Action clicked")}
              style={{
                border: "1px solid #444",
                background: "transparent",
                color: "white",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Action
            </button>

            <a
              href="https://www.w3.org/WAI/ARIA/apg/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "white", textDecoration: "underline", alignSelf: "center" }}
            >
              APG link
            </a>
          </div>
        </Modal>
      </section>
    </div>
  );
}