"use client";

import { useEffect, useState } from "react";

type Settings = {
  displayName: string;
  studyGoal: string;
  notifications: boolean;
};

const SETTINGS_KEY = "ai-study-buddy-settings-v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    displayName: "Student",
    studyGoal: "Prepare for exams",
    notifications: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = safeParse<Settings>(localStorage.getItem(SETTINGS_KEY));
    if (existing) setSettings(existing);
  }, []);

  useEffect(() => {
    setSaved(false);
  }, [settings.displayName, settings.studyGoal, settings.notifications]);

  function save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // ignore
    }
  }

  function reset() {
    const defaults: Settings = {
      displayName: "Student",
      studyGoal: "Prepare for exams",
      notifications: false,
    };
    setSettings(defaults);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-4xl font-bold">⚙️ Settings</h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Simple preferences stored locally (localStorage). No account required.
        </p>
      </header>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">
              Display name
            </label>
            <input
              id="displayName"
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={settings.displayName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, displayName: e.target.value }))
              }
              placeholder="e.g., Waiz"
            />
          </div>

          <div>
            <label htmlFor="studyGoal" className="block text-sm font-medium">
              Current study goal
            </label>
            <input
              id="studyGoal"
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              value={settings.studyGoal}
              onChange={(e) =>
                setSettings((s) => ({ ...s, studyGoal: e.target.value }))
              }
              placeholder="e.g., Midterm prep"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            id="notifications"
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings((s) => ({ ...s, notifications: e.target.checked }))
            }
          />
          <label htmlFor="notifications" className="text-sm">
            Enable simple reminders (preference only)
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
          >
            Save settings
          </button>

          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm"
          >
            Reset to defaults
          </button>

          {saved ? (
            <span className="self-center text-sm text-[var(--muted-foreground)]">
              Saved.
            </span>
          ) : null}
        </div>
      </section>
    </div>
  );
}