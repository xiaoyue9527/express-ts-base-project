import { Router } from "express";
import {
  getUserInfo,
  updateUserInfo,
} from "../../controllers/user/infoController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import {
  resetPasswordByAdminHandler,
  resetPasswordByUserHandler,
} from "../../controllers/user/securityController";
import asyncWrap from "../../utils/asyncWrap";

const userRouter = Router();


userRouter.get(
  "/me",
  authMiddleware,
  roleMiddleware(["admin", "super", "user"]),
  asyncWrap(getUserInfo)
);


userRouter.put(
  "/me",
  authMiddleware,
  roleMiddleware(["admin", "super", "user"]),
  asyncWrap(updateUserInfo)
);

userRouter.post(
  "/reset-password/admin",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  asyncWrap(resetPasswordByAdminHandler)
);


userRouter.post(
  "/reset-password/user",
  authMiddleware,
  roleMiddleware(["admin", "super", "user"]),
  asyncWrap(resetPasswordByUserHandler)
);

export default userRouter;
