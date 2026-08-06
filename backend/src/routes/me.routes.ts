import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { listMyOrders } from "../controllers/ownerOrder.controller.js";

export const meRouter = Router();
meRouter.get("/orders", requireAuth, listMyOrders);