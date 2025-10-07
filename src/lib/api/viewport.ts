const USE_MOCK = true;

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

async function delay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
}

export const ViewportAPI = {
    async get(id: string) {
        if (USE_MOCK) {
            await delay();
            return mockViewport;
        }
        const res = await fetch(`/api/viewports/${id}`);
        return res.json();
    },

    async list() {
        if (USE_MOCK) {
            await delay();
            return [mockViewport];
        }
        const res = await fetch(`/api/viewports`);
        return res.json();
    },
};
