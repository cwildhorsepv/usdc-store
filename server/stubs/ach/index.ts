import express from "express";
import bodyParser from "body-parser";
import { STUB_PORTS } from "../../config.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());

/**
 * ACH Stub
 * --------------------------------------------
 * Simulates fiat ACH transactions for payouts/settlements.
 * No real banking involved — just logs and mock responses.
 */

app.get("/health", async (_req, res) => {
  try {
    const [pending, approved, denied] = await Promise.all([
      prisma.approval.count({ where: { status: "PENDING" } }),
      prisma.approval.count({ where: { status: "APPROVED" } }),
      prisma.approval.count({ where: { status: "DENIED" } }),
    ]);
    res.json({
      status: "ok",
      service: "guardians",
      pending,
      approved,
      denied,
      total: pending + approved + denied,
    });
  } catch (e: any) {
    res.json({ status: "error", service: "guardians", message: e.message });
  }
});

app.post("/ach/initiate", (req, res) => {
  const { accountNumber, amountUSD, reference } = req.body;
  console.log(
    `🏦 ACH initiated: $${amountUSD} → ${accountNumber} [${reference}]`,
  );
  res.json({
    status: "initiated",
    achRef: "ach_" + Math.random().toString(36).substring(2, 10),
    timestamp: new Date().toISOString(),
  });
});

app.post("/ach/settle", (req, res) => {
  const { achRef } = req.body;
  console.log(`✅ ACH settlement completed for ${achRef}`);
  res.json({ status: "settled", settledAt: new Date().toISOString() });
});

export async function start() {
  const PORT = STUB_PORTS?.ach || 4002;
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`🏦 ACH stub running on :${PORT}`);
      resolve();
    });
  });
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const maybe = start();
    process.stdin.resume(); // keep alive
    if (maybe && typeof (maybe as any).catch === "function") {
      (maybe as Promise<void>).catch((err) => {
        console.error("startup error:", err);
        process.exit(1);
      });
    }
  } catch (err) {
    console.error("startup error:", err);
    process.exit(1);
  }
}
