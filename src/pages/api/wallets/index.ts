// src/pages/api/wallets/index.ts
import { prisma } from "../../../server/prisma";
import { getSession } from "../../../lib/session";

export default async function handler(req: any, res: any) {
    try {
        const session = await getSession(req);
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method === "GET") {
            // Return user's viewports as “wallets” for backward-compat
            const viewports = await prisma.viewport.findMany({
                where: { ownerId: session.user.id },
                orderBy: { createdAt: "desc" },
            });

            // Map to legacy shape {id, name, balance}
            const wallets = viewports.map((v) => ({
                id: v.id,
                name: v.name,
                balance: v.balanceCached ?? 0,
            }));

            return res.status(200).json(wallets);
        }

        if (req.method === "POST") {
            const { name, balance } = req.body ?? {};
            if (!name) {
                return res.status(400).json({ error: "Missing name" });
            }

            const vp = await prisma.viewport.create({
                data: {
                    ownerId: session.user.id,
                    name,
                    type: "OWNER",
                    balanceCached: balance ?? 0,
                },
            });

            return res.status(201).json({
                id: vp.id,
                name: vp.name,
                balance: vp.balanceCached ?? 0,
            });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err: any) {
        console.error("API /wallets error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
