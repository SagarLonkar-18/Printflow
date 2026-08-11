import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { randomBytes } from "crypto";

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

function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(shopName: string): Promise<string> {
	const base = slugify(shopName);
	let slug = base;
	let attempt = 0;

	while (await prisma.shop.findUnique({ where: { slug } })) {
		attempt++;
		// After a few collisions, stop trying "nice" variants and just append randomness
		const suffix =
			attempt <= 2 ? String(attempt + 1) : randomBytes(2).toString("hex");
		slug = `${base}-${suffix}`;
	}

	return slug;
}

export async function signup(
	email: string,
	password: string,
	shopName: string,
) {
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("EMAIL_TAKEN");
	}

	const shopSlug = await generateUniqueSlug(shopName);
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
