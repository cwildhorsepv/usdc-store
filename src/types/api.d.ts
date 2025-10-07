// src/types/api.d.ts
// Shared types for Wallet, Viewport, Fed balances, Pledges, and Delegations.

export interface FedBalance {
    type: string; // e.g. 'USD_FED', 'ETH_FED'
    amount: number;
}

export interface Delegation {
    id: string;
    viewportId: string;
    actorUserId: string;
    enabled: boolean;
}

export interface PledgeParty {
    role: "PLEDGOR" | "BENEFICIARY" | "GUARANTOR" | "FED_AGENT";
    user: string; // user ID reference
    obligation?: Record<string, any>;
    rights?: Record<string, any>;
}

export type PledgeStatus =
    | "PENDING"
    | "ACTIVE"
    | "RELEASED"
    | "DEFAULTED"
    | "DISPUTED";

export interface Pledge {
    id: string;
    viewportId: string;
    status: PledgeStatus;
    amount: number;
    type: string; // FedType name
    parties: PledgeParty[];
}

export interface Viewport {
    id: string;
    name: string;
    balances: FedBalance[];
    delegates: Delegation[];
}

export interface Wallet {
    id: string;
    ownerId: string;
    viewports: Viewport[];
    pledges: Pledge[];
    delegations: Delegation[];
    totalBalance: number;
}

export interface APIResponse<T> {
    ok?: boolean;
    error?: string;
    data?: T;
}

// ---- Type Guards ---- //

export function isFedBalance(obj: any): obj is FedBalance {
    return (
        obj && typeof obj.type === "string" && typeof obj.amount === "number"
    );
}

export function isDelegation(obj: any): obj is Delegation {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.viewportId === "string" &&
        typeof obj.actorUserId === "string" &&
        typeof obj.enabled === "boolean"
    );
}

export function isPledgeParty(obj: any): obj is PledgeParty {
    return obj && typeof obj.role === "string" && typeof obj.user === "string";
}

export function isPledge(obj: any): obj is Pledge {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.viewportId === "string" &&
        typeof obj.status === "string" &&
        typeof obj.amount === "number" &&
        typeof obj.type === "string" &&
        Array.isArray(obj.parties) &&
        obj.parties.every(isPledgeParty)
    );
}

export function isViewport(obj: any): obj is Viewport {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        Array.isArray(obj.balances) &&
        obj.balances.every(isFedBalance)
    );
}

export function isWallet(obj: any): obj is Wallet {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.ownerId === "string" &&
        Array.isArray(obj.viewports) &&
        obj.viewports.every(isViewport)
    );
}
