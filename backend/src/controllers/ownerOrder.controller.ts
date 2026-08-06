import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listMyOrders(req: Request, res: Response) {
	const shopId = req.auth!.shopId;

	if (!shopId) {
		return res
			.status(403)
			.json({ error: "No shop associated with this account" });
	}

	const orders = await prisma.order.findMany({
		where: { shopId },
		orderBy: { createdAt: "desc" },
	});

	return res.json(orders);
}
