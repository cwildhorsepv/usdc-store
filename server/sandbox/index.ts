process.env.SANDBOX_MODE = "true";
import next from "next";
import { createServer } from "http";

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => handle(req, res)).listen(3000, () => {
        console.log("🧪 Sandbox server running at http://localhost:3000");
    });
});
ß;
