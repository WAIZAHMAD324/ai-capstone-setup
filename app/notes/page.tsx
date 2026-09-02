"use client";

import { useState } from "react";

interface ActionItem {
  title: string;
  owner?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "open" | "done";
}

interface ExtractedData {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
}

const SAMPLE_NOTES = `CS101 Algorithm Study Group - Session 4
Date: 2026-08-30
Attendees: Ali (Lead), Waiz, Sara

Today we reviewed QuickSort and MergeSort. We agreed that MergeSort is better for linked lists because of sequential access, while QuickSort is better for in-place array sorting. We decided to use MergeSort for the upcoming midterm project submission.

Action Items:
- Waiz needs to write the benchmark comparison script by 2026-09-05 (High priority).
- Ali will draft the final PDF report structure by 2026-09-07.
- Sara to review time complexities and prepare slides for the presentation.`;

export default function NotesPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractedData | null>(null);

  const handleSample = () => {
    setInputText(SAMPLE_NOTES);
    setError(null);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim().length < 20) {
      setError("Please enter at least 20 characters of notes.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to process notes.");
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActionItemStatus = (index: number) => {
    if (!result) return;
    const updated = [...result.actionItems];
    updated[index].status = updated[index].status === "open" ? "done" : "open";
    setResult({ ...result, actionItems: updated });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--foreground)]">
          📝 AI Smart Notes & Action Items
        </h1>
        <p className="mt-2 text-base text-[var(--muted-foreground)]">
          Paste your study group notes, lectures, or meeting transcripts. Claude will automatically extract summaries, key decisions, and actionable tasks.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleExtract} className="space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="notes-input"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Study Notes / Text (minimum 20 characters)
          </label>
          <button
            type="button"
            onClick={handleSample}
            className="text-xs font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-1"
          >
            📋 Load Sample Notes
          </button>
        </div>

        <textarea
          id="notes-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste lecture notes, study discussions, or meeting notes here..."
          rows={7}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-required="true"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[var(--muted-foreground)]">
            Characters: {inputText.length}
          </span>
          <div className="flex gap-2">
            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText("");
                  setResult(null);
                  setError(null);
                }}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--card)] transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={loading || inputText.trim().length < 20}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing with Claude...
                </>
              ) : (
                "⚡ Extract with AI"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true">⚠️</span>
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <section
          aria-live="polite"
          className="mt-10 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              ✨ Extracted Insights
            </h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
              AI Processed
            </span>
          </div>

          {/* 1. Summary */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              📌 Summary
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
              {result.summary}
            </p>
          </div>

          {/* 2. Decisions */}
          {result.decisions && result.decisions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                🎯 Key Decisions Made
              </h3>
              <ul className="mt-3 space-y-2 list-disc list-inside text-sm text-[var(--foreground)]">
                {result.decisions.map((decision, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {decision}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Action Items */}
          {result.actionItems && result.actionItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                ✅ Action Items & Tasks ({result.actionItems.length})
              </h3>
              <div className="mt-3 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
                {result.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 transition-colors ${
                      item.status === "done" ? "bg-black/5 dark:bg-white/5 opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`task-${idx}`}
                        checked={item.status === "done"}
                        onChange={() => toggleActionItemStatus(idx)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                      />
                      <label
                        htmlFor={`task-${idx}`}
                        className={`text-sm font-medium cursor-pointer ${
                          item.status === "done"
                            ? "line-through text-[var(--muted-foreground)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {item.title}
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0 text-xs">
                      {item.owner && (
                        <span className="rounded bg-[var(--border)] px-2 py-0.5 text-[var(--foreground)]">
                          👤 {item.owner}
                        </span>
                      )}
                      {item.dueDate && (
                        <span className="rounded bg-[var(--border)] px-2 py-0.5 text-[var(--foreground)]">
                          📅 {item.dueDate}
                        </span>
                      )}
                      <span
                        className={`rounded px-2 py-0.5 font-medium uppercase ${
                          item.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : item.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}