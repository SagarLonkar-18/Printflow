import { scopedOrders } from "../lib/scopedOrders.js";
import type { Request, Response } from "express";
import { z } from "zod";

const updateStatusSchema = z.object({
	status: z.enum(["PRINTING", "COMPLETED"]),
});

export async function listMyOrders(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res
			.status(403)
			.json({ error: "No shop associated with this account" });
	}

	const orders = await scopedOrders(shopId).findMany();
	return res.json(orders);
}

export async function getMyOrder(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res
			.status(403)
			.json({ error: "No shop associated with this account" });
	}

	const { orderId } = req.params as { orderId: string };
	const order = await scopedOrders(shopId).findOne(orderId);

	if (!order) {
		return res.status(404).json({ error: "Order not found" });
	}

	return res.json(order);
}

export async function updateOrderStatus(req: Request, res: Response) {
	const shopId = req.auth!.shopId;
	if (!shopId) {
		return res
			.status(403)
			.json({ error: "No shop associated with this account" });
	}

	const parsed = updateStatusSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: parsed.error.flatten().fieldErrors });
	}

	const { orderId } = req.params as { orderId: string };
	const updated = await scopedOrders(shopId).updateStatus(
		orderId,
		parsed.data.status,
	);

	if (!updated) {
		return res.status(404).json({ error: "Order not found" });
	}

	return res.json(updated);
}
