import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  ClientBadRequestError,
  ClientForbiddenByRiskControlError,
  ClientUnauthorizedError,
} from "../../errors";
import UserModel from "../../models/UserModel";
import { getConfig } from "../../config/config";
import { setCache } from "../../utils/cache";
import { incrementLoginAttempts, resetLoginAttempts } from "../../cache/auth";

const CACHE_TTL = 3600; // 缓存时间，单位为秒
const MAX_LOGIN_ATTEMPTS = 10;
const LOGIN_ATTEMPTS_TTL = 24 * 60 * 60; // 1天，单位为秒

// 注册用户
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json(user);
  } catch (error: any) {
    throw new ClientBadRequestError(error.message);
  }
};

// 登录用户
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ClientUnauthorizedError("Invalid email or password");
  }

  const loginAttemptsKey = `loginAttempts:${email}`;
  const attempts = await incrementLoginAttempts(
    loginAttemptsKey,
    LOGIN_ATTEMPTS_TTL
  );

  if (attempts > MAX_LOGIN_ATTEMPTS) {
    console.log("风控");
    throw new ClientForbiddenByRiskControlError(
      "Too many login attempts. Please try again later."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ClientUnauthorizedError("Invalid email or password");
  }

  // 重置登录尝试次数
  await resetLoginAttempts(loginAttemptsKey);

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    getConfig().jwt_secret,
    { expiresIn: "15d" }
  );

  // 更新缓存
  const cacheKey = `user:${user._id}`;
  await setCache(cacheKey, user, CACHE_TTL);

  res.json({ token });
};
