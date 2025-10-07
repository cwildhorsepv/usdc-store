// src/middleware/withViewportSession.ts
import { prisma } from "../server/prisma";

export async function withViewportSession(req, _res, next) {
    try {
        const auth0Sub = req.auth?.sub; // from Auth0 JWT middleware
        if (!auth0Sub) return next();

        let user = await prisma.user.findUnique({
            where: { auth0Id: auth0Sub },
        });

        if (!user) {
            // First login: create user + default viewport
            user = await prisma.user.create({
                data: {
                    auth0Id: auth0Sub,
                    email: req.auth?.email ?? null,
                    name: req.auth?.name ?? null,
                },
            });
        }

        // Find or create a default viewport
        let viewport = await prisma.viewport.findFirst({
            where: { ownerId: user.id, type: "OWNER" },
        });

        if (!viewport) {
            viewport = await prisma.viewport.create({
                data: {
                    ownerId: user.id,
                    name: `${user.name ?? "User"} Viewport`,
                    type: "OWNER",
                },
            });
        }

        req.session = { user, viewport };
        next();
    } catch (err) {
        console.error("withViewportSession error", err);
        next(err);
    }
}
