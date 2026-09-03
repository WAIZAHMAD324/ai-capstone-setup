"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HistoryItem = {
  id: string;
  type: "chat" | "notes" | "quiz";
  title: string;
  preview: string;
  createdAt: number;
};

const HISTORY_KEY = "ai-study-buddy-history-v1";

// We will also read your existing chat storage (v2 from chat page)
const CHAT_KEY = "ai-study-buddy-chat-v2";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [chatCount, setChatCount] = useState<number>(0);

  useEffect(() => {
    // Load optional manual history (future-proof)
    const saved = safeParse<HistoryItem[]>(localStorage.getItem(HISTORY_KEY));
    if (saved) setItems(saved);

    // Read chat messages count from chat storage
    const chat = safeParse<any[]>(localStorage.getItem(CHAT_KEY));
    setChatCount(Array.isArray(chat) ? chat.length : 0);
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => b.createdAt - a.createdAt);
  }, [items]);

  function clearHistory() {
    setItems([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-bold">📜 History</h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          A simple history area. Chat is stored automatically in your browser.
          Notes/Quiz history can be added later.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">Chat messages stored</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Current chat storage: <span className="font-semibold">{chatCount}</span> messages
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/chat" className="underline underline-offset-4">
              Open Chat
            </Link>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(CHAT_KEY);
                } catch {
                  // ignore
                }
                setChatCount(0);
              }}
              className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
            >
              Clear chat storage
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">Quick links</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Use these tools and save results manually (future improvement: automatic history).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/notes" className="underline underline-offset-4">
              Notes
            </Link>
            <Link href="/quiz" className="underline underline-offset-4">
              Quiz
            </Link>
            <Link href="/dashboard" className="underline underline-offset-4">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Saved items</h2>
          <button
            type="button"
            onClick={clearHistory}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
          >
            Clear saved items
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            No saved items yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sorted.map((it) => (
              <li
                key={it.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">
                    {it.title}{" "}
                    <span className="text-xs text-[var(--muted-foreground)]">
                      ({it.type})
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(it.createdAt)}
                  </div>
                </div>
                <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {it.preview}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}