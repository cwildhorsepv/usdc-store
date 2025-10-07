// prisma.config.ts  –  Prisma 6+ seed runner

import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import { join } from "path";

// Explicitly load .env from project root
dotenv.config({ path: join(process.cwd(), ".env") });

export default defineConfig({
    schema: "./prisma/schema.prisma",
    db: { shadowDatabaseUrl: null },

    // ✅ Prisma 6 expects an actual function here, not a command string
    seed: {
        async run() {
            console.log("🌱  Running seed directly via tsx …");
            // Dynamically import and execute your seed script
            const { default: runSeed } = await import("./prisma/seed.ts");
            await runSeed();
        },
    },
});
