import { Router } from "express";
import { getShopBySlug } from "../controllers/shop.controller.js";

export const shopRouter = Router();

shopRouter.get("/:slug", getShopBySlug);