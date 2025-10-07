// src/lib/composeViewportBalances.ts
import { prisma } from "../server/prisma";

export async function composeViewportBalances(viewportId: string) {
    // get all Feds tied to this viewport’s endpoints
    const endpointIds = (
        await prisma.endpointOnViewport.findMany({
            where: { viewportId },
            select: { endpointId: true },
        })
    ).map((e) => e.endpointId);

    if (endpointIds.length === 0) return [];

    const feds = await prisma.fed.findMany({
        where: { endpointId: { in: endpointIds } },
        include: { fedType: true },
    });

    // aggregate balances per FedType
    const balances: Record<string, number> = {};
    for (const f of feds) {
        const key = f.fedType.name;
        const amt = Number(f.amount);
        balances[key] = (balances[key] || 0) + amt;
    }

    return Object.entries(balances).map(([type, amount]) => ({
        type,
        amount,
    }));
}
