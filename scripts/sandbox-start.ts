/**
 * Sandbox Orchestrator
 * --------------------------------------------
 * Starts all stub services in parallel (Secret Store, Guardians, ACH, EVM, Webhooks)
 * with live logging and graceful shutdown.
 */

import { spawn } from "child_process";
import path from "path";

const stubs = [
    { name: "secret-store", script: "server/stubs/secret-store/index.ts" },
    { name: "guardians", script: "server/stubs/guardians/index.ts" },
    { name: "ach", script: "server/stubs/ach/index.ts" },
    { name: "evm", script: "server/stubs/evm/index.ts" },
    { name: "webhooks", script: "server/stubs/webhooks/index.ts" },
];

const tsxBin = path.resolve("node_modules/.bin/tsx");
const children: any[] = [];

function startStub({ name, script }: { name: string; script: string }) {
    const proc = spawn(tsxBin, [script], {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, SANDBOX_MODE: "true" },
    });

    proc.stdout.on("data", (data) =>
        console.log(`\x1b[36m[${name}]\x1b[0m ${data.toString().trim()}`),
    );
    proc.stderr.on("data", (data) =>
        console.error(
            `\x1b[31m[${name} error]\x1b[0m ${data.toString().trim()}`,
        ),
    );

    children.push(proc);
}

for (const stub of stubs) startStub(stub);

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down sandbox...");
    for (const c of children) c.kill("SIGTERM");
    process.exit(0);
});
