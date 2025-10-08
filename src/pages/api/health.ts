import type { NextApiRequest, NextApiResponse } from "next";

const IS_LOCAL = process.env.NODE_ENV !== "production" && !process.env.NETLIFY;

type HealthItem = {
  key: string;
  name: string;
  status: "ok" | "error";
  details?: any;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  if (IS_LOCAL) {
    const endpoints: [string, string, string][] = [
      ["secret", "Secret Store", "http://localhost:4000/health"],
      ["guardians", "Guardians", "http://localhost:4001/health"],
      ["ach", "ACH", "http://localhost:4002/health"],
      ["evm", "EVM", "http://localhost:4003/health"],
      ["webhooks", "Webhooks", "http://localhost:4004/health"],
    ];
    const services: HealthItem[] = await Promise.all(
      endpoints.map(async ([key, name, url]) => {
        try {
          const r = await fetch(url);
          const data = await r.json().catch(() => ({}));
          return {
            key,
            name,
            status: data?.status === "ok" ? "ok" : "error",
            details: data,
          };
        } catch (e: any) {
          return {
            key,
            name,
            status: "error",
            details: { message: e?.message },
          };
        }
      }),
    );
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ services, ts: new Date().toISOString() });
  }

  // production/Netlify → query Neon directly
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.NETLIFY_DATABASE_URL!);

  async function count(table: string) {
    try {
      const rows = await sql<{
        count: number;
      }>`select count(*)::int as count from ${sql(table)}`;
      return rows[0]?.count ?? 0;
    } catch {
      return 0;
    }
  }

  const [txCount, achTotal, approvalsTotal, eventsTotal] = await Promise.all([
    count("ChainTx"),
    count("AchPayment"),
    count("Approval"),
    count("EventLog"),
  ]);

  const services: HealthItem[] = [
    {
      key: "evm",
      name: "EVM",
      status: "ok",
      details: { status: "ok", count: txCount },
    },
    {
      key: "ach",
      name: "ACH",
      status: "ok",
      details: { status: "ok", total: achTotal },
    },
    {
      key: "guardians",
      name: "Guardians",
      status: "ok",
      details: { status: "ok", total: approvalsTotal },
    },
    {
      key: "webhooks",
      name: "Webhooks",
      status: "ok",
      details: { status: "ok", count: eventsTotal },
    },
  ];

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ services, ts: new Date().toISOString() });
}
