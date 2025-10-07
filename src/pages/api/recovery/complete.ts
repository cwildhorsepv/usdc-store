// pages/api/recovery/complete.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@lib/session.js"; // ensure runtime path matches
import { prisma } from "@server/prisma.js"; // ensure runtime path matches

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const session = await getSession(req);
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { recoveryId } = req.body;
        if (!recoveryId)
            return res.status(400).json({ error: "missing recoveryId" });

        // 1) Ask guardian(s) to approve (stub)
        const guardianResp = await fetch(
            "http://localhost:4001/guardian/approve-recovery",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recoveryId }),
            },
        );
        const guardianData = await guardianResp.json();
        if (!guardianResp.ok)
            throw new Error(guardianData.error || "Guardian approval failed");

        // 2) Optionally store the returned share in main DB (simulate)
        try {
            await prisma.recoveryShare.create({
                data: {
                    id: guardianData.share
                        ? `share_${Date.now()}`
                        : `share_stub_${Date.now()}`,
                    recoveryId,
                    guardianId: guardianData.guardianId ?? "guardian_demo_001",
                    kind: "guardian",
                    shareData: guardianData.share ?? "stub_share_data",
                    fingerprint: guardianData.signature ?? `sig_${Date.now()}`,
                    status: "approved",
                },
            });
        } catch (e) {
            // non-fatal for the POC, but log
            console.warn(
                "Could not write recoveryShare (POC):",
                (e as Error).message,
            );
        }

        // 3) Ask Secret Store to unwrap / restore the secret (stub)
        const unwrapResp = await fetch("http://localhost:4000/secret/unwrap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: recoveryId }),
        });
        const unwrapData = await unwrapResp.json();
        if (!unwrapResp.ok)
            throw new Error(unwrapData.error || "Secret unwrap failed");

        // 4) Audit the completion in main DB
        await prisma.tokenAudit.create({
            data: {
                id: `audit_${Date.now()}`,
                recoveryId,
                userId: session.user.id || null,
                event: "recovery_completed",
                payload: { guardian: guardianData, unwrap: unwrapData },
            },
        });

        // 5) Return the restored (wrapped) key to caller
        return res.status(200).json({
            recoveryId,
            guardianStatus: guardianData.status ?? "approved",
            restored:
                unwrapData.wrappedKey ??
                unwrapData.wrapped ??
                unwrapData.result ??
                "wrapped_key_stub",
        });
    } catch (err: any) {
        console.error("Recovery complete error:", err);
        return res.status(500).json({ error: err.message || String(err) });
    }
}
