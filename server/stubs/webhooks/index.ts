import express from "express";
import bodyParser from "body-parser";
import { STUB_PORTS, STUB_MODE } from "../../config.js";
import { mainDB } from "@prisma/dual-prisma.js";

const app = express();
app.use(bodyParser.json());

/**
 * Webhook Receiver Stub
 * --------------------------------------------
 * Accepts POST payloads from DeFiPay, merchant, or analytics integrations.
 * Stores them for inspection if SANDBOX_MODE=true.
 */

app.get("/health", (_, res) => {
  res.json({ status: "ok", mode: STUB_MODE });
});

app.post("/webhook/:source", async (req, res) => {
  const { source } = req.params;
  const event = req.body;

  try {
    const eventName = event.type || event.event || "unknown";
    console.log(`📩 Webhook [${source}] event: ${eventName}`);

    if (process.env.SANDBOX_MODE === "true") {
      // optional: persist event for debugging
      await mainDB.webhookEvent.create({
        data: {
          source,
          payload: event,
        },
      });
    }

    res.status(202).json({ ok: true });
  } catch (err: any) {
    console.error("Webhook stub error:", err);
    res.status(500).json({ error: err.message });
  }
});

export async function start() {
  const PORT = STUB_PORTS?.webhooks || 4004;
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`🧩 Webhook stub running on :${PORT}`);
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
