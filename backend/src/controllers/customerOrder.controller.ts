import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { emitNewOrder } from "../lib/socket.js";
import { createPresignedUpload } from "../services/s3.service.js";

const createOrderSchema = z.object({
	files: z.array(
		z.object({
			fileKey: z.string().min(1),
			originalName: z.string().min(1),
			copies: z.number().int().min(1).max(500).optional(),
			colorMode: z.enum(["BW", "COLOR"]).optional(),
		}),
	).min(1, "At least one file is required"),
});

const presignSchema = z.object({
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
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
			files: {
				create: parsed.data.files.map((f) => ({
					fileKey: f.fileKey,
					originalName: f.originalName,
					...(f.copies !== undefined ? { copies: f.copies } : {}),
				...(f.colorMode !== undefined ? { colorMode: f.colorMode } : {}),
				})),
			},
		},
		include: { files: true },
	});

	emitNewOrder(shop.id, order);

	return res.status(201).json(order);
}

export async function presignUpload(req: Request, res: Response) {
	const { slug } = req.params as { slug: string };

	const parsed = presignSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: parsed.error.flatten().fieldErrors });
	}

	const shop = await prisma.shop.findUnique({ where: { slug } });
	if (!shop) {
		return res.status(404).json({ error: "Shop not found" });
	}

	try {
		const { uploadUrl, key } = await createPresignedUpload(
			slug,
			parsed.data.fileName,
			parsed.data.mimeType,
		);
		return res.json({ uploadUrl, fileKey: key });
	} catch (e: any) {
		if (e.message === "UNSUPPORTED_FILE_TYPE") {
			return res
				.status(400)
				.json({ error: "Only PDF files are supported" });
		}
		throw e;
	}
}
