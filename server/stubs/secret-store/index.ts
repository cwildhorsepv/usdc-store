import express from "express";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import { PrismaClient } from "../../../generated/secretstore";
import { STUB_MODE, STUB_PORTS } from "../../config.js"; // adjust if your config lives elsewhere

const secretDB = new PrismaClient();

/**
 * Minimal persistent Secret Store stub.
 * - Persists encrypted blobs via Prisma
 * - Provides health, unwrap, and sign simulation
 */
export async function createApp() {
  const app = express();
  app.use(bodyParser.json());

  // Health check – real count from DB
  app.get("/health", async (_, res) => {
    try {
      const count = await secretDB.secret.count();
      res.json({ status: "ok", mode: STUB_MODE, count });
    } catch (err: any) {
      console.error("❌ Secret Store health error", err);
      res.json({
        status: "error",
        mode: STUB_MODE,
        count: 0,
        message: err.message,
      });
    }
  });

  // Store encrypted blob (delegated secret)
  app.post("/secret/store", async (req, res) => {
    try {
      const { walletId, domain = "blockchain", encryptedBlob } = req.body;
      if (!walletId || !encryptedBlob) {
        return res
          .status(400)
          .json({ error: "walletId and encryptedBlob are required" });
      }

      const id = randomUUID();
      const record = await secretDB.secret.create({
        data: { id, walletId, domain, encryptedBlob },
      });

      res.json({ id: record.id, status: "stored" });
    } catch (err: any) {
      console.error("❌ Secret Store error", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Simulate unwrap operation (for developer sandbox)
  app.post("/secret/unwrap", async (req, res) => {
    const { id } = req.body;
    const wrappedKey = `wrapped_${id}_${Date.now()}`;
    res.json({ status: "ok", wrappedKey });
  });

  // Simulate transaction signing
  app.post("/secret/sign", async (req, res) => {
    const { payload } = req.body;
    const txHash = "demo_tx_" + Math.random().toString(36).substring(2, 10);
    res.json({
      status: "signed",
      txHash,
      signature: `sig_${txHash}`,
      payload,
    });
  });

  return app;
}

export async function start() {
  const app = await createApp();
  const PORT = STUB_PORTS?.secretStore || 4000;
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`✅ Secret Store stub running on port ${PORT}`);
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
