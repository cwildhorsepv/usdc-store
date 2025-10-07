import express from "express";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import { secretDB } from "../../../prisma/dual-prisma.js";
import { STUB_PORTS, STUB_MODE } from "../../config.js";

/**
 * Secret Store Stub
 * --------------------------------------------
 * Provides stubbed endpoints for secret blob
 * storage, retrieval, and signing.
 * Uses Prisma's Secret Store DB for persistence.
 */

export async function createApp() {
    const app = express();
    app.use(bodyParser.json());

    // Health check
    app.get("/health", async (_, res) => {
        const count = await secretDB.secret.count().catch(() => 0);
        res.json({ status: "ok", mode: STUB_MODE, count });
    });

    // Store encrypted blob
    app.post("/secret/store", async (req, res) => {
        try {
            const { walletId, domain = "blockchain", encryptedBlob } = req.body;
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

    // Simulate unwrap operation
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
    const PORT = STUB_PORTS.secretStore || 4000;

    app.listen(PORT, () => {
        console.log(`✅ Secret Store stub running on port ${PORT}`);
    });
}

// Auto-start if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    start();
}
