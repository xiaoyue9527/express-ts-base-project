import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import BaseModel, { IBaseDocument, baseSchemaDict } from "./baseModel"; // 引入更新后的 BaseModel

// 用户接口，包含字段和方法
export interface IUser extends IBaseDocument {
  username: string; // 用户名，必须唯一
  email: string; // 邮箱，必须唯一
  password: string; // 密码
  role: "guest" | "user" | "admin" | "super"; // 用户角色
  name?: string; // 姓名
  phoneNumber?: string; // 电话号码
  profilePicture?: string; // 头像URL
  dateOfBirth?: Date; // 出生日期
  address?: string; // 地址
  isActive: boolean; // 是否激活
  isVerified: boolean; // 是否验证
  lastLogin?: Date; // 最后登录时间
  passwordResetToken?: string; // 密码重置令牌
  passwordResetExpires?: Date; // 密码重置令牌过期时间
  loginAttempts: number; // 登录尝试次数
  lockUntil?: Date; // 锁定账户直到某个时间
  comparePassword(candidatePassword: string): Promise<boolean>; // 比较密码方法
}

// 用户 Schema 定义
const userSchemaDefinition: mongoose.SchemaDefinition = {
  username: { type: String, required: true, unique: true }, // 用户名，必须唯一
  email: { type: String, required: true, unique: true }, // 邮箱，必须唯一
  password: { type: String, required: true }, // 密码
  role: {
    type: String,
    enum: ["guest", "user", "admin", "super"], // 用户角色
    default: "guest", // 默认角色为 guest
  },
  name: { type: String }, // 姓名
  phoneNumber: { type: String }, // 电话号码
  profilePicture: { type: String }, // 头像URL
  dateOfBirth: { type: Date }, // 出生日期
  address: { type: String }, // 地址
  isActive: { type: Boolean, default: true }, // 是否激活，默认激活
  isVerified: { type: Boolean, default: false }, // 是否验证，默认未验证
  lastLogin: { type: Date }, // 最后登录时间
  passwordResetToken: { type: String }, // 密码重置令牌
  passwordResetExpires: { type: Date }, // 密码重置令牌过期时间
  loginAttempts: { type: Number, default: 0 }, // 登录尝试次数，默认0次
  lockUntil: { type: Date }, // 锁定账户直到某个时间
};

class UserModel extends BaseModel<IUser> {
  constructor() {
    super("User", userSchemaDefinition);

    // 比较密码方法
    this.getModel().schema.methods.comparePassword = function (
      candidatePassword: string
    ): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password);
    };
  }

  // 单独的比较密码方法
  comparePassword(candidatePassword: string, hashPass: string) {
    return bcrypt.compare(candidatePassword, hashPass);
  }

  // 用户注册
  async register(userData: IUser) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    const user = new (this.getModel())(userData);
    await user.save();
    return user;
  }

  // 用户登录
  async login(email: string, password: string) {
    const user = await this.getModel().findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid password");

    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  // 用户登出
  async logout(userId: string) {
    // 实现登出逻辑，例如销毁会话或令牌
  }

  // 根据ID获取用户
  async getUserById(userId: string) {
    return this.getModel().findById(userId);
  }

  // 更新用户信息
  async updateUser(userId: string, updateData: Partial<IUser>) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    updateData.updatedAt = new Date();
    return this.getModel().findByIdAndUpdate(userId, updateData, { new: true });
  }

  // 删除用户
  async deleteUser(userId: string) {
    return this.getModel().findByIdAndDelete(userId);
  }

  // 请求密码重置邮件token
  async requestPasswordReset(email: string) {
    const user = await this.getModel().findOne({ email });
    if (!user) throw new Error("User not found");

    // 生成密码重置令牌和过期时间
    const token = bcrypt.genSaltSync(10);
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1小时后过期
    await user.save();

    return token;
  }

  // 重置密码
  async resetPassword(token: string, newPassword: string) {
    const user = await this.getModel().findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) throw new Error("Token is invalid or has expired");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  // 管理员重置用户密码
  async resetPasswordByAdmin(userId: string, newPassword?: string) {
    const user = await this.getModel().findById(userId);
    if (!user) throw new Error("User not found");

    // 如果没有指定新密码，则生成一个随机密码
    if (!newPassword) {
      newPassword = Math.random().toString(36).slice(-8);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return newPassword;
  }

  // 用户自己重置密码
  async resetPasswordByUser(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.getModel().findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new Error("Invalid old password");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  }
}

export default new UserModel();
