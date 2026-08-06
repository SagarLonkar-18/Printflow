import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
	userId: string;
	shopId: string | null;
}

declare global {
	namespace Express {
		interface Request {
			auth?: AuthPayload;
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header || !header.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Missing or malformed Authorization header" });
	}

	const token = header.slice("Bearer ".length);

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!,
		) as AuthPayload;
		req.auth = payload;
		next();
	} catch {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
