import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-bold">📊 Dashboard</h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Quick shortcuts to your main study tools.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">AI Smart Notes</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Paste your notes and extract summary, decisions, and action items.
          </p>
          <div className="mt-4">
            <Link
              href="/notes"
              className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Open Notes
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">What to do next</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--muted-foreground)]">
            <li>Run “Extract with AI” on live /notes</li>
            <li>Keep Lighthouse ≥ 85 (mobile)</li>
            <li>Keep WAVE Errors = 0</li>
            <li>Write README + checklist + reflection</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Other pages</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          These are basic placeholders, but navigation is functional:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/quiz" className="underline underline-offset-4">
            Quiz
          </Link>
          <Link href="/chat" className="underline underline-offset-4">
            Chat
          </Link>
          <Link href="/history" className="underline underline-offset-4">
            History
          </Link>
          <Link href="/settings" className="underline underline-offset-4">
            Settings
          </Link>
          <Link href="/health" className="underline underline-offset-4">
            Health
          </Link>
        </div>
      </section>
    </div>
  );
}