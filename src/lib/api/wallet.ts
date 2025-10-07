import { ViewportAPI } from "./viewport";
import { PledgeAPI } from "./pledges";
import { DelegationAPI } from "./delegations";

const USE_MOCK = true;

async function delay(ms = 300) {
    return new Promise((res) => setTimeout(res, ms));
}

export const WalletAPI = {
    async get(userId: string) {
        if (USE_MOCK) {
            await delay();
            const viewports = [await ViewportAPI.get("vp_demo")];
            const pledges = await PledgeAPI.list("vp_demo");
            const delegations = await DelegationAPI.list("vp_demo");

            const totalBalance = viewports
                .flatMap((v) => v.balances)
                .reduce((sum, b) => sum + b.amount, 0);

            return {
                id: "wallet_demo",
                ownerId: userId,
                viewports,
                pledges,
                delegations,
                totalBalance,
            };
        }

        const res = await fetch(`/api/wallets/${userId}`);
        return res.json();
    },
};
