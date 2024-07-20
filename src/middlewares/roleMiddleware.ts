import { Request, Response, NextFunction } from "express";
import { Role } from "../types/user";
import { ClientForbiddenError, ClientUnauthorizedError } from "../errors";

export const roleMiddleware = (requiredRole: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ClientUnauthorizedError();
    }

    if (typeof requiredRole === "string") {
      if (req.user.role !== requiredRole) {
        throw new ClientForbiddenError();
      }
    } else if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(req.user.role)) {
        throw new ClientForbiddenError();
      }
    }

    next();
  };
};
