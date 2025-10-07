import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/prisma";
import { getSession } from "../../../lib/session"; // 👈 your local session helper

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const session = await getSession(req, res);
        if (!session?.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // pull user’s active viewports (wallets)
        const viewports = await prisma.viewport.findMany({
            where: { ownerId: session.user.id },
            include: {
                endpoints: {
                    include: { endpoint: true },
                },
                delegations: true,
                pledgeParties: true,
            },
        });

        res.status(200).json({ userId: session.user.id, viewports });
    } catch (err) {
        console.error("Error in /api/wallet/overview:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
