import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyOrder, listMyOrders } from "../controllers/ownerOrder.controller.js";

export const meRouter = Router();
meRouter.get("/orders", requireAuth, listMyOrders);
meRouter.get("/orders/:orderId", requireAuth, getMyOrder);