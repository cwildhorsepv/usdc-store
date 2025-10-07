"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_SANDBOX = exports.STUB_MODE = exports.STUB_DB_PATH = exports.STUB_PORTS = void 0;
exports.STUB_PORTS = {
    secretStore: 4000,
    guardians: 4001,
    ach: 4002,
    evm: 4003,
    webhooks: 4004,
};
exports.STUB_DB_PATH = "./prisma/dev.db"; // same Neon/SQLite dev DB
exports.STUB_MODE = process.env.SERVICE_MODE || "stub"; // stub|live
exports.IS_SANDBOX = process.env.SANDBOX_MODE === "true";
