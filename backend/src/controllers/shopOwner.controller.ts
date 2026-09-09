import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const updatePricingSchema = z.object({
	bwSinglePrice: z.number().positive(),
	bwDoublePrice: z.number().positive(),
	colorSinglePrice: z.number().positive(),
	colorDoublePrice: z.number().positive(),
});

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

export async function updateShopPricing(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res.status(403).json({ error: "No shop associated with this account" });
	}

	const parsed = updatePricingSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
	}

	const shop = await prisma.shop.update({
		where: { id: shopId },
		data: parsed.data,
	});

	return res.json(shop);
}