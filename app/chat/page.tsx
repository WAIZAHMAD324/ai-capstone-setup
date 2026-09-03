"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = {
  id: string;
  role: "you" | "buddy";
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "ai-study-buddy-chat-v2";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const lastMsgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, error]);

  const canSend = text.trim().length > 0 && !isLoading;

  async function send() {
    const t = text.trim();
    if (!t || isLoading) return;

    setError("");

    const userMsg: Msg = {
      id: makeId(),
      role: "you",
      text: t,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          json?.error ||
          `Request failed (${res.status}). Please try again.`;
        throw new Error(msg);
      }

      const replyText: string | undefined = json?.data?.reply;
      if (!replyText) throw new Error("Empty AI reply. Please try again.");

      const buddyMsg: Msg = {
        id: makeId(),
        role: "buddy",
        text: replyText,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, buddyMsg]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setText("");
    setIsLoading(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-bold">💬 AI Study Chat</h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Ask study questions and get AI answers. For structured extraction,
          use{" "}
          <Link className="underline underline-offset-4" href="/notes">
            Notes
          </Link>
          .
        </p>
      </header>

      <section
        aria-label="Chat messages"
        className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            No messages yet. Type a question below and press Send.
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={m.role === "you" ? "text-right" : "text-left"}
              >
                <div className="inline-block max-w-[85%] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm">
                  <div className="font-semibold">
                    {m.role === "you" ? "You" : "Study Buddy"}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {isLoading ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Thinking…
          </p>
        ) : null}

        {error ? (
          <div
            className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm"
            role="alert"
          >
            <div className="font-semibold">Error</div>
            <div className="mt-1">{error}</div>
          </div>
        ) : null}

        <div ref={lastMsgRef} />
      </section>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="chatText" className="block text-sm font-medium">
          Your message
        </label>
        <textarea
          id="chatText"
          className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your study question..."
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>

          <button
            type="button"
            onClick={clearChat}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm"
          >
            Clear chat
          </button>
        </div>
      </form>
    </div>
  );
}