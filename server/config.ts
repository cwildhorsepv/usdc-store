export const STUB_PORTS = {
    secretStore: 4000,
    guardians: 4001,
    ach: 4002,
    evm: 4003,
    webhooks: 4004,
};

export const STUB_DB_PATH = "./prisma/dev.db"; // same Neon/SQLite dev DB
export const STUB_MODE = process.env.SERVICE_MODE || "stub"; // stub|live
export const IS_SANDBOX = process.env.SANDBOX_MODE === "true";
