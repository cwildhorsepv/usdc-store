// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Federated Wallet POC with processor delegation...");

    //
    // ─── FED TYPES ───────────────────────────────────────────────────────────────
    //
    const [usdcType, fiatType, loyaltyType, couponType] = await Promise.all([
        prisma.fedType.upsert({
            where: { name: "USDC" },
            update: {},
            create: { name: "USDC", endpointType: "CUSTOM", scale: 6 },
        }),
        prisma.fedType.upsert({
            where: { name: "FIAT" },
            update: {},
            create: { name: "FIAT", endpointType: "BANK", scale: 2 },
        }),
        prisma.fedType.upsert({
            where: { name: "LOYALTY" },
            update: {},
            create: { name: "LOYALTY", endpointType: "CUSTOM", scale: 0 },
        }),
        prisma.fedType.upsert({
            where: { name: "COUPON" },
            update: {},
            create: { name: "COUPON", endpointType: "CUSTOM", scale: 2 },
        }),
    ]);

    //
    // ─── USERS ──────────────────────────────────────────────────────────────────
    //
    const [john, storeService, processor, coreSettlement] = await Promise.all([
        prisma.user.upsert({
            where: { email: "john@demo.io" },
            update: { name: "John Customer" },
            create: {
                auth0Id: "auth0|john-demo",
                email: "john@demo.io",
                name: "John Customer",
            },
        }),
        prisma.user.upsert({
            where: { auth0Id: "service|usdc-store" },
            update: { name: "USDC Store Service" },
            create: {
                auth0Id: "service|usdc-store",
                email: "svc@usdc.store",
                name: "USDC Store Service",
            },
        }),
        prisma.user.upsert({
            where: { auth0Id: "merchant|gummy-processor" },
            update: { name: "Gummy Processor" },
            create: {
                auth0Id: "merchant|gummy-processor",
                email: "ops@gummystore.io",
                name: "Gummy Processor",
            },
        }),
        prisma.user.upsert({
            where: { auth0Id: "service|core-settlement" },
            update: { name: "Core Settlement Node" },
            create: {
                auth0Id: "service|core-settlement",
                email: "settlement@defipay.io",
                name: "Core Settlement Node",
            },
        }),
    ]);

    //
    // ─── VIEWPORTS ──────────────────────────────────────────────────────────────
    //
    const [johnUsdc, processorUsdc, coreUsdc] = await Promise.all([
        prisma.viewport.upsert({
            where: { id: `${john.id}-usdc` },
            update: {},
            create: {
                id: `${john.id}-usdc`,
                ownerId: john.id,
                name: "John USDC Wallet",
                type: "OWNER",
                policyJson: { delegated: true },
            },
        }),
        prisma.viewport.upsert({
            where: { id: `${processor.id}-usdc` },
            update: {},
            create: {
                id: `${processor.id}-usdc`,
                ownerId: processor.id,
                name: "Processor Wallet",
                type: "PROCESSOR",
                policyJson: { settlementMode: "ACH" },
            },
        }),
        prisma.viewport.upsert({
            where: { id: `${coreSettlement.id}-usdc` },
            update: {},
            create: {
                id: `${coreSettlement.id}-usdc`,
                ownerId: coreSettlement.id,
                name: "Core Settlement Wallet",
                type: "SETTLEMENT",
            },
        }),
    ]);

    //
    // ─── DELEGATIONS ────────────────────────────────────────────────────────────
    //
    await prisma.delegation.upsert({
        where: { id: `${johnUsdc.id}-delegate-store` },
        update: {},
        create: {
            id: `${johnUsdc.id}-delegate-store`,
            viewportId: johnUsdc.id,
            actorUserId: storeService.id,
            enabled: true,
        },
    });

    await prisma.delegation.upsert({
        where: { id: `${processorUsdc.id}-delegate-core` },
        update: {},
        create: {
            id: `${processorUsdc.id}-delegate-core`,
            viewportId: processorUsdc.id,
            actorUserId: coreSettlement.id,
            enabled: true,
        },
    });
    // ─── ENDPOINTS ───────────────────────────────────────────────────────────────
    const [johnEndpoint, processorEndpoint, coreEndpoint] = await Promise.all([
        prisma.endpoint.create({
            data: {
                name: "John USDC Endpoint",
                type: "ETH",
                config: { network: "mocknet" },
            },
        }),
        prisma.endpoint.create({
            data: {
                name: "Processor USDC Endpoint",
                type: "CUSTOM",
                config: { notes: "Simulated processor wallet" },
            },
        }),
        prisma.endpoint.create({
            data: {
                name: "Core Settlement Endpoint",
                type: "CUSTOM",
                config: { notes: "Simulated settlement wallet" },
            },
        }),
    ]);

    //
    // ─── INITIAL FED BALANCES ───────────────────────────────────────────────────
    await prisma.fed.createMany({
        data: [
            {
                id: `${processorUsdc.id}-seed-fed`,
                endpointId: processorEndpoint.id,
                fedTypeId: usdcType.id,
                amount: 500.0,
                metadata: { note: "Initial processor liquidity" },
            },
            {
                id: `${johnUsdc.id}-seed-fed`,
                endpointId: johnEndpoint.id,
                fedTypeId: usdcType.id,
                amount: 0.0,
                metadata: { note: "Customer wallet" },
            },
            {
                id: `${coreUsdc.id}-seed-fed`,
                endpointId: coreEndpoint.id,
                fedTypeId: usdcType.id,
                amount: 0.0,
                metadata: { note: "Settlement wallet" },
            },
        ],
    });

    console.log("✅  Seed complete!");
}

main()
    .catch((err) => {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
