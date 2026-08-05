import { Router } from "express";
import { loginHandler } from "../controllers/auth.controller.js";

export const authRouter = Router();
authRouter.post("/login", loginHandler);