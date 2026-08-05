import "dotenv/config";
import express from "express";
import { shopRouter } from "./routes/shop.routes.js";
import { authRouter } from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/shops", shopRouter);
app.use("/auth", authRouter);

app.listen(4000, () => console.log("API running on :4000"));