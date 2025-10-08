// scripts/sandbox-start.ts
import { spawn, execSync } from "node:child_process";
import net from "node:net";

// IMPORTANT: use the same config the stubs use
// adjust the relative path if your script lives elsewhere
import { STUB_PORTS } from "../server/config.js";

// coerce/guard numeric ports in case config/env are strings
const num = (v: any, fallback: number) => {
  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isFinite(n) ? n : fallback;
};

const PORTS = [
  { name: "secret-store", port: num(STUB_PORTS?.secretStore, 4000) },
  { name: "guardians", port: num(STUB_PORTS?.guardians, 4001) },
  { name: "ach", port: num(STUB_PORTS?.ach, 4002) },
  { name: "evm", port: num(STUB_PORTS?.evm, 4003) },
  { name: "webhooks", port: num(STUB_PORTS?.webhooks, 4004) },
];

const services: [string, string][] = [
  ["server/stubs/secret-store/index.ts", "Secret Store"],
  ["server/stubs/guardians/index.ts", "Guardians"],
  ["server/stubs/ach/index.ts", "ACH"],
  ["server/stubs/evm/index.ts", "EVM"],
  ["server/stubs/webhooks/index.ts", "Webhooks"],
];

const env = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} -r tsconfig-paths/register`,
};

function isOpen(port: number, host = "127.0.0.1") {
  return new Promise<boolean>((resolve) => {
    const s = new net.Socket();
    s.setTimeout(500);
    s.once("connect", () => {
      s.destroy();
      resolve(true);
    });
    s.once("timeout", () => {
      s.destroy();
      resolve(false);
    });
    s.once("error", () => resolve(false));
    s.connect(port, host);
  });
}

async function preflight() {
  for (const { name, port } of PORTS) {
    // eslint-disable-next-line no-await-in-loop
    const open = await isOpen(port);
    if (open) {
      if (process.env.SANDBOX_FORCE === "1") {
        try {
          // *nix reclaim; noop on platforms without lsof
          execSync(`kill -9 $(lsof -t -i:${port})`, { stdio: "ignore" });
          console.log(`🔧 Reclaimed port ${port} (${name})`);
        } catch {}
      } else {
        console.error(
          `❌ Port ${port} (${name}) is busy. Set SANDBOX_FORCE=1 to reclaim.`,
        );
        process.exit(1);
      }
    }
  }
}

async function main() {
  await preflight();

  const children: ReturnType<typeof spawn>[] = [];
  for (const [path, label] of services) {
    console.log(`🚀 Launching ${label} (${path})`);

    const args = [
      "tsx",
      ...(process.env.SANDBOX_WATCH === "1" ? ["--watch"] : []),
      path,
    ];
    const proc = spawn("npx", args, { stdio: "inherit" });

    children.push(proc);
    proc.on("exit", (code) =>
      console.log(`⚠️  ${label} exited with code ${code}`),
    );
  }

  // keep parent alive + graceful shutdown
  process.stdin.resume();
  const clean = () => {
    console.log("\n🛑 Shutting down sandbox...");
    for (const c of children) c.kill("SIGINT");
    process.exit(0);
  };
  process.on("SIGINT", clean);
  process.on("SIGTERM", clean);
}

main().catch((e) => {
  console.error("sandbox-start failed:", e);
  process.exit(1);
});
