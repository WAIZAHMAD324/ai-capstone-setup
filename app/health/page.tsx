// Server Component — data fetch on server
async function getHealthData() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3", {
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function HealthPage() {
  const data = await getHealthData();
  const timestamp = new Date().toLocaleString();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">🩺 Health Check</h1>
      <p className="mt-4 text-lg text-[var(--muted-foreground)]">
        System status and live data fetch from external API.
      </p>

      {/* Status Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">App Status</p>
          <p className="mt-2 text-2xl font-bold text-[var(--success)]">
            ✅ Online
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">API Status</p>
          <p className="mt-2 text-2xl font-bold">
            {data ? (
              <span className="text-[var(--success)]">✅ Connected</span>
            ) : (
              <span className="text-[var(--danger)]">❌ Failed</span>
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Last Checked</p>
          <p className="mt-2 text-sm font-mono">{timestamp}</p>
        </div>
      </div>

      {/* Fetched Data */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">📡 Live Data from API</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Source: <code className="rounded bg-[var(--secondary)] px-2 py-1 text-xs">jsonplaceholder.typicode.com</code>
        </p>

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((post: { id: number; title: string; body: string }) => (
              <div
                key={post.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition-colors"
              >
                <div className="text-xs text-[var(--muted-foreground)] mb-2">
                  Post #{post.id}
                </div>
                <h3 className="text-lg font-semibold mb-2 capitalize">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">
                  {post.body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--danger)] bg-[var(--card)] p-6 text-center">
            <p className="text-[var(--danger)]">
              ❌ Failed to fetch data. Please check your connection.
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-6">
        <h3 className="font-semibold mb-2">ℹ️ About this page</h3>
        <ul className="text-sm text-[var(--muted-foreground)] space-y-1 list-disc list-inside">
          <li>This is a <strong>Server Component</strong> that fetches data on the server</li>
          <li>Data is cached and revalidated every 60 seconds</li>
          <li>Used to verify the app is deployed and working correctly</li>
        </ul>
      </div>
    </div>
  );
}