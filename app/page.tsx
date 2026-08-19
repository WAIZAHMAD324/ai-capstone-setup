import Link from "next/link";

const features = [
  {
    title: "💬 AI Chat",
    description: "Ask any study question, get instant answers",
    href: "/chat",
  },
  {
    title: "📝 Smart Notes",
    description: "Summarize long notes into key points",
    href: "/notes",
  },
  {
    title: "🎯 Quiz Generator",
    description: "Create quizzes from your study material",
    href: "/quiz",
  },
  {
    title: "📊 Dashboard",
    description: "Track your study progress and streaks",
    href: "/dashboard",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-12 sm:py-20">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Study Smarter with{" "}
          <span className="text-[var(--muted-foreground)]">AI Study Buddy</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Your smart companion for smarter studying. Chat with AI, summarize notes,
          and generate quizzes — all in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--primary)] px-6 py-3 text-white font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium hover:bg-[var(--secondary)] transition-colors"
          >
            Try AI Chat
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--muted-foreground)] text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}