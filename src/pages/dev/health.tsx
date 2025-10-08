import useSWR from "swr";
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function DevHealth() {
  const { data } = useSWR("/api/health", fetcher, { refreshInterval: 5000 });
  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">Sandbox Health</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.services?.map((s: any) => (
          <div key={s.key} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{s.name}</h2>
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${s.status === "ok" ? "bg-emerald-500" : "bg-rose-500"}`}
              />
            </div>
            <pre className="mt-3 text-xs text-neutral-600 overflow-auto max-h-40">
              {JSON.stringify(s.details, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-500 mt-6">
        Updated: {data?.ts ?? "—"}
      </p>
    </main>
  );
}
