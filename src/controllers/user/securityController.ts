import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { ClientBadRequestError } from "../../errors";
import { delCache } from "../../utils/cache";

// // 发送重置token
// export const requestPasswordReset = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const token = await UserModel.requestPasswordReset(email);
//     // 发送重置密码邮件的逻辑--------------------------------------------------------
//     res.json({ message: "Password reset token sent to email" });
//   } catch (error: any) {
//     throw new ClientBadRequestError(error.message);
//   }
// };

// // 重置密码
// export const resetPassword = async (req: Request, res: Response) => {
//   try {
//     const { token, newPassword } = req.body;
//     await UserModel.resetPassword(token, newPassword);
//     res.json({ message: "Password has been reset" });
//   } catch (error: any) {
//     throw new ClientBadRequestError(error.message);
//   }
// };

// 管理员重置用户密码
export const resetPasswordByAdminHandler = async (
  req: Request,
  res: Response
) => {
  const { userId, newPassword } = req.body;
  const password = await UserModel.resetPasswordByAdmin(userId, newPassword);

  // 删除缓存
  const cacheKey = `user:${userId}`;
  await delCache(cacheKey);

  res.json({ message: "Password has been reset", password });
};

// 用户自己重置密码
export const resetPasswordByUserHandler = async (
  req: Request,
  res: Response
) => {
  const { userId, oldPassword, newPassword } = req.body;
  await UserModel.resetPasswordByUser(userId, oldPassword, newPassword);

  // 删除缓存
  const cacheKey = `user:${userId}`;
  await delCache(cacheKey);

  res.json({ message: "Password has been reset" });
};
