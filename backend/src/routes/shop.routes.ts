import { Router } from "express";
import { getShopBySlug } from "../controllers/shop.controller.js";
import { createOrder } from "../controllers/order.controller.js";

export const shopRouter = Router();

shopRouter.get("/:slug", getShopBySlug);
shopRouter.post("/:slug/orders", createOrder);