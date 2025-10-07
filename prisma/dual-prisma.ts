import { PrismaClient } from "@prisma/client";

/**
 * Dual Prisma Client Setup (Prisma 6)
 * -----------------------------------
 * Supports both the main Neon DB and the Secret Store DB.
 * Uses global vars to prevent multiple client instances during hot reloads.
 */

declare global {
    // Prevent multiple instances in dev hot reload
    // (must be "var", not "let" or "const")
    var _mainDB: PrismaClient | undefined;
    var _secretDB: PrismaClient | undefined;
}

export const mainDB =
    global._mainDB ??
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ["warn", "error"],
    });

export const secretDB =
    global._secretDB ??
    new PrismaClient({
        datasourceUrl: process.env.SECRET_STORE_DATABASE_URL,
        log: ["warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    global._mainDB = mainDB;
    global._secretDB = secretDB;
}

// Graceful shutdown
process.once("SIGTERM", async () => {
    await mainDB.$disconnect();
    await secretDB.$disconnect();
});

process.once("beforeExit", async () => {
    await mainDB.$disconnect();
    await secretDB.$disconnect();
});

export default { mainDB, secretDB };
