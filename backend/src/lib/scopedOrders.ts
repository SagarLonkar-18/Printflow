import { prisma } from "./prisma.js";

/**
 * Every function here takes shopId as a required argument, and every
 * query is filtered by it. There is no way to call these and accidentally
 * fetch/modify an order belonging to a different shop.
 */
export function scopedOrders(shopId: string) {
	return {
		findMany: () =>
			prisma.order.findMany({
				where: { shopId },
				orderBy: { createdAt: "desc" },
			}),

		findOne: async (orderId: string) => {
			const order = await prisma.order.findUnique({
				where: { id: orderId },
			});

			// Not just "where shopId" in the query - an EXPLICIT check.
			// If the order exists but belongs to a different shop, treat it
			// exactly like "not found". Never let the caller learn "this order
			// exists, it's just not yours" - that itself leaks information.
			if (!order || order.shopId !== shopId) {
				return null;
			}
			return order;
		},

		updateStatus: async (orderId: string, status: string) => {
			const existing = await prisma.order.findUnique({
				where: { id: orderId },
			});
			if (!existing || existing.shopId !== shopId) {
				return null;
			}
			return prisma.order.update({
				where: { id: orderId },
				data: { status },
			});
		},
	};
}
