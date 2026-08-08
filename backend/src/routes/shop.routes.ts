import { Router } from "express";
import { getShopBySlug } from "../controllers/shop.controller.js";
import { createOrder } from "../controllers/customerOrder.controller.js";
import { orderCreationLimiter } from "../middleware/rateLimit.middleware.js";
import { presignUpload } from "../controllers/customerOrder.controller.js";

export const shopRouter = Router();

shopRouter.get("/:slug", getShopBySlug);
shopRouter.post("/:slug/orders", orderCreationLimiter,createOrder);
shopRouter.post("/:slug/upload-url", presignUpload);