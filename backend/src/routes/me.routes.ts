import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyOrder, getOrderDownloadUrl, listMyOrders, updateOrderStatus } from "../controllers/ownerOrder.controller.js";

export const meRouter = Router();
meRouter.get("/orders", requireAuth, listMyOrders);
meRouter.get("/orders/:orderId", requireAuth, getMyOrder);
meRouter.patch("/orders/:orderId/status", requireAuth, updateOrderStatus);
meRouter.get("/orders/:orderId/download-url", requireAuth, getOrderDownloadUrl);