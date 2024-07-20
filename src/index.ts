import express from "express";
import { getConfig } from "./config/config";
import errorHandler from "./middlewares/errorHandler";
import logger from "./logger";
import { initializeMongoose } from "./config/database";
import initRoutes from "./routes";
import { initMiddleware } from "./middlewares";

// 读取配置文件
const config = getConfig();

// 创建 Express 应用
const app = express();

// 初始化 Mongoose 连接
initializeMongoose();

// 初始化中间件
initMiddleware(app);

// 初始化路由
initRoutes(app);

// 使用错误处理中间件记录错误日志
app.use(errorHandler);

// 服务器配置
const serverConfig = {
  port: config.APP.port || 3000, // 从配置文件读取端口，默认3000
  hostname: config.APP.host || "localhost", // 从配置文件读取主机名，默认localhost
};

// 启动服务器并监听指定端口
app.listen(serverConfig, () => {
  logger.info(
    `${config.APP.name} Server is running on http://${serverConfig.hostname}:${serverConfig.port}`
  );
});
