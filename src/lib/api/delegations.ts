const USE_MOCK = true;

const mockDelegations = [
    {
        id: "del_001",
        viewportId: "vp_demo",
        actorUserId: "usr_jane",
        enabled: true,
    },
    {
        id: "del_002",
        viewportId: "vp_demo",
        actorUserId: "usr_max",
        enabled: false,
    },
];

async function delay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
}

export const DelegationAPI = {
    async list(viewportId: string) {
        if (USE_MOCK) {
            await delay();
            return mockDelegations.filter((d) => d.viewportId === viewportId);
        }
        const res = await fetch(`/api/delegations?viewportId=${viewportId}`);
        return res.json();
    },

    async toggle(id: string, enabled: boolean) {
        if (USE_MOCK) {
            await delay();
            const idx = mockDelegations.findIndex((d) => d.id === id);
            if (idx !== -1) mockDelegations[idx].enabled = enabled;
            return mockDelegations[idx];
        }
        const res = await fetch(`/api/delegations/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled }),
        });
        return res.json();
    },
};
