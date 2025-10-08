import express from "express";
import bodyParser from "body-parser";
import { STUB_PORTS } from "../../config.js";
import { randomUUID } from "crypto";
import axios from "axios";
import { PrismaClient } from "@prisma/client"; // at top if not present
const prisma = new PrismaClient(); // near your other top-level inits

const app = express();
app.use(bodyParser.json());

app.get("/health", async (_req, res) => {
  const count = await prisma.chainTx.count().catch(() => 0);
  res.json({ status: "ok", service: "evm", count });
});
/**
 * EVM Stub
 * --------------------------------------------
 * Simulates basic blockchain operations for USDC transfers and confirmations.
 */

interface TxRecord {
  txHash: string;
  from: string;
  to: string;
  amountUSDC: number;
  confirmed: boolean;
}

const transactions: Record<string, TxRecord> = {};

app.post("/evm/transfer", (req, res) => {
  const { from, to, amountUSDC } = req.body;
  const txHash = "0x" + randomUUID().replace(/-/g, "").slice(0, 64);

  transactions[txHash] = { txHash, from, to, amountUSDC, confirmed: false };

  console.log(
    `🔗 EVM transfer: ${amountUSDC} USDC from ${from} → ${to} [${txHash}]`,
  );

  res.json({
    status: "submitted",
    chain: "stubnet",
    txHash,
    confirmations: 0,
    submittedAt: new Date().toISOString(),
  });
});

app.post("/evm/balance", (req, res) => {
  const { address } = req.body;
  const balance = (Math.random() * 1000).toFixed(2);
  res.json({ address, balanceUSDC: balance });
});

/**
 * /evm/confirm
 * Simulates a blockchain webhook notifying confirmation.
 * Optionally relays to a local webhook listener (e.g. /webhook/defipay/confirmations)
 */
app.post("/evm/confirm", async (req, res) => {
  const { txHash, relay } = req.body;

  const tx = transactions[txHash];
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  tx.confirmed = true;

  console.log(`✅ EVM confirmation received for tx ${txHash}`);

  const payload = {
    event: "PaymentConfirmed",
    txHash,
    chain: "stubnet",
    confirmedAt: new Date().toISOString(),
    amountUSDC: tx.amountUSDC,
  };

  // Optional webhook relay (to Webhooks or DeFiPay stub)
  if (relay) {
    try {
      await axios.post(relay, payload, { timeout: 3000 });
      console.log(`📡 Relayed confirmation to ${relay}`);
    } catch (err: any) {
      console.error(`⚠️ Relay failed to ${relay}:`, err.message);
    }
  }

  res.json({ ok: true, txHash, relayed: !!relay });
});

export async function start() {
  const PORT = STUB_PORTS?.evm || 4003;
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`🔗 EVM stub running on :${PORT}`);
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
