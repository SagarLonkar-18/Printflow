import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../lib/redis.js";

export const orderCreationLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute window
	max: 10, // max 10 requests per IP per window
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Too many orders submitted. Please wait a minute and try again.",
	},
	store: new RedisStore({
		sendCommand: (...args: string[]) =>(redis.call as any)(...args),
	}),
});
