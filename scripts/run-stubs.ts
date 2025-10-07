import { spawn } from "child_process";
import { STUB_PORTS } from "../server/stubs/config.js";

const stubs = ["secret-store", "guardians"];
for (const s of stubs) {
    spawn("node", [`server/stubs/${s}/index.js`], {
        stdio: "inherit",
        env: process.env,
    });
}
