// src/lib/api.ts

const USE_MOCK = true;

// --- mock viewport & sub-data --- //
const mockViewport = {
    id: "vp_demo",
    name: "Demo Viewport",
    balances: [
        { type: "ETH_FED", amount: 0.42 },
        { type: "USD_FED", amount: 120.5 },
        { type: "MILES_FED", amount: 3500 },
    ],
    delegates: [
        { id: "del_001", actorUserId: "usr_jane", enabled: true },
        { id: "del_002", actorUserId: "usr_max", enabled: false },
    ],
};

const mockPledges = [
    {
        id: "plg_001",
        viewportId: "vp_demo",
        status: "ACTIVE",
        amount: 100,
        type: "USD_FED",
        parties: [
            { role: "PLEDGOR", user: "usr_carlos" },
            { role: "BENEFICIARY", user: "usr_demo" },
        ],
    },
];

// --- helper for async delay --- //
async function delay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
}

// --- API namespaces --- //
export const ViewportAPI = {
    async get(id: string) {
        if (USE_MOCK) {
            await delay();
            return mockViewport;
        }
        const res = await fetch(`/api/viewports/${id}`);
        return await res.json();
    },
};

export const PledgeAPI = {
    async list(viewportId: string) {
        if (USE_MOCK) {
            await delay();
            return mockPledges.filter((p) => p.viewportId === viewportId);
        }
        const res = await fetch(`/api/pledges?viewportId=${viewportId}`);
        return await res.json();
    },
};

// --- the composition layer --- //
export const WalletAPI = {
    async get(userId: string) {
        if (USE_MOCK) {
            await delay();
            // simulate wallet composed of multiple viewports
            const viewports = [await ViewportAPI.get("vp_demo")];
            const pledges = await PledgeAPI.list("vp_demo");

            const totalBalance = viewports
                .flatMap((v) => v.balances)
                .reduce((sum, b) => sum + b.amount, 0);

            return {
                id: "wallet_demo",
                ownerId: userId,
                viewports,
                pledges,
                totalBalance,
            };
        }

        // live mode
        const res = await fetch(`/api/wallets/${userId}`);
        return await res.json();
    },
};

// unified export
export const API = {
    Wallet: WalletAPI,
    Viewport: ViewportAPI,
    Pledge: PledgeAPI,
};
