import express from "express";
import bodyParser from "body-parser";
import { mainDB } from "@prisma/dual-prisma"; // main Federated Value DB
import { randomUUID } from "crypto";
import { STUB_PORTS, STUB_MODE } from "../../config.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());

/**
 * Guardian Stub
 * --------------------------------------------
 * Stores recovery shares and guardian metadata
 * in the main Federated Value database.
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

app.post("/guardian/store-share", async (req, res) => {
  try {
    const { recoveryId, guardianId = "guardian-demo", shareData } = req.body;
    const id = randomUUID();
    await mainDB.recoveryShare.create({
      data: {
        id,
        recoveryId,
        guardianId,
        shareData,
        fingerprint: "fp_" + id,
        status: "stored",
      },
    });
    res.json({
      status: "stored",
      shareId: id,
      signedReceipt: "signed_" + id,
    });
  } catch (err: any) {
    console.error("Guardian store error", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/guardian/approve-recovery", async (req, res) => {
  const { recoveryId } = req.body;
  const share = "share_" + randomUUID();
  res.json({
    status: "approved",
    recoveryId,
    share,
    signature: "sig_" + share,
  });
});

export async function start() {
  const PORT = STUB_PORTS?.guardians || 4001;
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`✅ Guardian stub running on :${PORT}`);
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
