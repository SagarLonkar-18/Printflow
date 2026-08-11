import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getMyShop(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res.status(403).json({ error: "No shop associated with this account" });
	}

	const shop = await prisma.shop.findUnique({ where: { id: shopId } });
	if (!shop) {
		return res.status(404).json({ error: "Shop not found" });
	}

	return res.json(shop);
}