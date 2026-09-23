import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import { getDateRangeBounds } from "../lib/dateRanges.js";

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

export async function getMyAnalytics(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res.status(403).json({ error: "No shop associated with this account" });
	}

	const range = (req.query.range as string) || "today";
	const bounds = getDateRangeBounds(range);

	const files = await prisma.orderFile.findMany({
		where: {
			order: {
				shopId,
				...(bounds ? { createdAt: { gte: bounds.start, lt: bounds.end } } : {}),
			},
		},
		select: {
			price: true,
			colorMode: true,
			doubleSided: true,
			pageCount: true,
			copies: true,
		},
	});

	const totalRevenue = files.reduce((sum, f) => sum + f.price, 0);
	const totalFiles = files.length;
	const totalSheets = files.reduce(
		(sum, f) => sum + (f.doubleSided ? Math.ceil(f.pageCount / 2) : f.pageCount) * f.copies,
		0,
	);

	const bwCount = files.filter((f) => f.colorMode === "BW").length;
	const colorCount = files.filter((f) => f.colorMode === "COLOR").length;
	const singleSidedCount = files.filter((f) => !f.doubleSided).length;
	const doubleSidedCount = files.filter((f) => f.doubleSided).length;

	return res.json({
		totalRevenue,
		totalFiles,
		totalSheets,
		bwCount,
		colorCount,
		singleSidedCount,
		doubleSidedCount,
	});
}