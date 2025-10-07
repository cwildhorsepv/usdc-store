// src/pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/prisma";
import { createSession } from "../../../lib/session";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Missing code from Auth0" });
    }

    try {
        // ─── 1️⃣ Exchange Auth0 code for tokens ───────────────────────────────
        const tokenRes = await fetch(
            `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    code,
                    redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
                }),
            },
        );

        const tokens = await tokenRes.json();
        if (!tokens.id_token) {
            return res
                .status(400)
                .json({ error: "No id_token returned from Auth0" });
        }

        // ─── 2️⃣ Decode ID token to extract profile ───────────────────────────
        const base64Payload = tokens.id_token.split(".")[1];
        const decoded = JSON.parse(
            Buffer.from(base64Payload, "base64").toString(),
        );
        let { sub, email, name } = decoded;

        // Fallback: /userinfo endpoint if email missing
        if (!email) {
            const userInfo = await fetch(
                `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
                {
                    headers: { Authorization: `Bearer ${tokens.access_token}` },
                },
            ).then((r) => r.json());
            email = userInfo.email;
            name = userInfo.name;
            sub = userInfo.sub;
        }

        if (!email || !sub) {
            return res.status(400).json({ error: "Missing Auth0 user info" });
        }

        // ─── 3️⃣ Upsert user record in Neon ──────────────────────────────────
        //     (match by email; update auth0Id and timestamps)
        const now = new Date();
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                auth0Id: sub,
                name,
                updatedAt: now,
            },
            create: {
                auth0Id: sub,
                email,
                name,
                createdAt: now,
                updatedAt: now,
            },
        });

        // ─── 4️⃣ Create local session record & cookie ────────────────────────
        await createSession(user.id, tokens, res);

        // ─── 5️⃣ Redirect to profile page ────────────────────────────────────
        res.redirect("/profile");
    } catch (err) {
        console.error("❌ Auth0 callback error:", err);
        res.status(500).json({ error: "Auth callback failed" });
    }
}
