import type { Request, Response } from "express";
import { z } from "zod";
import { login } from "../services/auth.service.js";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
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
