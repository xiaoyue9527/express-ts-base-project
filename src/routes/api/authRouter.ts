import { Router } from "express";
import { registerUser, loginUser } from "../../controllers/user/authController";
import asyncWrap from "../../utils/asyncWrap";

const authRouter = Router();

authRouter.post("/register", asyncWrap(registerUser));

authRouter.post("/login", asyncWrap(loginUser));

export default authRouter;
