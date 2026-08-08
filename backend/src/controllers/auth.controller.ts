import type { Request, Response } from "express";
import { z } from "zod";
import { login, signup } from "../services/auth.service.js";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	shopName: z.string().min(1),
	shopSlug: z
		.string()
		.min(1)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must be lowercase letters, numbers, and hyphens only",
		),
});

export async function loginHandler(req: Request, res: Response) {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: parsed.error.flatten().fieldErrors });
	}

	try {
		const result = await login(parsed.data.email, parsed.data.password);
		return res.json(result);
	} catch {
		return res.status(401).json({ error: "Invalid email or password" });
	}
}

export async function signupHandler(req: Request, res: Response) {
	const parsed = signupSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: parsed.error.flatten().fieldErrors });
	}

	try {
		const result = await signup(
			parsed.data.email,
			parsed.data.password,
			parsed.data.shopName,
			parsed.data.shopSlug,
		);
		return res.status(201).json(result);
	} catch (e: any) {
		if (e.message === "EMAIL_TAKEN") {
			return res
				.status(409)
				.json({ error: "An account with this email already exists" });
		}
		if (e.message === "SLUG_TAKEN") {
			return res
				.status(409)
				.json({ error: "This shop URL is already taken" });
		}
		throw e;
	}
}
