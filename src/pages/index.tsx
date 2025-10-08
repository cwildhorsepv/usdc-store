import { useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import WhyUsdcStore from "@components/WhyUsdcStore";

type Service = {
  key: string;
  name: string;
  status: "ok" | "error";
  details?: any;
};

type HealthResponse = {
  services: Service[];
  ts: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function StatusPill({
  status,
  label,
  count,
}: {
  status: "ok" | "error";
  label: string;
  count?: number;
}) {
  const color = status === "ok" ? "bg-emerald-500" : "bg-rose-500";
  const ring = status === "ok" ? "ring-emerald-500/20" : "ring-rose-500/20";
  return (
    <div
      className={`flex items-center gap-2 rounded-full ${ring} ring-2 px-3 py-1`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${color} animate-pulse`}
      />
      <span className="text-sm font-medium text-neutral-900">{label}</span>
      {typeof count === "number" && (
        <span className="text-xs text-neutral-500">({count})</span>
      )}
    </div>
  );
}

export default function Home() {
  const { data, isLoading } = useSWR<HealthResponse>("/api/health", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

  const services = useMemo(() => data?.services ?? [], [data]);

  // Try to surface any "count" fields if present in stub health payloads
  const countFor = (key: string) => {
    const s = services.find((x) => x.key === key);
    if (!s?.details) return undefined;
    const { count, total, pending } = s.details;
    return count ?? total ?? pending;
  };

  return (
    <>
      <Head>
        <title>USDC Store Sandbox</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]">
            <div className="absolute -top-20 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl bg-emerald-200" />
            <div className="absolute top-20 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-3xl bg-cyan-200" />
          </div>

          <div className="mx-auto max-w-6xl px-6 pt-20 pb-8">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900"
            >
              USDC you can actually use.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 max-w-2xl text-lg text-neutral-600"
            >
              Buy once, pay anywhere. The sandbox below is wired to live
              services — Secret Store, Guardians, ACH, EVM, and Webhooks — all
              DB-backed for predictable testing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {isLoading && (
                <div className="text-sm text-neutral-500">
                  checking services…
                </div>
              )}
              {services.map((s) => (
                <StatusPill
                  key={s.key}
                  status={s.status}
                  label={s.name}
                  count={countFor(s.key)}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                href="/wallets"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold shadow-sm hover:bg-neutral-800 transition"
              >
                Open Wallets
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-emerald-500 transition"
              >
                Try Checkout
              </Link>
              <Link
                href="/delegations"
                className="inline-flex items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 px-5 py-3 text-neutral-900 font-semibold hover:ring-neutral-300 transition"
              >
                Delegations
              </Link>
              <Link
                href="/dev/health"
                className="inline-flex items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 px-5 py-3 text-neutral-900 font-semibold hover:ring-neutral-300 transition"
              >
                Health Panel
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Acquire",
                desc: "Simple USDC onboarding with wallet creation baked in.",
                href: "/checkout",
              },
              {
                title: "Use",
                desc: "Pay merchants instantly via EVM or ACH rails, auto-confirmed.",
                href: "/checkout",
              },
              {
                title: "Protect",
                desc: "Guardians + Secret Store for recoverable, delegated security.",
                href: "/delegations",
              },
              {
                title: "Settle",
                desc: "Settle to USDC or fiat; webhooks + event logs for reporting.",
                href: "/dev/health",
              },
              {
                title: "Develop",
                desc: "Next API proxies + DB-backed stubs. Clone, seed, test.",
                href: "/dev/health",
              },
              {
                title: "Observe",
                desc: "Live status and receipts mapped to durable DB records.",
                href: "/dev/health",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition" />
                <h3 className="relative z-10 text-lg font-semibold text-neutral-900">
                  {f.title}
                </h3>
                <p className="relative z-10 mt-2 text-sm text-neutral-600">
                  {f.desc}
                </p>
                <Link
                  href={f.href}
                  className="relative z-10 mt-4 inline-flex text-sm font-medium text-emerald-700 hover:underline"
                >
                  Explore →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        <WhyUsdcStore />
        {/* Footer */}
        <footer className="border-t border-neutral-200">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-500 flex items-center justify-between">
            <span>USDC Store Sandbox</span>
            <span>
              Updated: {data?.ts ? new Date(data.ts).toLocaleTimeString() : "—"}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
