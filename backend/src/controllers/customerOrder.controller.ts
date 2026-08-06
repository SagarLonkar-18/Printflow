import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const createOrderSchema = z.object({
	originalName: z.string().min(1),
	copies: z.number().int().min(1).max(500),
	colorMode: z.enum(["BW", "COLOR"]),
});

export async function createOrder(req: Request, res: Response) {
	const { slug } = req.params as { slug: string };

	const parsed = createOrderSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: parsed.error.flatten().fieldErrors });
	}

	const shop = await prisma.shop.findUnique({ where: { slug } });
	if (!shop) {
		return res.status(404).json({ error: "Shop not found" });
	}

	const order = await prisma.order.create({
		data: {
			shopId: shop.id,
			originalName: parsed.data.originalName,
			copies: parsed.data.copies,
			colorMode: parsed.data.colorMode,
		},
	});

	return res.status(201).json(order);
}
