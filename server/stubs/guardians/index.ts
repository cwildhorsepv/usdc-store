import express from "express";
import bodyParser from "body-parser";
import { mainDB } from "@prisma/dual-prisma"; // main Federated Value DB
import { randomUUID } from "crypto";

const app = express();
app.use(bodyParser.json());

/**
 * Guardian Stub
 * --------------------------------------------
 * Stores recovery shares and guardian metadata
 * in the main Federated Value database.
 */

app.post("/guardian/store-share", async (req, res) => {
    try {
        const {
            recoveryId,
            guardianId = "guardian-demo",
            shareData,
        } = req.body;
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

const PORT = process.env.GUARDIAN_PORT || 4001;
app.listen(PORT, () => console.log(`✅ Guardian stub running on :${PORT}`));
