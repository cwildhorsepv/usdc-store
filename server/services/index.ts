import { IS_SANDBOX, STUB_MODE } from "../config";

const load = (stubPath: string, livePath: string) =>
    IS_SANDBOX || STUB_MODE === "stub" ? require(stubPath) : require(livePath);

// ---- Exports ---- //
export const secretStore = load(
    "../stubs/secret-store",
    "../live/secret-store",
);
export const guardians = load("../stubs/guardians", "../live/guardians");
export const ach = load("../stubs/ach", "../live/ach");
export const evm = load("../stubs/evm", "../live/evm");
export const webhooks = load("../stubs/webhooks", "../live/webhooks");
