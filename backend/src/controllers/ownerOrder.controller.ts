import { scopedOrders } from "../lib/scopedOrders.js";
import type { Request, Response } from "express";

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
