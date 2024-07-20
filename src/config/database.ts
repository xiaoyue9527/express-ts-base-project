import mongoose, { ConnectOptions } from "mongoose";
import { getConfig } from "./config";
import logger from "../logger";
const config = getConfig();
// 从配置文件中读取数据库配置
const mongoUrl: string = config.database.url;
const options: ConnectOptions = config.database.options;

export const initializeMongoose = async () => {
  try {
    await mongoose.connect(mongoUrl, options);
    logger.info("MongoDB 连接成功...");
  } catch (err) {
    console.error("MongoDB 连接错误:", err);
  }

  mongoose.connection.on("connected", () => {
    logger.info("Mongoose 已连接到数据库");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose 连接错误:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.info("Mongoose 已断开与数据库的连接");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("应用程序终止，Mongoose 已断开连接");
    process.exit(0);
  });
};
