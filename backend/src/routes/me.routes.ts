import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyOrder, getFileDownloadUrl, listMyOrders, updateFileStatus } from "../controllers/ownerOrder.controller.js";
import { getMyShop, updateShopPricing } from "../controllers/shopOwner.controller.js";

export const meRouter = Router();
meRouter.get("/orders", requireAuth, listMyOrders);
meRouter.get("/orders/:orderId", requireAuth, getMyOrder);
meRouter.patch("/files/:fileId/status", requireAuth, updateFileStatus);
meRouter.get("/files/:fileId/download-url", requireAuth, getFileDownloadUrl);
meRouter.get("/shop", requireAuth, getMyShop);
meRouter.patch("/shop/pricing", requireAuth, updateShopPricing);