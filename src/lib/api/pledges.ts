const USE_MOCK = true;

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

async function delay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
}

export const PledgeAPI = {
    async list(viewportId: string) {
        if (USE_MOCK) {
            await delay();
            return mockPledges.filter((p) => p.viewportId === viewportId);
        }
        const res = await fetch(`/api/pledges?viewportId=${viewportId}`);
        return res.json();
    },

    async create(data: any) {
        if (USE_MOCK) {
            await delay();
            const newPledge = {
                id: `plg_${Math.random().toString(36).slice(2, 8)}`,
                status: "PENDING",
                ...data,
            };
            mockPledges.push(newPledge);
            return newPledge;
        }
        const res = await fetch(`/api/pledges`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};
