import express from "express";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getShopBySlug(req: Request, res: Response) {
	const { slug } = req.params;

	const shop = await prisma.shop.findUnique({
		where: { slug },
	});

	if (!shop) {
		return res.status(404).json({ error: "Shop not found" });
	}

	return res.json(shop);
}
