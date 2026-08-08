import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export async function login(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { shop: true },
	});

	if (!user) {
		throw new Error("INVALID_CREDENTIALS");
	}

	const passwordMatches = await bcrypt.compare(password, user.passwordHash);
	if (!passwordMatches) {
		throw new Error("INVALID_CREDENTIALS");
	}

	const token = jwt.sign(
		{ userId: user.id, shopId: user.shop?.id ?? null },
		process.env.JWT_SECRET!,
		{ expiresIn: "7d" },
	);

	return {
		token,
		user: { id: user.id, email: user.email, shopId: user.shop?.id ?? null },
	};
}

export async function signup(
	email: string,
	password: string,
	shopName: string,
	shopSlug: string,
) {
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("EMAIL_TAKEN");
	}

	const existingSlug = await prisma.shop.findUnique({
		where: { slug: shopSlug },
	});
	if (existingSlug) {
		throw new Error("SLUG_TAKEN");
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			passwordHash,
			shop: {
				create: { name: shopName, slug: shopSlug },
			},
		},
		include: { shop: true },
	});

	const token = jwt.sign(
		{ userId: user.id, shopId: user.shop!.id },
		process.env.JWT_SECRET!,
		{ expiresIn: "7d" },
	);

	return {
		token,
		user: { id: user.id, email: user.email, shopId: user.shop!.id },
	};
}
