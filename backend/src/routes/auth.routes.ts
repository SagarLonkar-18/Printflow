import { Router } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller.js";

export const authRouter = Router();
authRouter.post("/login", loginHandler);
authRouter.post("/signup", signupHandler);