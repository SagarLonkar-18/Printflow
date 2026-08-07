import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

interface AuthPayload {
	userId: string;
	shopId: string | null;
}

export function initSocket(httpServer: HttpServer) {
	io = new Server(httpServer, {
		cors: { origin: process.env.CLIENT_URL ?? "*" },
	});

	// Runs once, when a client first tries to connect - before "connection".
	// This is our equivalent of requireAuth, but for sockets instead of HTTP.
	io.use((socket, next) => {
		const token = socket.handshake.auth?.token as string | undefined;

		if (!token) {
			return next(new Error("UNAUTHORIZED"));
		}

		try {
			const payload = jwt.verify(
				token,
				process.env.JWT_SECRET!,
			) as AuthPayload;
			if (!payload.shopId) {
				return next(new Error("FORBIDDEN"));
			}
			(socket as any).shopId = payload.shopId;
			next();
		} catch {
			next(new Error("UNAUTHORIZED"));
		}
	});

	io.on("connection", (socket) => {
		const shopId = (socket as any).shopId as string;
		socket.join(roomForShop(shopId));
		console.log(`Socket connected for shop ${shopId}`);
	});

	return io;
}

export function roomForShop(shopId: string) {
	return `shop:${shopId}`;
}

export function emitNewOrder(shopId: string, order: unknown) {
	io.to(roomForShop(shopId)).emit("order:new", order);
}
