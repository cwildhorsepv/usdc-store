import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/prisma";
import { getSession } from "../../../lib/session";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const session = await getSession(req, res);
        if (!session?.user)
            return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.query;
        if (!id || typeof id !== "string")
            return res.status(400).json({ error: "Missing wallet id" });

        const wallet = await prisma.viewport.findUnique({
            where: { id },
            include: {
                endpoints: { include: { endpoint: true } },
                delegations: true,
                pledgeParties: true,
            },
        });

        if (!wallet || wallet.ownerId !== session.user.id)
            return res.status(404).json({ error: "Wallet not found" });

        res.status(200).json(wallet);
    } catch (err) {
        console.error("Error in /api/wallet/[id]:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
