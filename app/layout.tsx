import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Study Buddy",
  description: "Your smart companion for smarter studying",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
  { href: "/notes", label: "Notes" },
  { href: "/quiz", label: "Quiz" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
  { href: "/health", label: "Health" },
  { href: "/playground", label: "Playground" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Theme init (default dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const key = "theme-mode";
    const stored = localStorage.getItem(key);
    const root = document.documentElement;

    // default: dark
    if (!stored) {
      localStorage.setItem(key, "dark");
      root.setAttribute("data-theme", "dark");
      return;
    }

    if (stored === "dark" || stored === "light") {
      root.setAttribute("data-theme", stored);
      return;
    }

    // system
    root.removeAttribute("data-theme");
  } catch {}
})();
`,
          }}
        />

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--primary)]">
                🧠 AI Study Buddy
              </span>
            </Link>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile menu */}
            <details className="md:hidden relative">
              <summary className="cursor-pointer list-none rounded-md p-2 hover:bg-[var(--secondary)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </summary>

              <ul className="absolute right-0 mt-2 w-48 rounded-md border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-6">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
            <p>© 2025 AI Study Buddy · Built with Next.js & Tailwind CSS</p>
          </div>
        </footer>

        <ThemeSwitcher />
      </body>
    </html>
  );
}