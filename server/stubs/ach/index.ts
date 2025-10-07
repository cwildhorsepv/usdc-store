import express from "express";
import bodyParser from "body-parser";
import { STUB_PORTS } from "../../config.js";

const app = express();
app.use(bodyParser.json());

/**
 * ACH Stub
 * --------------------------------------------
 * Simulates fiat ACH transactions for payouts/settlements.
 * No real banking involved — just logs and mock responses.
 */

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

const PORT = STUB_PORTS.ach || 4002;
app.listen(PORT, () => console.log(`🏦 ACH stub running on :${PORT}`));
