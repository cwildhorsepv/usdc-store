// src/pages/api/wallets/[id].ts
import { prisma } from "../../../server/prisma";
import { getSession } from "../../../lib/session";

export default async function handler(req: any, res: any) {
    try {
        const session = await getSession(req);
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id } = req.query;

        if (req.method === "GET") {
            const vp = await prisma.viewport.findUnique({
                where: { id: id as string },
            });
            if (!vp || vp.ownerId !== session.user.id) {
                return res.status(404).json({ error: "Wallet not found" });
            }
            return res.status(200).json({
                id: vp.id,
                name: vp.name,
                balance: vp.balanceCached ?? 0,
            });
        }

        if (req.method === "PUT") {
            const { name, balance } = req.body ?? {};
            const vp = await prisma.viewport.update({
                where: { id: id as string },
                data: {
                    ...(name ? { name } : {}),
                    ...(balance !== undefined
                        ? { balanceCached: balance }
                        : {}),
                },
            });
            return res.status(200).json({
                id: vp.id,
                name: vp.name,
                balance: vp.balanceCached ?? 0,
            });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err: any) {
        console.error("API /wallets/[id] error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
