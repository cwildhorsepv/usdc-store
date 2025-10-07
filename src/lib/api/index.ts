export * from "./wallet";
export * from "./viewport";
export * from "./pledges";
export * from "./delegations";

export const API = {
    Wallet: WalletAPI,
    Viewport: ViewportAPI,
    Pledge: PledgeAPI,
    Delegation: DelegationAPI,
};
