import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/session";
import { prisma } from "../../../server/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") return res.status(405).end();

    const session = await getSession(req, res);
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { wallets: true },
        });

        if (!user || !user.wallets.length) {
            return res.status(404).json({ error: "No wallet found for user" });
        }

        const wallet = user.wallets[0]; // For now, pick first wallet
        const { domain = "blockchain", encryptedBlob } = req.body;

        // 1️⃣ store encrypted secret
        const secretResp = await fetch("http://localhost:4000/secret/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                walletId: wallet.id,
                domain,
                encryptedBlob,
            }),
        });

        const secretData = await secretResp.json();
        if (!secretResp.ok)
            throw new Error(secretData.error || "Secret store error");

        // 2️⃣ ask Guardian service for approval
        const guardianResp = await fetch(
            "http://localhost:4001/guardian/approve-recovery",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletId: wallet.id,
                    recoveryId: secretData.id,
                    status: "requested",
                }),
            },
        );

        const guardianData = await guardianResp.json();
        if (!guardianResp.ok)
            throw new Error(guardianData.error || "Guardian error");

        // 3️⃣ audit log in main DB
        await prisma.tokenAudit.create({
            data: {
                recoveryId: secretData.id,
                userId: user.id,
                event: "recovery_requested",
                payload: { guardianStatus: guardianData.status },
            },
        });

        res.status(200).json({
            recoveryId: secretData.id,
            guardianStatus: guardianData.status || "approved",
        });
    } catch (err: any) {
        console.error("Recovery error:", err);
        res.status(500).json({ error: err.message });
    }
}
