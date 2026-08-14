import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { shopRouter } from "./routes/shop.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { meRouter } from "./routes/me.routes.js";
import { initSocket } from "./lib/socket.js";

const app = express();

const allowedOrigins = ["https://printflow.cc", "https://www.printflow.cc", ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173"] : []),];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/shops", shopRouter);
app.use("/auth", authRouter);
app.use("/me", meRouter);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(4000, () => console.log("API running on :4000"));
// deploy workflow test
