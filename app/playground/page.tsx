import { PlaygroundDemo } from "../../playground/PlaygroundDemo";

export default function PlaygroundPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Playground</h1>
      <p style={{ marginTop: 8 }}>
        A11y components (Modal, Tabs, Disclosure) yahan test honge.
      </p>

      <PlaygroundDemo />
    </main>
  );
}