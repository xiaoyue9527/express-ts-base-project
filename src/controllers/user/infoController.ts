import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { ClientBadRequestError, ClientUnauthorizedError } from "../../errors";
import { getCache, setCache, delCache } from "../../utils/cache";

const CACHE_TTL = 3600; // 缓存时间，单位为秒

// 获取用户信息
export const getUserInfo = async (req: Request, res: Response) => {
  const cacheKey = `user:${req.user!.id}`;
  let user = await getCache(cacheKey);

  if (!user) {
    user = await UserModel.findById(req.user!.id as string);
    if (!user) {
      throw new ClientUnauthorizedError("User not found");
    }
    await setCache(cacheKey, user, CACHE_TTL);
  }

  res.json(user);
};

// 更新用户信息
export const updateUserInfo = async (req: Request, res: Response) => {
  const user = await UserModel.updateUser(req.user!.id, req.body);
  if (!user) {
    throw new ClientUnauthorizedError("User not found");
  }

  // 更新缓存
  const cacheKey = `user:${req.user!.id}`;
  await setCache(cacheKey, user, CACHE_TTL);

  res.json(user);
};
