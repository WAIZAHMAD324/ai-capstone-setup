"use client";

import { useMemo, useState } from "react";

type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

type QuizData = {
  title: string;
  questions: QuizQuestion[];
};

const SAMPLE_MATERIAL = `QuickSort and MergeSort are comparison-based sorting algorithms.
QuickSort uses divide-and-conquer and partitions around a pivot; average time complexity is O(n log n) but worst case can be O(n^2) with bad pivots.
MergeSort also uses divide-and-conquer; it splits the array, sorts halves, and merges them. Time complexity is O(n log n) in all cases.
MergeSort is stable and often needs extra memory; QuickSort is in-place (typical implementations) and is often fast in practice.`;

export default function QuizPage() {
  const [material, setMaterial] = useState("");
  const [numQuestions, setNumQuestions] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const canGenerate = material.trim().length >= 40 && !isLoading;

  const score = useMemo(() => {
    if (!quiz) return 0;
    let s = 0;
    quiz.questions.forEach((q, i) => {
      if (selected[i] === q.correctIndex) s += 1;
    });
    return s;
  }, [quiz, selected]);

  async function generate() {
    const m = material.trim();
    if (m.length < 40 || isLoading) return;

    setError("");
    setQuiz(null);
    setSelected({});
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material: m, numQuestions, difficulty }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = json?.error || `Request failed (${res.status}). Please try again.`;
        throw new Error(msg);
      }

      const data: QuizData | undefined = json?.data;
      if (!data?.title || !Array.isArray(data?.questions)) {
        throw new Error("Invalid quiz response. Please try again.");
      }

      setQuiz(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  function loadSample() {
    setMaterial(SAMPLE_MATERIAL);
    setError("");
  }

  function clearAll() {
    setMaterial("");
    setQuiz(null);
    setSelected({});
    setError("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-bold">🎯 AI Quiz Generator</h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Paste study material and generate a multiple-choice quiz with explanations.
        </p>
      </header>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <label htmlFor="material" className="block text-sm font-medium">
          Study material (minimum 40 characters)
        </label>
        <textarea
          id="material"
          className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
          rows={8}
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Paste your notes or textbook excerpt here..."
        />

        <div className="mt-3 text-xs text-[var(--muted-foreground)]">
          Characters: {material.length}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium">
              Questions
            </label>
            <select
              id="numQuestions"
              className="mt-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value) as any)}
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="mt-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadSample}
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm"
            >
              Load sample
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={generate}
              disabled={!canGenerate}
              className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Generating…" : "Generate quiz"}
            </button>
          </div>
        </div>

        {error ? (
          <div
            className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm"
            role="alert"
          >
            <div className="font-semibold">Error</div>
            <div className="mt-1">{error}</div>
          </div>
        ) : null}
      </section>

      {quiz ? (
        <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <div className="text-sm text-[var(--muted-foreground)]">
              Score: <span className="font-semibold">{score}</span> / {quiz.questions.length}
            </div>
          </div>

          <ol className="mt-6 space-y-6">
            {quiz.questions.map((q, i) => {
              const chosen = selected[i];
              const isAnswered = typeof chosen === "number";
              const isCorrect = chosen === q.correctIndex;

              return (
                <li key={i} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="font-semibold">
                    {i + 1}. {q.question}
                  </div>

                  <fieldset className="mt-3 space-y-2">
                    <legend className="sr-only">Choose an option</legend>
                    {q.options.map((opt, idx) => (
                      <label key={idx} className="flex cursor-pointer items-start gap-2 text-sm">
                        <input
                          type="radio"
                          name={`q-${i}`}
                          className="mt-1"
                          checked={selected[i] === idx}
                          onChange={() => setSelected((prev) => ({ ...prev, [i]: idx }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </fieldset>

                  {isAnswered ? (
                    <div
                      className={`mt-3 rounded-md border p-3 text-sm ${
                        isCorrect
                          ? "border-green-500/30 bg-green-500/10"
                          : "border-yellow-500/30 bg-yellow-500/10"
                      }`}
                      role="status"
                    >
                      <div className="font-semibold">
                        {isCorrect ? "Correct" : `Incorrect (correct option is ${q.correctIndex + 1})`}
                      </div>
                      <div className="mt-1">{q.explanation}</div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}