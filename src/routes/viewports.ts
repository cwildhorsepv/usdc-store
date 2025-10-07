// src/routes/viewports.ts
import express from "express";
import { prisma } from "../server/prisma";
import { composeViewportBalances } from "../lib/composeViewportBalances";

const router = express.Router();

// GET /api/viewports/:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const balances = await composeViewportBalances(id);
    const delegates = await prisma.delegation.findMany({
        where: { viewportId: id },
    });
    res.json({ id, balances, delegates });
});

export default router;
