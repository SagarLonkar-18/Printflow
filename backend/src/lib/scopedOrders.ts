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
				include: { files: true },
			}),

		findOne: async (orderId: string) => {
			const order = await prisma.order.findUnique({
				where: { id: orderId },
				include: { files: true },
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

		// New: scoped lookup for a single FILE, not the whole order.
		// Print/status-update actions now happen per-file, so this is the
		// actual unit of tenant-isolated ownership-checking going forward.
		findFile: async (fileId: string) => {
			const file = await prisma.orderFile.findUnique({
				where: { id: fileId },
				include: { order: true },
			});
			if (!file || file.order.shopId !== shopId) return null;
			return file;
		},

		updateFileStatus: async (fileId: string, status: string) => {
			const file = await prisma.orderFile.findUnique({
				where: { id: fileId },
				include: { order: true },
			});
			if (!file || file.order.shopId !== shopId) return null;
			return prisma.orderFile.update({ where: { id: fileId }, data: { status } });
		},
	};
}
