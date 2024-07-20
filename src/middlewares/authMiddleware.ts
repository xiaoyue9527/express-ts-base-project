import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    (req.query.token as string);
  if (!token || Array.isArray(token)) {
    req.user = { id: "", username: "", role: "guest" }; // 设置为游客身份
    return next();
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret") as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    req.user = { id: "", username: "", role: "guest" }; // 设置为游客身份
    next();
  }
};
