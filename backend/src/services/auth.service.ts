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
