import { Express } from "express";
import { requestParserMiddleware } from "./requestParser";
import { rateLimitMiddleware } from "./rateLimit";
import { corsMiddleware } from "./corsMiddleware";
import morganMiddleware from "./loggerHandler";
import { helmetMiddleware } from "./helmet";
import { swaggerMiddleware } from "./swagger";

export const initMiddleware = (app: Express) => {
  // 注册安全头中间件
  helmetMiddleware(app);

  // 注册请求解析中间件
  requestParserMiddleware(app);

  // 使用 morgan 中间件记录请求日志
  app.use(morganMiddleware);

  // 注册 CORS 中间件
  corsMiddleware(app);

  // 注册请求限流中间件
  rateLimitMiddleware(app);

  // 注册 Swagger 中间件
  swaggerMiddleware(app);
};
